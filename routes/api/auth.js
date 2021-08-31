const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.REACT_APP_JWT_SECRET;
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route       GET api/auth
// @description Find user
// @access      Private
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		return res.json(user);
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

// @route       POST api/auth
// @description Authenticate user and get token
// @access      Public
router.post('/', async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// there was a validation error, return the array to display in UI
		return res.status(400).json({ errors: errors.array() });
	}
	// destructure email and pw out of the body
	const { email, password } = req.body;

	try {
		// see if user exists
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				errors: [
					{
						msg: 'Email & password combination not correct. Please try again or reset your password.',
					},
				],
			});
		}

		// validate password with bcrypt
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({
				errors: [
					{
						msg: 'Email & password combination not correct. Please try again or reset your password.',
					},
				],
			});
		}

		user.lastLoggedIn = Date.now();
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
				res.json({ token });
			}
		);
	} catch (err) {
		console.error(err.message);
		// if there's an error, it's got to be with the server
		res.status(500).send('Server error');
	}
});

// @route       POST api/auth/surrogate-user
// @description Log in as user for administrative purposes
// @access      Private
router.post('/surrogate-user', auth, async (req, res) => {
	try {
		const { id } = req.body;
		if (id) {
			let user = await User.findOne({ _id: id });
			if (!user) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Email & password combination not correct. Please try again or reset your password.',
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
						msg: 'No user found.',
					},
				],
			});
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route       POST api/auth/get-stripe-subscriptions
// @description Check for and return stripe subscriptions
// @access      Public
router.post('/get-stripe-subscriptions', async (req, res) => {
	try {
		const email = req.body.email;
		const user = await User.findOne({ email });
		if (!user) {
			let message = 'No user found';
			console.log(message);
			return res.status(400).json({
				errors: [
					{
						msg: message,
					},
				],
			});
		} else if (!user.customerId) {
			let message = 'No Stripe customer is associated with this email.';
			console.log(message);
			return res.status(400).json({
				errors: [
					{
						msg: message,
					},
				],
			});
		} else {
			let message = 'Customer found';
			console.log(user);
			if (!user.subId || !user.paymentMethod.id) {
				let message = 'Incomplete user information';
				console.log(message);
				return res.status(400).json({
					errors: [
						{
							msg: message,
						},
					],
				});
			}
			return res.status(200).send({
				msg: message,
				activeSubscriptions: user.subId,
				paymentMethodId: user.paymentMethod.id,
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send('Server error');
	}
});

module.exports = router;
