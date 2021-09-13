// packages
import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// env
const jwtSecret = process.env.REACT_APP_JWT_SECRET;
const stripeSecret = process.env.REACT_APP_STRIPE_SECRET_KEY;

// models
const auth = require('@middleware/auth');
const User = require('@models/User');

// router
const router = Router();

// global var
const ITEMS_PER_PAGE = 15;
const stripe = require('stripe')(stripeSecret);

// @route       POST api/users
// @description Register user
// @access      Public
router.post('/', async (req: Request, res: Response) => {
	// destructure name, email and pw out of the body
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json({
			errors: [
				{ message: 'Please make sure all required information is present' },
			],
		});
	}
	try {
		// see if user exists in stripe
		const stripeUser = await stripe.customers.list({ email });
		if (stripeUser.data.length === 0) {
			return res.status(400).json({
				errors: [
					{
						message:
							"There's no LeadGeek subscription associated with that email. Please try another email or sign up for a plan.",
					},
				],
			});
		}
		// see if user exists in db
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({
				errors: [
					{
						message:
							'An account already exists under that email. Please try a different email or log in.',
					},
				],
			});
		}
		const userData = stripeUser.data[0];
		// retrieve the payment method details
		const userPM = await stripe.paymentMethods.list({
			customer: userData.id,
			type: 'card',
		});
		user = new User({
			name,
			email,
			password,
			dateCreated: userData.created,
			lastLogin: Date.now(),
			subscription: {
				cusId: userData.id,
				subId: {
					id: userData.subscriptions.data[0].id,
					active: userData.subscriptions.data[0].active,
				},
				planId: userData.subscriptions.data[0].plan.id,
			},
			billing: {
				paymentMethod: userData.invoice_settings.default_payment_method,
				last4: userPM.data[0].card.last4,
				brand: userPM.data[0].card.brand,
			},
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

		jwt.sign(payload, jwtSecret, { expiresIn: 60 * 120 }, (err, token) => {
			if (err) throw err;
			res.json({ token });
		});
	} catch (err) {
		console.error(err.message);
		// if there's an error, it's got to be with the server
		return res.status(500).json({
			errors: [
				{
					message:
						'There was an error creating your account. Please try again later or contact support.',
				},
			],
		});
	}
});

router.post('/get-all-users', auth, async (req: Request, res: Response) => {
	try {
		const { page, itemLimit } = req.body;
		const users = await User.find({})
			.countDocuments()
			.then((numUsers) => {
				totalItems = numUsers;
				return User.find({})
					.skip((page - 1) * (itemLimit || ITEMS_PER_PAGE))
					.limit(itemLimit || ITEMS_PER_PAGE)
					.sort({ dateCreated: -1 });
			});
		if (users.length > 0) {
			return res.status(200).send({
				users,
				page,
				hasNextPage: (itemLimit || ITEMS_PER_PAGE) * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / (itemLimit || ITEMS_PER_PAGE)),
				totalItems,
			});
		} else {
			return res.status(400).json({
				errors: [
					{
						message:
							'There was an error fetching all users. You done something wrong, boy.',
					},
				],
			});
		}
	} catch (error) {
		console.log(error);
	}
});

// @route       POST api/cancel-subscription
// @description Cancel current user's requested stripe subscription
// @access      Private
router.post('/cancel-subscription', async (req: Request, res: Response) => {
	try {
		const { subscriptionId } = req.body;
		const retrievedSub = await stripe.subscriptions.retrieve(subscriptionId);
		console.log(retrievedSub);
		if (!retrievedSub) {
			return res
				.status(200)
				.json({ message: 'Subscription could not be canceled.' });
		}
		if (retrievedSub.status === 'canceled') {
			return res
				.status(200)
				.json({ message: 'This subscription is already canceled.' });
		} else {
			const canceledSubscription = await stripe.subscriptions.del(
				subscriptionId
			);
			if (canceledSubscription.status === 'canceled') {
				return res.json({
					message: 'Subscription was successfully canceled.',
					subscription: canceledSubscription,
				});
			} else {
				return res.json({
					message: 'There was an error trying to cancel this subscription.',
				});
			}
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error');
	}
});

router.post('/update-db-subscription', async (req: Request, res: Response) => {
	try {
		const { customerId, subscription } = req.body;
		const { id } = subscription;
		let user = await User.findOne({ customerId });
		let subArray = user.subId;
		const index = subArray.findIndex((sub) => sub.id === id);
		if (index !== -1) {
			subArray[index] = subscription;
			user.update({ subId: subArray }, function (error) {
				if (error) console.log(error);
			});
		} else {
			console.log('Subscription index not found.');
			return res.status(200).json({
				message: 'There was an error in updating your subscription.',
			});
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error');
	}
});

// @route       POST api/get-successful-payments
// @description Get a user's payment history
// @access      Private
router.post(
	'/get-successful-payments',
	auth,
	async (req: Request, res: Response) => {
		try {
			const { cusId } = req.body;
			const returnBillingInfo = (item) => {
				return {
					amount: item.amount,
					currency: item.currency,
					paymentMethod: {
						brand: item.payment_method.card.brand,
						last4: item.payment_method.card.last4,
					},
					created: item.created,
					invoice: {
						id: item.invoice.id,
						pdf: item.invoice.invoice_pdf,
					},
				};
			};

			const allPayments = await stripe.paymentIntents.list({
				customer: cusId,
				expand: ['data.payment_method', 'data.invoice'],
			});

			if (allPayments.data.length > 0) {
				const successfulPayments = allPayments.data
					.filter((p) => p.status === 'succeeded')
					.map((p) => returnBillingInfo(p));

				if (successfulPayments.length > 0) {
					return res
						.status(200)
						.json({ message: 'Payments found', payments: successfulPayments });
				} else {
					return res.status(200).json({
						message: 'No payments found',
						payments: [],
					});
				}
			} else {
				return res.status(200).json({
					message: 'No payments found',
					payments: [],
				});
			}
		} catch (error) {
			console.error(error.message);
			res.status(500).send('Server error');
		}
	}
);

// @route       POST api/get-active-plan-details
// @description Get a user's subscription information for the active plan
// @access      Private
router.post(
	'/get-active-plan-details',
	auth,
	async (req: Request, res: Response) => {
		try {
			const returnSubscriptionInfo = (item) => {
				return {
					id: item.id,
					cancelAt: item.cancel_at,
					cancelAtPeriodEnd: item.cancel_at_period_end,
					created: item.created,
					currentPeriodEnd: item.current_period_end,
					plan: {
						planId: item.plan.id,
						amount: item.plan.amount,
					},
				};
			};

			const { subIds } = req.body;
			const activeSubId = subIds.filter((subId) => subId.active === true)[0].id;
			let message;
			if (activeSubId) {
				const subscription = await stripe.subscriptions.retrieve(activeSubId);
				const subscriptionData = returnSubscriptionInfo(subscription);
				message = 'Subscription data found';
				console.log(message);
				return res.status(200).json({
					message,
					subscription: subscriptionData,
				});
			} else {
				message = 'No active subscriptions found';
				console.log(message);
				return res.status(200).json({ message, subscription: null });
			}
		} catch (error) {
			console.error(error.message);
			res.status(500).send('Server error');
		}
	}
);

// @route       POST api/get-affiliate-payments
// @description Retrieve an affiliates payments
// @access      Private
router.post(
	'/get-affiliate-payments',
	auth,
	async (req: Request, res: Response) => {
		try {
			const { clients, affCreated } = req.body;

			const affCreatedUnix = (new Date(affCreated).getTime() / 1000).toFixed(0);

			let clientCusIds = [];
			clients.map((client) => clientCusIds.push(client.cusId));

			const returnChargeInfo = (item) => {
				return {
					id: item.id,
					amount: item.amount,
					amountCaptured: item.amount_captured,
					currency: item.currency,
					created: item.created,
					customer: item.customer,
					paid: item.paid,
					refunded: item.refunded,
				};
			};

			let allCharges = [];

			if (clientCusIds.length > 0) {
				console.log('Getting all Stripe charges...');
				for await (const charge of stripe.charges.list({
					limit: 100,
					created: { gte: affCreatedUnix },
				})) {
					allCharges.push(returnChargeInfo(charge));
				}

				const affPayments = allCharges
					.filter((charge) => clientCusIds.includes(charge.customer))
					.filter(
						(charge) => charge.paid === true && charge.refunded === false
					);

				let message;
				if (affPayments.length > 0) {
					message = 'Referred clients with valid payments were found.';
					console.log(message);
					return res.status(200).json({ message, affPayments });
				} else {
					message = 'No referred clients found';
					console.log(message);
					return res.status(200).json({ message, affPayments: [] });
				}
			} else {
				let message = 'No referred clients found';
				console.log(message);
				return res.status(200).json({ message, affPayments: [] });
			}
		} catch (error) {
			console.error(error.message);
			res.status(500).send('Server error');
		}
	}
);

router.put(
	'/update-affiliate-paypal',
	auth,
	async (req: Request, res: Response) => {
		try {
			const { id, newEmail: email } = req.body;
			const affiliate = await User.findOneAndUpdate(
				{ _id: id },
				{ 'referrals.referrer.paypalEmail': email }
			);
			if (affiliate) {
				return res.status(200).json({
					status: 'success',
					message: 'Your PayPal email was updated',
				});
			} else {
				return res.status(200).json({
					status: 'failure',
					message: 'Your PayPal email could not be updated',
				});
			}
		} catch (error) {
			console.log(error);
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
