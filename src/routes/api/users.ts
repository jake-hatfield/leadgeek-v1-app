// packages
import axios from 'axios';
import { Request, Response, Router, urlencoded } from 'express';
import mailchimp from '@mailchimp/mailchimp_marketing';
import md5 from 'md5';
import { ObjectId } from 'mongoose';
import Stripe from 'stripe';

// env
const endpointSecret =
	process.env.REACT_APP_STRIPE_USERS_WEBHOOK_ENDPOINT_SECRET;
const mailchimpAudienceId = process.env.REACT_APP_MAILCHIMP_AUDIENCE_ID;
const mailchimpSecret = process.env.REACT_APP_MAILCHIMP_SECRET;
const mailchimpServer = process.env.REACT_APP_MAILCHIMP_SERVER;
// force stripe key to be a string
const stripeSecret = `${process.env.REACT_APP_STRIPE_SECRET_KEY}`;

// middleware
import auth from '@middleware/auth';

// models
import User, { IUserDocument } from '@models/User';
import Notification, { INotificationDocument } from '@models/Notification';
import WaitlistUser, { IWaitlistUserDocument } from '@models/WaitlistUser';

// router
const router = Router();

mailchimp.setConfig({
	apiKey: mailchimpSecret,
	server: mailchimpServer,
});
const stripe = new Stripe(stripeSecret, { apiVersion: '2020-08-27' });

// @route       GET api/users?id=__
// @description Get all users (ADMIN)
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
			message:
				| 'Access prohibited'
				| 'Returning all users'
				| 'Error returning all users';
			users: IUserDocument[];
		}>
	) => {
		try {
			// destructure necessary items
			const { id } = req.body.user;

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

// @route       POST api/users/affiliate-payments
// @description Retrieve an affiliates payments
// @access      Private

// TODO: Change this to a GET request
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

// @route       GET api/users/notifications?ids=[]
// @description Retrieve a user's notifications
// @access      Private
router.get(
	'/notifications',
	auth,
	async (
		req: Request<{}, {}, {}, { ids: string[] }>,
		res: Response<{
			message:
				| 'There are no notifications to show'
				| 'Successfully populated notifications'
				| 'Server error';
			notifications: INotificationDocument[];
		}>
	) => {
		try {
			// destructure necessary items
			const { ids } = req.query;

			const notifications = await Notification.find({ _id: { $in: ids } });

			let message:
				| 'There are no notifications to show'
				| 'Successfully populated notifications'
				| 'Server error';

			if (notifications.length === 0) {
				message = 'There are no notifications to show';
				console.log(message);
			} else {
				let message = `Successfully populated notifications.`;
				console.log(message);
			}
			return res.status(200).send({
				message,
				notifications,
			});
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: 'Server error', notifications: [] });
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

// @route       GET api/users/payments?cusId=__
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

// @route       GET api/users/secret?cusId=__
// @description Get the client secret for a payment session
// @access      Private
router.get(
	'/secret',
	auth,
	async (
		req: Request<{}, {}, {}, { cusId: string }>,
		res: Response<{
			clientSecret: string;
		}>
	) => {
		try {
			const { cusId } = req.query;

			const setupIntent = await stripe.setupIntents.create({
				customer: cusId,
				payment_method_types: ['card'],
			});

			res.status(200).send({
				clientSecret: setupIntent.client_secret,
			});
		} catch (error) {
			console.log(error);
		}
	}
);

// @route       GET api/users/payment-methods?cusId=__
// @description Create a payment method
// @access      Private
router.get(
	'/payment-methods',
	auth,
	async (req: Request<{}, {}, {}, { cusId: string }>, res: Response) => {
		// destructure necessary items
		const { cusId } = req.query;

		const returnPaymentMethod = (pm: Stripe.PaymentMethod) => {
			return {
				id: pm.id,
				brand: pm.card.brand,
				expMonth: pm.card.exp_month,
				expYear: pm.card.exp_year,
				last4: pm.card.last4,
				type: pm.type,
			};
		};

		try {
			const paymentMethods = await stripe.customers.listPaymentMethods(cusId, {
				type: 'card',
			});

			if (paymentMethods.data.length > 0) {
				const formattedPaymentMethods = paymentMethods.data
					.filter((pm: Stripe.PaymentMethod) => pm.type === 'card')
					.map((pm: Stripe.PaymentMethod) => returnPaymentMethod(pm));

				if (formattedPaymentMethods.length > 0) {
					return res.status(200).send({
						message: 'Payment methods found',
						paymentMethods: formattedPaymentMethods,
					});
				} else {
					return res.status(200).send({
						message: 'No payment methods found',
						paymentMethods: [],
					});
				}
			} else {
				return res.status(200).send({
					message: 'No payment methods found',
					paymentMethods: [],
				});
			}

			// TODO: return success and update UI
		} catch (error) {
			console.log(error.message);
		}
	}
);

// @route       POST api/users/payment-method?pmId=__
// @description Create a payment method
// @access      Private
router.post(
	'/payment-method',
	auth,
	async (
		req: Request<{}, {}, { pmId: string; cusId: string }>,
		res: Response
	) => {
		const { pmId, cusId } = req.body;

		try {
			await stripe.paymentMethods.attach(pmId, {
				customer: cusId,
			});

			// TODO: return success and update UI
		} catch (error) {
			console.log(error.message);
		}
	}
);

// @route       PUT api/users/payment-method?pmId=__
// @description Update a payment method
// @access      Private
// router.put(
// 	'/payment',
// 	auth,
// 	async (
// 		req: Request<{}, {}, {}, { paymentMethodId: string }>,
// 		res: Response
// 	) => {
// 		try {
// 			const { paymentMethodId } = req.query;

// 			const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);

// 			console.log(paymentMethod);
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	}
// );

// @route       DELETE api/users/payment-method?pmId=__
// @description Delete a payment method
// @access      Private
router.delete(
	'/payment-method',
	auth,
	async (req: Request<{}, {}, {}, { pmId: string }>, res: Response) => {
		try {
			const { pmId } = req.query;

			const paymentMethod = await stripe.paymentMethods.detach(pmId);

			console.log(paymentMethod);
		} catch (error) {
			console.log(error);
		}
	}
);

// handle a qualified waitlist user
const handleWaitlistUser = async (
	waitlistUser: IWaitlistUserDocument,
	subscribedProductName: 'bundle' | 'pro' | 'grow'
): Promise<any> => {
	// destructure necessary items
	const { email, plans } = waitlistUser;

	// capitalize the plan name
	const planCapitalized =
		subscribedProductName.charAt(0).toUpperCase() +
		subscribedProductName.slice(1);

	// see if the subscriber already exists
	const checkEmail = await mailchimp.searchMembers.search(email);

	// if they do, update the tags
	if (checkEmail.exact_matches.total_items > 0) {
		const oldTags = checkEmail.exact_matches.members[0].tags;

		// check if user is supposed to already be in the mailchimp automation
		if (
			oldTags.some(
				(tag: { id: string; name: string }) =>
					tag.name === 'Active Bundle Plan Waitlist' ||
					tag.name === 'Active Pro Plan Waitlist' ||
					tag.name === 'Active Grow Plan Waitlist'
			)
		) {
			console.log('Waitlist user is already in MailChimp automation');
			// get the next qualified user, if any
			const nextQualifiedWaitlistUser = await WaitlistUser.findOne({
				_id: { $ne: waitlistUser._id },
				plans: {
					$elemMatch: {
						type: subscribedProductName,
						active: true,
					},
				},
			}).sort({ dateCreated: 1 });

			if (nextQualifiedWaitlistUser) {
				return handleWaitlistUser(
					nextQualifiedWaitlistUser,
					subscribedProductName
				);
			} else {
				console.log(
					`No qualified users on waitlist for plan: ${subscribedProductName}`
				);
			}
		}

		console.log('Email found...');

		// replace/update the tags
		const tags = [
			{
				name: `${planCapitalized} Plan Waitlist`,
				status: 'inactive',
			},
			{
				name: `Active ${planCapitalized} Plan Waitlist`,
				status: 'active',
			},
		];

		const subscriberHash = await md5(email);

		// make req to mailchimp api
		mailchimp.lists.updateListMemberTags(mailchimpAudienceId, subscriberHash, {
			tags,
		});
	}

	// update plan to inactive in DB
	const planIndex = plans.findIndex(
		(plan: { type: 'bundle' | 'pro' | 'grow'; active: boolean }) =>
			plan.type === subscribedProductName
	);

	plans[planIndex].active = false;

	waitlistUser.plans = plans;

	await waitlistUser.save();

	console.log('Waitlist user updated');

	return;
};

const unsubscribeCustomer = async (cusId: string, subId: string) => {
	try {
		const canceledCustomer = await User.findOne({
			'subscription.cusId': cusId,
		});

		if (canceledCustomer) {
			canceledCustomer.role = 'user';

			const subIndex = canceledCustomer.subscription.subIds.findIndex(
				(sub) => sub.id === subId
			);

			canceledCustomer.subscription.subIds[subIndex] = {
				id: subId,
				active: false,
			};

			console.log("Updating customer's subscription status in DB...");

			await canceledCustomer.save();
		}
	} catch (error) {
		console.log(error.message);
	}
};

// @route       POST api/users/stripe-webhook
// @description Webhooks for stripe
// @access      Public
router.post('/stripe-webhook', async (req: any, res: Response) => {
	try {
		const sig = req.headers['stripe-signature'];

		// (TODO)<Jake>: log event_ids and make sure duplicates aren't processed

		// declare global variable
		let event: Stripe.Event;

		try {
			// attempt to authenticate and build event
			event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
		} catch (error) {
			// something went wrong with verifying signature
			console.log(error.message);
			res.status(401).send({ message: `Webhook Error: ${error.message}` });
			return;
		}

		// Handle the event
		switch (event.type) {
			case 'customer.subscription.deleted':
				// destructure necessary items
				const data = event.data as Stripe.TypedEventData<Stripe.Subscription>;

				const { id: subId, customer: cusId } = data.object;

				unsubscribeCustomer(cusId, subId);

				// get the productId from the event
				const subscribedProductId: string = data.object.plan.product;

				// NOTE: DOESN'T ACCOUNT FOR SECOND SET OF LISTS
				// return plan type in string
				const getProductName = (id: string) => {
					let name: 'bundle' | 'pro' | 'grow' | null;
					switch (id) {
						case process.env.REACT_APP_BUNDLE_PRODUCT_ID:
							name = 'bundle';
							break;
						case process.env.REACT_APP_PRO_PRODUCT_ID:
							name = 'pro';
							break;
						case process.env.REACT_APP_GROW_PRODUCT_ID:
							name = 'grow';
							break;
						default:
							name = null;
					}
					return name;
				};

				// sets the name from the id
				const subscribedProductName: 'bundle' | 'pro' | 'grow' | null =
					getProductName(subscribedProductId);

				// if there's a valid product name, check in the DB for a user that hasn't gone through this type of waitlist automation yet
				if (subscribedProductName) {
					const waitlistUser: IWaitlistUserDocument =
						await WaitlistUser.findOne({
							plans: {
								$elemMatch: {
									type: subscribedProductName,
									active: true,
								},
							},
						}).sort({ dateCreated: 1 });

					// if a valid waitlist user is found, run them through the waitlist automation
					if (waitlistUser) {
						handleWaitlistUser(waitlistUser, subscribedProductName);
					} else if (subscribedProductName === 'bundle') {
						const proWaitlistUser: IWaitlistUserDocument =
							await WaitlistUser.findOne({
								plans: {
									$elemMatch: {
										type: 'pro',
										active: true,
									},
								},
							}).sort({ dateCreated: 1 });

						if (proWaitlistUser) {
							handleWaitlistUser(proWaitlistUser, 'pro');
						} else {
							const growWaitlistUser: IWaitlistUserDocument =
								await WaitlistUser.findOne({
									plans: {
										$elemMatch: {
											type: 'grow',
											active: true,
										},
									},
								}).sort({ dateCreated: 1 });

							if (growWaitlistUser) {
								handleWaitlistUser(growWaitlistUser, 'grow');
							}
						}
					} else {
						console.log(
							`No qualified users on waitlist for ID: ${subscribedProductId}`
						);
						return res.status(200).end();
					}
				} else {
					console.log(
						`No product matching this ID was found: ${subscribedProductId}`
					);
				}

				// if event occured in production, trigger a redeploy of the marketing site
				if (process.env.NODE_ENV === 'production') {
					await axios.post(
						'https://api.netlify.com/build_hooks/617853cf1b20ba007987f2d7'
					);
				}
				break;
			case 'invoice.payment_failed': {
				// destructure necessary items
				const data = event.data as Stripe.TypedEventData<Stripe.Invoice>;
				const { customer: cusId, id: subId } = data.object;

				unsubscribeCustomer(cusId, subId);

				break;
			}
			default:
				console.log(`Unhandled event type ${event.type}`);
		}

		// Return a 200 response to acknowledge receipt of the event
		return res.status(200).end();
	} catch (error) {
		console.error(error.message);
		res.status(500);
	}
});

// @route       POST api/users/mailchimp-webhook
// @description Webhooks for mailchimp
// @access      Public
router.post(
	'/mailchimp-webhook',
	urlencoded({ extended: true }),
	async (req: Request, res: Response) => {
		try {
			const {
				type,
				data: {
					email,
					merges: { LEAD: lead },
				},
			} = req.body;

			switch (type) {
				case 'profile':
					if (
						lead === 'Inactive Grow Plan Waitlist' ||
						lead === 'Inactive Pro Plan Waitlist' ||
						lead === 'Inactive Bundle Plan Waitlist'
					) {
						const getPlan = (
							mergeTag:
								| 'Inactive Bundle Plan Waitlist'
								| 'Inactive Pro Plan Waitlist'
								| 'Inactive Grow Plan Waitlist'
						) => {
							let plan: 'bundle' | 'pro' | 'grow';
							switch (mergeTag) {
								case 'Inactive Bundle Plan Waitlist':
									plan = 'bundle';
									break;
								case 'Inactive Pro Plan Waitlist':
									plan = 'pro';
									break;
								case 'Inactive Grow Plan Waitlist':
									plan = 'grow';
									break;
								default:
									plan = null;
							}
							return plan;
						};
						const subscribedProductName = getPlan(lead);

						if (subscribedProductName) {
							const waitlistUser = await WaitlistUser.findOne({
								email: { $ne: email },
								plans: {
									$elemMatch: {
										type: subscribedProductName,
										active: true,
									},
								},
							}).sort({ dateCreated: 1 });

							if (waitlistUser) {
								handleWaitlistUser(waitlistUser, subscribedProductName);
							} else {
								console.log(
									`No qualified users on waitlist for plan: ${subscribedProductName}`
								);
							}
						} else {
							console.log(`Unhandled plan ${subscribedProductName}`);
						}
					} else {
						console.log(`Unhandled merge tag ${lead}`);
					}
					break;
				default:
					console.log(`Unhandled event type ${type}`);
			}

			return res.status(200).end();
		} catch (error) {
			console.log(error);
			return res.status(500);
		}
	}
);

module.exports = router;
