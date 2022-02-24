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
import auth from '@middleware/auth';

// utils
import { sendEmail } from '../../utils';

// models
import Notification from '@models/Notification';
import User, { IUserDocument } from '@models/User';

// router
const router = Router();

// @route       GET api/auth
// @description Find user
// @access      Private
router.get(
	'/',
	auth,
	async (
		req: Request<
			{},
			{},
			{
				user: {
					id: string;
				};
			}
		>,
		res: Response<{
			message: 'Returning user data' | 'Server error';
			user: IUserDocument | null;
		}>
	) => {
		try {
			// lookup user and strip the password before sending it to the frontend
			const user = await User.findById(req.body.user.id).select('-password');

			// the notification time in DB is in seconds, so convert to milliseconds for comparision
			const lastLogin = user.lastLoggedIn
				? user.lastLoggedIn
				: user.dateCreated;

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

			// update the last login time
			user.lastLoggedIn = new Date();

			// save the user's notifications in DB
			await user.save();

			return res.send({ message: 'Returning user data', user });
		} catch (error) {
			console.error(error.message);
			return res.status(500).send({ message: 'Server error', user: null });
		}
	}
);

// @route       POST api/auth
// @description Authenticate user and get token
// @access      Public
router.post(
	'/',
	async (
		req: Request<{}, {}, { email: string; password: string }>,
		res: Response<{
			message:
				| 'Email & password combination not correct.'
				| 'Login success'
				| 'Server error';
			token: string | null;
		}>
	) => {
		// destructure necessary items
		const { email, password } = req.body;

		try {
			// see if user exists
			let user: IUserDocument = await User.findOne({ email });

			// if user doesn't exist, return a 401 error
			if (!user) {
				return res.status(401).send({
					message: 'Email & password combination not correct.',
					token: null,
				});
			}

			// validate password with bcrypt
			const isMatch = await bcrypt.compare(password, user.password);
			// if passwords don't match, return a 401 error
			if (!isMatch) {
				return res.status(401).send({
					message: 'Email & password combination not correct.',
					token: null,
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
				{ algorithm: 'HS256', expiresIn: 60 * 60 * 24 * 5 },
				(err, token) => {
					if (err) throw err;
					return res.send({ message: 'Login success', token });
				}
			);
		} catch (error) {
			console.error(error.message);
			// if there's an error, it's got to be with the server
			res.status(500).send({ message: 'Server error', token: null });
		}
	}
);

// @route       GET api/auth/surrogate?id=__
// @description Log in as user (ADMIN)
// @access      Private
router.get(
	'/surrogate',
	auth,
	async (
		req: Request<
			{},
			{},
			{
				user: {
					id: string;
				};
			},
			{ id: string }
		>,
		res: Response<{
			message:
				| 'Access prohibited'
				| 'Surrogation successful'
				| 'Surrogation unsuccessful'
				| 'Server error';
			token: string | null;
			user: IUserDocument | null;
		}>
	) => {
		try {
			// destructure necessary items
			const { id: surrogateId } = req.query;
			const { id: userId } = req.body.user;

			const admin = await User.find({ _id: userId, role: 'master' });

			if (!admin) {
				return res.status(401).send({
					message: 'Access prohibited',
					token: null,
					user: null,
				});
			}

			if (surrogateId) {
				const user = await User.findOne({ _id: surrogateId });

				if (!user) {
					return res.status(401).send({
						message: 'Access prohibited',
						token: null,
						user: null,
					});
				}

				// return the JWT
				const payload = {
					user: {
						id: surrogateId,
					},
				};
				jwt.sign(
					payload,
					jwtSecret,
					{
						algorithm: 'HS256',
						expiresIn: 60 * 60 * 24 * 5,
					},
					(error, token) => {
						if (error) throw error;
						const message = 'Surrogation successful';
						console.log(message);
						return res.send({ message, token, user });
					}
				);
			} else {
				const message = 'Surrogation unsuccessful';
				console.log(message);

				return res.status(200).send({
					message,
					token: null,
					user: null,
				});
			}
		} catch (error) {
			console.error(error.message);
			return res
				.status(500)
				.send({ message: 'Server error', token: null, user: null });
		}
	}
);

// @route       GET api/auth/password?email=__
// @description request forgot password
// @access      Public
router.get(
	'/password',
	async (
		req: Request<{}, {}, {}, { email: string }>,
		res: Response<{
			message:
				| 'Email required'
				| 'Email not found'
				| 'Please contact support if this error persists'
				| 'Password recovery email sent successfully'
				| 'Server error';
			token: string | null;
		}>
	) => {
		try {
			// destructure necessary items
			const { email } = req.query;

			// if no email, return error
			if (email === '') {
				console.log('No email sent.');
				res.status(400).send({ message: 'Email required', token: null });
			}

			// lookup user
			const user = await User.findOne({ email });

			// if no user exists, return error
			if (user === null) {
				const error = 'Email not found';
				console.error(error);
				return res.status(403).send({ message: error, token: null });
			} else {
				// create reset password token
				const token = crypto.randomBytes(20).toString('hex');

				const addHoursToDate = (date: Date, hours: number): Date => {
					return new Date(new Date(date).setHours(date.getHours() + hours));
				};

				let date = new Date();

				// update user reset password in DB - token expires in 1 hour
				const update: {
					resetPwToken: string;
					resetPwExpires: Date;
				} = {
					resetPwToken: token,
					resetPwExpires: addHoursToDate(date, 1),
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

				// set url depending on environment
				let url;
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
						`${url}/reset/reset-password/?t=${token} \n\n` +
						'The link expires in 1 hour. If you did not request a new password or need additional help, please let us know by emailing support@leadgeek.io. \n\n' +
						'-- Leadgeek Support \n',
				};

				try {
					console.log('Attempting to send password reset email...');

					await sendEmail(mailOptions);
				} catch (error) {
					console.log(error);
				}
			}
		} catch (error) {
			console.error(error.message);
			return res.status(500).send({ message: 'Server error', token: null });
		}
	}
);

// @route       GET api/auth/password-validation?resetPwToken=__
// @description validate password reset token
// @access      Public
router.get(
	'/password-validation',
	async (
		req: Request<{}, {}, {}, { resetPwToken: string }>,
		res: Response<{
			message:
				| 'Password reset link expired or invalid'
				| 'Password reset link was validated';
			userEmail: string | null;
		}>
	) => {
		try {
			console.log("Searching for user's password reset token...");

			const currentTime = new Date();

			// lookup for user
			const user = await User.findOne({
				resetPwToken: req.query.resetPwToken,
				resetPwExpires: {
					$gte: currentTime,
				},
			});

			if (!user) {
				console.error('Token not found.');
				return res.status(200).send({
					message: 'Password reset link expired or invalid',
					userEmail: null,
				});
			} else {
				console.log('Token found!');
				return res.status(200).send({
					message: 'Password reset link was validated',
					userEmail: user.email,
				});
			}
		} catch (error) {
			console.error(error);
		}
	}
);

// @route       PUT api/auth/password?email=__&password=__
// @description update password in database
// @access      Public
router.put(
	'/password',
	async (
		req: Request<{}, {}, { email: string; password: string }>,
		res: Response<{
			message: 'Password was updated' | 'No user found';
		}>
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
				const message = 'Password was updated';
				console.log(message);
				return res.status(200).send({ message });
			} else {
				const message = 'No user found';
				console.error(message);
				return res.status(404).send({ message });
			}
		} catch (error) {
			console.error(error);
		}
	}
);

// @route       PUT api/auth/profile?&name=__
// @description update profile in database
// @access      Private
router.put(
	'/profile',
	auth,
	async (
		req: Request<{}, {}, { user: { id: string }; name: string }>,
		res: Response<{
			message: 'Profile was successfully updated' | 'No user found';
		}>
	) => {
		try {
			// destructure necessary items
			const {
				name,
				user: { id: userId },
			} = req.body;

			// lookup user
			const user = await User.findOne({
				_id: userId,
			});

			if (user) {
				console.log('User found in the database');

				await user.updateOne({
					name,
				});

				const message = 'Profile was successfully updated';
				console.log(message);

				return res.status(200).send({ message });
			} else {
				const message = 'No user found';
				console.error(message);
				return res.status(404).send({ message });
			}
		} catch (error) {
			console.error(error);
		}
	}
);

module.exports = router;
