// packages
import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import nodemailer from 'nodemailer';

// env
const jwtSecret = process.env.REACT_APP_JWT_SECRET;

// middleware
import auth from '../../middleware/auth';

// models
import User, { IUserDocument } from '../../models/User';
import Notification from '@models/Notification';

// router
const router = Router();

// @route       GET api/auth
// @description Find user
// @access      Private
router.get('/', auth, async (req: Request, res: Response) => {
	try {
		// lookup user and strip the password before sending it to the frontend
		const user = await User.findById(req.body.user.id).select('-password');

		// the notification time is in seconds, so convert to miliseconds for comparision
		const lastLogin = user.lastLoggedIn / 1000;

		// get new notifications based on time
		const notifications = await Notification.find({
			date: { $gte: lastLogin },
		}).sort({ date: -1 });

		const newNotifications: { _id: ObjectId }[] = [];

		// check if the notification is already in user array and add it to new notifications if not
		notifications.forEach(
			(notification) =>
				user.notifications.map((n) => n._id).indexOf(notification.id) < 0 &&
				newNotifications.push({ _id: notification.id })
		);

		// add the unseen notifications to the user's array
		user.notifications = [...user.notifications, ...newNotifications];

		user.lastLoggedIn = new Date().getTime();

		// save the user's notifications in DB
		await user.save();

		return res.json(user);
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

// @route       POST api/auth
// @description Authenticate user and get token
// @access      Public
router.post(
	'/',
	async (
		req: Request<{}, {}, { email: string; password: string }>,
		res: Response
	) => {
		// destructure necessary items
		const { email, password } = req.body;

		try {
			// see if user exists
			let user: IUserDocument = await User.findOne({ email });
			// if user doesn't exist, return a 401 error
			if (!user) {
				return res.status(401).json({
					token: null,
					errors: [
						{
							message:
								'Email & password combination not correct. Please try again or reset your password.',
						},
					],
				});
			}

			// validate password with bcrypt
			const isMatch = await bcrypt.compare(password, user.password);
			// if passwords don't match, return a 401 error
			if (!isMatch) {
				return res.status(401).json({
					token: null,
					errors: [
						{
							message:
								'Email & password combination not correct. Please try again or reset your password.',
						},
					],
				});
			}

			// return the JWT
			const payload = {
				user: {
					id: user.id,
				},
			};

			// sign the token with expiration after 5 days
			jwt.sign(
				payload,
				jwtSecret,
				{ expiresIn: 60 * 60 * 24 * 5 },
				(err, token) => {
					if (err) throw err;
					return res.json({ token, errors: null });
				}
			);
		} catch (error) {
			console.error(error.message);
			// if there's an error, it's got to be with the server
			res.status(500).send('Server error');
		}
	}
);

// @route       POST api/auth/surrogate-user
// @description Log in as user for administrative purposes
// @access      Private
router.post(
	'/surrogate-user',
	auth,
	async (req: Request<{}, {}, { id: string }>, res: Response) => {
		try {
			// destructure necessary items
			const { id } = req.body;

			if (id) {
				let user = await User.findOne({ _id: id });
				if (!user) {
					return res.status(400).json({
						errors: [
							{
								message:
									'Email & password combination not correct. Please try again or reset your password.',
							},
						],
					});
				}
				// return the JWT
				const payload = {
					user: {
						id,
					},
				};
				jwt.sign(
					payload,
					jwtSecret,
					{ expiresIn: 60 * 60 * 24 * 5 },
					(err, token) => {
						if (err) throw err;
						res.json({ token, user });
					}
				);
			} else {
				return res.status(200).json({
					errors: [
						{
							message: 'No user found.',
						},
					],
				});
			}
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

// @route       POST api/auth/forgot-password
// @description request forgot password
// @access      Public
router.post(
	'/forgot-password',
	async (req: Request<{}, {}, { email: string }>, res: Response) => {
		try {
			// destructure necessary items
			const { email } = req.body;

			// if no email, return error
			if (email === '') {
				console.log('No email sent.');
				res.status(400).send('Email required');
			}

			// lookup user
			const user = await User.findOne({ email });

			// if no user exists, return error
			if (user === null) {
				const error = 'Email not found in database';
				console.error(error);
				return res.status(403).send(error);
			} else {
				// create reset password token
				const token = crypto.randomBytes(20).toString('hex');

				// update user reset password in DB - token expires in 1 hour
				const update = {
					resetPwToken: token,
					resetPwExpires: Date.now() + 3600000,
				};

				// update the user's token and token expiration date
				await User.findOneAndUpdate({ email }, update);

				// create nodemailer transport
				const transporter = nodemailer.createTransport({
					name: 'improvmx',
					host: 'smtp.improvmx.com',
					port: 587,
					secure: false,
					auth: {
						user: process.env.REACT_APP_EMAIL_ADDRESS,
						pass: process.env.REACT_APP_EMAIL_PASSWORD,
					},
					tls: {
						rejectUnauthorized: false,
					},
					debug: true,
				});
				let url;

				// set url depending on environment
				if (process.env.NODE_ENV === 'production') {
					url = `https://app.leadgeek.io`;
				} else {
					url = `http://localhost:3000`;
				}

				// create email
				const mailOptions = {
					from: '"Leadgeek Support" <support@leadgeek.io>',
					to: `${user.name} <${user.email}>`,
					subject: 'Leadgeek password reset',
					text:
						'Hello,\n\n' +
						`We\'ve received a request to reset the password for the Leadgeek account associated with ${user.email}. No changes have been made to this account yet.\n\n` +
						'You can reset your password by clicking the link below.\n\n' +
						`${url}/reset/reset-password/${token} \n\n` +
						'The link expires in 1 hour. If you did not request a new password or need additional help, please let us know by emailing support@leadgeek.io. \n\n' +
						'-- Leadgeek Support \n',
				};

				console.log('Sending email...');

				// verify the email was sent
				transporter.verify(function (error, success) {
					if (error) {
						console.log(error);
					} else {
						console.log('Server is ready to take our messages');
						transporter.sendMail(mailOptions, (err, res) => {
							if (err) {
								console.error('There was an error sending the email: ', err);
							} else {
								console.log(
									'Email sent successfully. Here are the details:',
									res
								);
							}
						});
						return res.status(200).json({
							message: 'Password recovery email sent successfully',
							token,
						});
					}
				});
			}
		} catch (error) {
			console.error(error.message);
			return res.status(500).send('Server error');
		}
	}
);

// @route       POST api/auth/reset-password-validation
// @description validate password reset token
// @access      Public
router.post(
	'/reset-password-validation',
	async (req: Request<{}, {}, { resetPwToken: string }>, res: Response) => {
		try {
			console.log('Searching for user password reset token...');

			console.log(req.body.resetPwToken);

			// lookup for user
			const user = await User.findOne({
				resetPwToken: req.body.resetPwToken,
				resetPwExpires: {
					$gte: Date.now(),
				},
			});

			if (!user) {
				console.error('Token not found.');
				return res.status(400).json({
					error: { message: 'Password reset link expired or invalid' },
				});
			} else {
				console.log('Token found!');
				return res.status(200).send({
					user: user.email,
					message: 'Password reset link was validated',
				});
			}
		} catch (error) {
			console.error(error);
		}
	}
);

// @route       PUT api/auth
// @description update password in database
// @access      Public
router.put(
	'/update-password',
	async (
		req: Request<{}, {}, { email: string; password: string }>,
		res: Response
	) => {
		try {
			// destructure necessary items
			const { email, password } = req.body;

			// lookup user
			const user = await User.findOne({
				email,
			});

			if (user) {
				console.log('User found in the database');
				// encrypt password
				const salt = await bcrypt.genSalt(10);
				const newHashedPassword = await bcrypt.hash(password, salt);
				await user.updateOne({
					password: newHashedPassword,
					resetPwToken: null,
					resetPwExpires: null,
				});
				console.log('Password was succesfully updated');
				return res.status(200).send('Password was successfully updated');
			} else {
				const message = 'No user exists in the database to update';
				console.error(message);
				res.status(404).json(message);
			}
		} catch (error) {
			console.error(error);
		}
	}
);

module.exports = router;
