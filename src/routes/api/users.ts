// packages
import { Request, Response, Router } from 'express';
import { ObjectId } from 'mongoose';
import Stripe from 'stripe';

// env
const stripeSecret = process.env.REACT_APP_STRIPE_SECRET_KEY;
const endpointSecret =
	process.env.REACT_APP_STRIPE_USERS_WEBHOOK_ENDPOINT_SECRET;

// middleware
import auth from '@middleware/auth';

// models
import User from '@models/User';
import Notification from '@models/Notification';

// router
const router = Router();

// global var
const ITEMS_PER_PAGE = 15;

const stripe = new Stripe(stripeSecret, { apiVersion: '2020-08-27' });

// @route       POST api/get-active-plan-details
// @description Get a user's subscription information for the active plan
// @access      Private
router.post(
	'/active-plan-details',
	auth,
	async (req: Request<{}, {}, { subId: string }>, res: Response) => {
		try {
			// desctructure necessary items
			const { subId } = req.body;
			let message;
			if (subId) {
				// handler to create subscription info object
				const returnSubscriptionInfo = (
					item: Stripe.Response<Stripe.Subscription>
				) => {
					return {
						id: item.id,
						cancelAt: item.cancel_at,
						cancelAtPeriodEnd: item.cancel_at_period_end,
						created: item.created,
						currentPeriodEnd: item.current_period_end,
						plan: {
							id: item.items.data[0].price.product,
							amount: item.items.data[0].price.unit_amount,
						},
					};
				};
				// get the active subscription from stripe
				const subscription = await stripe.subscriptions.retrieve(subId);
				// create the subscription info object
				const subscriptionData = returnSubscriptionInfo(subscription);

				message = 'Subscription data found';
				console.log(message);

				// return the subscription data + message
				return res.status(200).json({
					message,
					subscription: subscriptionData,
				});
			} else {
				message = 'No active subscriptions found';
				console.log(message);

				// return an empty subscription object + message
				return res.status(200).json({ message, subscription: {} });
			}
		} catch (error) {
			console.error(error.message);
			res.status(500).send('Server error');
		}
	}
);

// @route       POST api/affiliate-payments
// @description Retrieve an affiliates payments
// @access      Private
router.post(
	'/affiliate-payments',
	auth,
	async (
		req: Request<
			{},
			{},
			{ clients: { userId: ObjectId; cusId: string }[]; affCreated: string }
		>,
		res: Response
	) => {
		try {
			// destructure necessary items
			const { clients, affCreated } = req.body;
			console.log(clients, affCreated);

			// fn to change date string to UNIX timestamp for Stripe API
			const affCreatedUnix = (new Date(affCreated).getTime() / 1000).toFixed(0);

			// push client cusIds into array
			let clientCusIds: string[] = [];
			clients.map((client) => clientCusIds.push(client.cusId));

			const returnChargeInfo = (item: any) => {
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
					created: { gte: +affCreatedUnix },
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

// @route       POST api/clear-notification
// @description Clear a user's notification by ID
// @access      Private
router.put(
	'/clear-notification',
	auth,
	async (
		req: Request<{}, {}, { notificationId: ObjectId; userId: ObjectId }>,
		res: Response
	) => {
		try {
			// destructure necessary items
			const { notificationId, userId } = req.body;

			// if required information is missing, return
			if (!notificationId || !userId) {
				return res
					.status(400)
					.json({ message: 'Required information is missing' });
			}

			// lookup the user
			const user = await User.findById(userId);

			const updatedNotifications = user.notifications.filter(
				(notification: { _id: ObjectId }) =>
					notification._id.toString() !== notificationId.toString()
			);

			user.notifications = updatedNotifications;

			await user.save();

			return res.status(200).send({
				notifications: user.notifications,
			});
		} catch (error) {
			console.log(error);
			res.status(500).send('Server error');
		}
	}
);

router.get('/all/:id', auth, async (req: Request, res: Response) => {
	try {
		// destructure necessary items
		const { id } = req.params;

		if (!req.params.id) {
			return res.status(401).send({
				users: [],
				message: 'Access prohibited',
			});
		}

		const master = await User.find({ _id: id, role: 'master' });

		if (!master) {
			return res.status(401).send({
				users: [],
				message: 'Access prohibited',
			});
		}

		// lookup all users
		const users = await User.find({}).sort({ dateCreated: -1 });

		// there are users found
		if (users.length > 0) {
			return res.status(200).send({
				users,
				message: 'Returning all users',
			});
		} else {
			return res.status(200).send({
				users: [],
				message:
					'There was an error fetching all users. You done something wrong, boy',
			});
		}
	} catch (error) {
		console.log(error);
	}
});

// @route       POST api/notifications
// @description Retrieve a user's notifications
// @access      Private
router.post(
	'/notifications',
	auth,
	async (
		req: Request<{}, {}, { ids: { _ids: ObjectId }[] }>,
		res: Response
	) => {
		try {
			// destructure necessary items
			const { ids } = req.body;

			const notifications = await Notification.find({ _id: { $in: ids } });

			let message;
			if (notifications.length === 0) {
				message = 'There are no notifications to show';
				console.log(message);
			} else {
				let message = `Successfully populated ${notifications.length} notifications.`;
				console.log(message);
			}
			return res.status(200).send({
				notifications,
			});
		} catch (error) {
			console.log(error);
			res.status(500).send('Server error');
		}
	}
);

// @route       POST api/get-successful-payments
// @description Get a user's payment history
// @access      Private
router.post(
	'/successful-payments',
	auth,
	async (req: Request<{}, {}, { cusId: string }>, res: Response) => {
		try {
			const { cusId } = req.body;
			const returnBillingInfo = (item: any) => {
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
					.filter((p: any) => p.status === 'succeeded')
					.map((p: any) => returnBillingInfo(p));

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

// @route       POST api/users/stripe-webhook
// @description Webhooks for stripe
// @access      Public
router.post('/stripe-webhook', async (req: any, res: Response) => {
	try {
		const sig = req.headers['stripe-signature'];

		let event;

		try {
			event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
		} catch (error) {
			console.log(error.message);
			res.status(401).send({ message: `Webhook Error: ${error.message}` });
			return;
		}
		// Handle the event
		switch (event.type) {
			case 'customer.subscription.deleted':
				const subscription = event.data.object;
				console.log(subscription);
				// Then define and call a function to handle the event customer.subscription.deleted
				break;

			default:
				console.log(`Unhandled event type ${event.type}`);
		}

		// Return a 200 response to acknowledge receipt of the event
		return res.status(200).end();
	} catch (error) {
		console.error(error.message);
		res.status(500).send({ message: 'Server error' });
	}
});

module.exports = router;
