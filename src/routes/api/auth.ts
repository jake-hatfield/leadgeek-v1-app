// packages
import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// env
const jwtSecret = process.env.REACT_APP_JWT_SECRET;

// middleware
import auth from '../../middleware/auth';

// models
import User, { IUserDocument } from '../../models/User';

// router
const router = Router();

// @route       GET api/auth
// @description Find user
// @access      Private
router.get('/', auth, async (req: Request, res: Response) => {
	try {
		// THIS MAY CAUSE AN ISSUE BY MAKING IT REQ.BODY.USER INSTEAD OF REQ.USER
		const user = await User.findById(req.body.user.id).select('-password');
		return res.json(user);
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

// @route       POST api/auth
// @description Authenticate user and get token
// @access      Public
router.post('/', async (req: Request, res: Response) => {
	// get email and password out of request body
	const email: string = req.body.email;
	const password: string = req.body.password;

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

		// user.lastLoggedIn = Date.now();
		user.save();

		// return the JWT
		const payload = {
			user: {
				id: user.id,
			},
		};

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
});

// @route       POST api/auth/surrogate-user
// @description Log in as user for administrative purposes
// @access      Private
router.post('/surrogate-user', auth, async (req: Request, res: Response) => {
	try {
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
});

// @route       POST api/auth/forgot-password
// @description request forgot password
// @access      Public
// router.post('/forgot-password', async (req: Request, res: Response) => {
// 	try {
// 		const { email } = req.body;
// 		if (email === '') {
// 			console.log('No email sent.');
// 			res.status(400).send('Email required');
// 		}
// 		let user = await User.findOne({ email });
// 		if (user === null) {
// 			const error = 'Email not found in database';
// 			console.error(error);
// 			return res.status(403).send(error);
// 		} else {
// 			const token = crypto.randomBytes(20).toString('hex');
// 			const updatedData = {
// 				resetPwToken: token,
// 				resetPwExpires: Date.now() + 3600000,
// 			};
// 			// update the user's token and token expiration date
// 			User.findOneAndUpdate({ email }, updatedData).then(function (
// 				result,
// 				error
// 			) {
// 				if (!error) {
// 					console.log('Success updating user');
// 				} else {
// 					console.log(`Error updating user: ${error}`);
// 				}
// 			});

// 			const transporter = nodemailer.createTransport({
// 				name: 'improvmx',
// 				host: 'smtp.improvmx.com',
// 				port: 587,
// 				secure: false,
// 				auth: {
// 					user: process.env.REACT_APP_EMAIL_ADDRESS,
// 					pass: process.env.REACT_APP_EMAIL_PASSWORD,
// 				},
// 				tls: {
// 					rejectUnauthorized: false,
// 				},
// 				debug: true,
// 			});
// 			let url;
// 			if (process.env.NODE_ENV === 'production') {
// 				url = `https://app.leadgeek.io`;
// 			} else {
// 				url = `http://localhost:3000`;
// 			}
// 			const mailOptions = {
// 				from: '"LeadGeek Support" <support@leadgeek.io>',
// 				to: `${user.name} <${user.email}>`,
// 				subject: 'Link To Reset Password',
// 				text:
// 					'You are receiving this email because you (or someone else) have requested to reset your LeadGeek account password. \n\n' +
// 					'Please click on the following link or paste this into your browser to complete the password reset process within one hour of receiving this email: \n\n' +
// 					`${url}/reset/reset-password/${token} \n\n` +
// 					'If you did not request this, please ignore this email and your password will remain unchanged. \n',
// 			};
// 			console.log('Sending email...');
// 			transporter.verify(function (error, success) {
// 				if (error) {
// 					console.log(error);
// 				} else {
// 					console.log('Server is ready to take our messages');
// 					transporter.sendMail(mailOptions, (err, res) => {
// 						if (err) {
// 							console.error('There was an error sending the email: ', err);
// 							return res.status(200).json({
// 								message:
// 									'There was an error sending the password recovery email',
// 							});
// 						} else {
// 							console.log(
// 								'Email sent successfully. Here are the details:',
// 								res
// 							);
// 						}
// 					});
// 					return res.status(200).json({
// 						message: 'Password recovery email sent successfully',
// 						token,
// 					});
// 				}
// 			});
// 		}
// 	} catch (error) {
// 		console.error(error.message);
// 		return res.status(500).send('Server error');
// 	}
// });

// @route       GET api/auth/reset-password-validation
// @description validate password reset token
// @access      Public
router.post(
	'/reset-password-validation',
	async (req: Request, res: Response) => {
		try {
			console.log('Searching for user password reset token...');
			let user = await User.findOne({
				resetPwToken: req.body.resetPwToken,
				// resetPwExpires: {
				// 	$gte: Date.now(),
				// },
			});

			if (!user) {
				console.error('Token not found.');
				return res.status(400).json({
					errors: [{ message: 'Password reset link expired or invalid' }],
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
router.put('/update-password', async (req: Request, res: Response) => {
	const { email, password } = req.body;
	try {
		let user = await User.findOne({
			email,
		});
		if (user) {
			console.log('User found in the database');
			// encrypt password
			const salt = await bcrypt.genSalt(10);
			const newHashedPassword = await bcrypt.hash(password, salt);
			// await user.updateOne({
			// 	password: newHashedPassword,
			// 	resetPwToken: null,
			// 	resetPwExpires: null,
			// });
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
});

module.exports = router;
