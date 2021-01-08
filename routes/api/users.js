const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route       POST api/users
// @description Register user
// @access      Public
router.post(
	'/',
	[
		// validate name, email and pw
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check(
			'password',
			'Please enter a password with 6 or more characters'
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// there was a validation error, return the array to display in UI
			return res.status(400).json({ errors: errors.array() });
		}
		// destructure name, email and pw out of the body
		const { name, email, password } = req.body;

		try {
			// see if user exists
			let user = await User.findOne({ email });
			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'User already exists' }] });
			}
			// user doesn't already exist, so get their gravatar
			const avatar = gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm',
			});

			user = new User({
				name,
				email,
				avatar,
				password,
			});
			// encrypt password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save();
			// return the JWT
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			// if there's an error, it's got to be with the server
			res.status(500).send('Server error');
		}
	}
);

// @route       POST api/users/forgotPassword
// @description request forgot password
// @access      Public
router.post('/forgotPassword', async (req, res) => {
	try {
		const { email } = req.body;
		if (email === '') {
			res.status(400).send('Email required');
		}
		let user = await User.findOne({ email });
		if (user === null) {
			const error = 'Email not found in database';
			console.error(error);
			return res.status(403).send(error);
		} else {
			const token = crypto.randomBytes(20).toString('hex');
			const updatedData = {
				resetPasswordToken: token,
				resetPasswordExpires: Date.now() + 3600000,
			};
			// update the user's token and token expiration date
			User.findOneAndUpdate({ email }, updatedData).then(function (
				error,
				result
			) {
				if (error) {
					console.log(error);
				} else {
					console.log(result);
				}
			});
			const transporter = nodemailer.createTransport({
				name: 'improvmx',
				host: 'smtp.improvmx.com',
				port: 587,
				secure: false,
				auth: {
					// user: `${process.env.EMAIL_ADDRESS}`,
					// pass: `${process.env.EMAIL_PASSWORD}`,
					user: 'support@leadgeek.io',
					pass: '52LxOHANDCQa',
				},
				tls: {
					rejectUnauthorized: false,
				},
			});
			const mailOptions = {
				from: '"LeadGeek Support" <support@leadgeek.io>',
				to: `${user.email}`,
				subject: 'Link To Reset Password',
				text:
					'You are receiving this email because you (or someone else) have requested the reset of the password for your account. \n\n' +
					'Please click on the following link, or paste this into your browser to complete the password reset process within one hour of receiving this email: \n\n' +
					`http://localhost:3000/reset/reset-password/${token} \n\n` +
					'If you did not request this, please ignore this email and you password will remain unchanged. \n',
			};
			console.log('Sending email...');
			transporter.sendMail(mailOptions, (err, res) => {
				if (err) {
					console.error('There was an error sending the email: ', err);
				} else {
					console.log('Email sent successfully. Here are the details:', res);
					return res
						.status(200)
						.json('Password recovery email sent successfully');
				}
			});
			return res
				.status(200)
				.json({ msg: 'Password recovery email sent successfully', token });
		}
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

// @route       GET api/users/resetPasswordValidation
// @description validate password reset token
// @access      Public
router.post('/resetPasswordValidation', (req, res) => {
	try {
		console.log('Searching for user password reset token...');
		User.findOne({
			resetPasswordToken: req.body.resetPasswordToken,
			resetPasswordExpires: {
				$gt: Date.now(),
			},
		}).then((user) => {
			if (user === null) {
				console.error('Token not found.');
				res.status(400).json({
					errors: [{ msg: 'Password reset link expired or invalid' }],
				});
			} else {
				console.log('Token found!');
				res.status(200).send({
					user: user.email,
					msg: 'Password reset link was validated',
				});
			}
		});
	} catch (error) {}
});

// @route       PUT api/users
// @description update password in database
// @access      Public
router.put('/updatePassword', (req, res) => {
	User.findOne({
		email: req.body.email,
	}).then((user) => {
		if (user !== null) {
			console.log('User found in the database');
			// encrypt password
			const salt = bcrypt.genSalt(10);
			bcrypt
				.hash(req.body.password, salt)
				.then((hashedPassword) => {
					User.update({
						password: hashedPassword,
						resetPasswordToken: null,
						resetPasswordExpires: null,
					});
				})
				.then(() => {
					const message = 'Password successfully updated';
					console.log(message);
					res.status(200).send({ message });
				});
		} else {
			const message = 'No user exists in the database to update';
			console.error(message);
			res.status(404).json(message);
		}
	});
});

module.exports = router;
