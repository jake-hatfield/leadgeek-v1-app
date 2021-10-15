// packages
import { Request, Response, Router } from 'express';
import { ObjectId } from 'mongoose';
import Stripe from 'stripe';

// env
const stripeSecret = process.env.REACT_APP_STRIPE_SECRET_KEY;

// middleware
import auth from '@middleware/auth';

// models
import User, { IUserDocument } from '@models/User';
import Notification from '@models/Notification';

// router
const router = Router();

const stripe = new Stripe(stripeSecret, { apiVersion: '2020-08-27' });

// @route       GET api/users/plan?subId=__
// @description Get a user's subscription information for the active plan
// @access      Private
router.get(
	'/plan',
	auth,
	async (
		req: Request<{}, {}, {}, { subId: string }>,
		res: Response<
			| {
					message:
						| 'Subscription data found'
						| 'No subscription data found'
						| 'Server error';
					subscription: {
						id: string;
						cancelAt: number;
						cancelAtPeriodEnd: boolean;
						created: number;
						currentPeriodEnd: number;
						plan: {
							id: string | Stripe.Product | Stripe.DeletedProduct;
							amount: number;
						};
					};
			  }
			| {}
		>
	) => {
		try {
			// desctructure necessary items
			const { subId } = req.query;
			let message:
				| 'Subscription data found'
				| 'No subscription data found'
				| 'Server error';
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
				return res.status(200).send({
					message,
					subscription: subscriptionData,
				});
			} else {
				message = 'No subscription data found';
				console.log(message);

				// return an empty subscription object + message
				return res.status(200).send({ message, subscription: {} });
			}
		} catch (error) {
			console.error(error.message);
			res.status(500).send({ message: 'Server error', subscription: {} });
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

			// fn to change date string to UNIX timestamp for Stripe API
			const affCreatedUnix = (new Date(affCreated).getTime() / 1000).toFixed(0);

			// push client cusIds into array
			let clientCusIds: (string | Stripe.Customer | Stripe.DeletedCustomer)[] =
				[];
			clients.map((client) => clientCusIds.push(client.cusId));

			const returnChargeInfo = (item: Stripe.Charge) => {
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

// @route       DELETE api/users/notifications?notificationId=__&userId=__
// @description Clear a user's notification by ID
// @access      Private
router.delete(
	'/notifications',
	auth,
	async (
		req: Request<{}, {}, {}, { notificationId: string; userId: string }>,
		res: Response<{
			message:
				| 'Required information is missing'
				| 'Notification was deleted'
				| 'Server error';
			notifications: { _id: ObjectId }[];
		}>
	) => {
		try {
			// destructure necessary items
			const { notificationId, userId } = req.query;

			// if required information is missing, return
			if (!notificationId || !userId) {
				return res.status(400).json({
					message: 'Required information is missing',
					notifications: [],
				});
			}

			// lookup the user
			const user = await User.findById(userId);

			// filter notifications for notification id
			const updatedNotifications = user.notifications.filter(
				(notification: { _id: ObjectId }) =>
					notification._id.toString() !== notificationId.toString()
			);

			// set the user's notifications to the filtered array
			user.notifications = updatedNotifications;

			// save user document
			await user.save();

			// return with updated notifications
			return res.status(200).send({
				message: 'Notification was deleted',
				notifications: user.notifications,
			});
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: 'Server error', notifications: [] });
		}
	}
);

// @route       GET api/users?id=__
// @description Get all users (ADMIN)
// @access      Private
router.get(
	'/',
	auth,
	async (
		req: Request<{}, {}, {}, { id: string }>,
		res: Response<{
			message:
				| 'Access prohibited'
				| 'Returning all users'
				| 'Error returning all users';
			users: IUserDocument[];
		}>
	) => {
		try {
			// destructure necessary items
			const { id } = req.query;

			if (!id) {
				return res.status(401).send({
					message: 'Access prohibited',
					users: [],
				});
			}

			const master = await User.find({ _id: id, role: 'master' });

			if (!master) {
				return res.status(401).send({
					message: 'Access prohibited',
					users: [],
				});
			}

			// lookup all users
			const users = await User.find({}).sort({ dateCreated: -1 });

			// there are users found
			if (users.length > 0) {
				return res.status(200).send({
					message: 'Returning all users',
					users,
				});
			} else {
				return res.status(200).send({
					message: 'Error returning all users',
					users: [],
				});
			}
		} catch (error) {
			console.log(error);
		}
	}
);

// @route       GET api/users/notifications
// @description Retrieve a user's notifications
// @access      Private

// CHANGE THIS TO A GET REQUEST
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

interface Payment {
	amount: number;
	currency: string;
	paymentMethod: {
		brand: string;
		last4: string;
	};
	created: number;
	invoice: {
		id: string;
		pdf: string;
	};
}

// @route       GET api/users/payments
// @description Get a user's payment history
// @access      Private
router.get(
	'/payments',
	auth,
	async (
		req: Request<{}, {}, {}, { cusId: string }>,
		res: Response<{
			message: 'No payments found' | 'Payments found' | 'Server error';
			payments: Payment[];
		}>
	) => {
		try {
			const { cusId } = req.query;

			const returnBillingInfo = (item: Stripe.PaymentIntent) => {
				return {
					amount: item.amount,
					currency: item.currency,
					paymentMethod: {
						brand: (item.payment_method as Stripe.PaymentMethod).card.brand,
						last4: (item.payment_method as Stripe.PaymentMethod).card.last4,
					},
					created: item.created,
					invoice: {
						id: (item.invoice as Stripe.Invoice).id,
						pdf: (item.invoice as Stripe.Invoice).invoice_pdf,
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
						.send({ message: 'Payments found', payments: successfulPayments });
				} else {
					return res.status(200).send({
						message: 'No payments found',
						payments: [],
					});
				}
			} else {
				return res.status(200).send({
					message: 'No payments found',
					payments: [],
				});
			}
		} catch (error) {
			console.error(error.message);
			res.status(500).send({ message: 'Server error', payments: [] });
		}
	}
);

module.exports = router;
