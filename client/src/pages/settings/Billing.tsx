import React, { useState, useEffect, useCallback, useRef } from 'react';

// packages
import axios from 'axios';
import { DateTime } from 'luxon';
import { useStateIfMounted } from 'use-state-if-mounted';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { animated, useSpring } from 'react-spring';

// redux
import { useAppSelector, useAppDispatch, useDarkMode } from '@hooks/hooks';
import { setAlert, removeAlert } from '@components/features/alert/alertSlice';

// components
import AuthLayout from '@components/layout/AuthLayout';
import Badge from '@components/utils/Badge';
import Button from '@components/utils/Button';
import DescriptionList from '@components/utils/DescriptionList';
import NullState from '@components/utils/NullState';
import SettingsLayout from '@components/layout/SettingsLayout';
import Spinner from '@components/utils/Spinner';

// utils
import {
	capitalize,
	config,
	formatTimeDiff,
	formatTimestamp,
	planCheckerByPrice,
	useOutsideMouseup,
} from '@utils/utils';
import { User } from '@utils/interfaces/User';

// assets
import { ReactComponent as AmexIcon } from '@assets/images/svgs/amex.svg';
import { ReactComponent as DiscoverIcon } from '@assets/images/svgs/discover.svg';
import { ReactComponent as DinersIcon } from '@assets/images/svgs/diners.svg';
import { ReactComponent as JCBIcon } from '@assets/images/svgs/jcb.svg';
import { ReactComponent as MastercardIcon } from '@assets/images/svgs/mastercard.svg';
import { ReactComponent as VisaIcon } from '@assets/images/svgs/visa.svg';

type ModalType =
	| 'createCard'
	| 'deleteCard'
	| 'deleteSubscription'
	| 'updateSubscription'
	| null;

interface PlanState {
	status: 'loading' | 'idle';
	subId: string | null;
	created: string | null;
	cancelAt: string | null;
	cancelAtPeriod: boolean | undefined;
	currentPeriodEnd: string | null;
	plan: {
		id: string | null;
		amount: number | null;
	};
}

interface PaymentState {
	status: 'loading' | 'idle';
	payments: any;
	pagination: {
		page: number;
		itemLimit: 10;
	};
}

interface PaymentMethod {
	id: string;
	brand:
		| 'amex'
		| 'diners'
		| 'discover'
		| 'jcb'
		| 'mastercard'
		| 'unionpay'
		| 'visa'
		| 'unknown';
	expMonth: number;
	expYear: number;
	last4: string;
	type: 'credit' | 'debit' | 'prepaid' | 'unknown';
}

interface PaymentMethodState {
	status: 'loading' | 'idle';
	currentPaymentMethod: PaymentMethod | null;
	paymentMethods: PaymentMethod[];
	defaultPmId: string | null;
	modal: 'create' | 'delete' | null;
}

const BillingPage = () => {
	const dispatch = useAppDispatch();

	// auth state
	const authStatus = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const user = useAppSelector((state) => state.auth.user);

	// local state
	const [modal, setModal] = useState<{
		type: ModalType;
		active: boolean;
	}>({
		type: null,
		active: false,
	});
	const [planState, setPlanState] = useStateIfMounted<PlanState>({
		status: 'loading',
		subId: null,
		created: null,
		cancelAt: null,
		cancelAtPeriod: undefined,
		currentPeriodEnd: null,
		plan: {
			id: null,
			amount: null,
		},
	});
	const [paymentState, setPaymentState] = useStateIfMounted<PaymentState>({
		status: 'loading',
		payments: [],
		pagination: {
			page: 1,
			itemLimit: 10,
		},
	});
	const [paymentMethodState, setPaymentMethodState] =
		useStateIfMounted<PaymentMethodState>({
			status: 'loading',
			currentPaymentMethod: null,
			paymentMethods: [],
			defaultPmId: null,
			modal: null,
		});
	const [addNewCard, setAddNewCard] = useState(false);

	const getActiveSubscriptionDetails = useCallback(
		async (activeSubId: string) => {
			try {
				// GET request to route
				const {
					data: { message, subscription },
				} = await axios.get(`/api/users/subscription?subId=${activeSubId}`);

				// if subscription data is found, update state
				if (message === 'Subscription data found') {
					console.log(subscription.cancelAt);
					return setPlanState({
						...planState,
						status: 'idle',
						subId: subscription.id,
						created: formatTimestamp(subscription.created, true),
						cancelAt: subscription.cancelAt
							? formatTimeDiff(+subscription.cancelAt)
							: formatTimeDiff(+subscription.currentPeriodEnd),
						cancelAtPeriod: subscription.cancelAtPeriod,
						currentPeriodEnd: formatTimestamp(
							+subscription.currentPeriodEnd,
							false
						),
						plan: {
							...planState.plan,
							id: subscription.plan.id,
							amount: subscription.plan.amount,
						},
					});
				} else {
					// update state loading status
					return setPlanState({
						...planState,
						status: 'idle',
					});
				}
			} catch (error) {
				console.log(error);
				return setPlanState({
					...planState,
					status: 'idle',
				});
			}
		},
		[planState, setPlanState]
	);

	const getActiveSub = useCallback(() => {
		return user?.subscription.subIds.filter((sub) => sub.active === true)[0];
	}, [user?.subscription.subIds]);

	// get active plan details
	useEffect(() => {
		// get the user's active subscription
		const activeSub = getActiveSub();

		isAuthenticated &&
			authStatus === 'idle' &&
			planState.status === 'loading' &&
			activeSub?.id &&
			getActiveSubscriptionDetails(activeSub.id);
	}, [
		getActiveSub,
		isAuthenticated,
		authStatus,
		planState.status,
		user?.subscription.subIds,
		getActiveSubscriptionDetails,
	]);

	const handleSubscriptionUpdate = async (
		subId: string | null,
		cancel: boolean
	) => {
		if (!subId) {
			return;
		}
		try {
			const res = await axios.put(
				`/api/users/subscription?subId=${subId}&cancel=${cancel}`
			);

			if (!cancel) {
				setModal({
					...modal,
					type: null,
					active: false,
				});
			}

			setPlanState({
				...planState,
				status: 'loading',
				cancelAt: null,
				cancelAtPeriod: res.data.cancelAtPeriod,
			});

			dispatch(
				setAlert({
					title: res.status === 200 ? 'Success' : 'Error',
					message: res.data.message,
					alertType: res.status === 200 ? 'success' : 'danger',
				})
			);
		} catch (error) {
			console.log(error);
		}
	};

	const handleCardCreation = async (
		stripe: any,
		elements: any,
		cusId: string
	) => {
		if (!stripe || !elements || !cusId) {
			return;
		}

		dispatch(removeAlert());

		// get the client secret from the customer ID
		const {
			data: { clientSecret },
		} = await axios.get(`/api/users/secret?cusId=${cusId}`);

		if (clientSecret) {
			// grab the card details from the UI element
			const card = elements.getElement(CardElement);

			if (card) {
				// if there's a card element on the page, confirm the setup intent
				const res = await stripe.confirmCardSetup(clientSecret, {
					payment_method: {
						card,
						billing_details: {
							name: user?.name,
						},
					},
				});

				if (res.error) {
					// show error in UI
					return dispatch(
						setAlert({
							title: 'Input error',
							message: res.error.message
								? res.error.message
								: 'There was a problem adding this card',
							alertType: 'danger',
						})
					);
				} else {
					const body = JSON.stringify({
						pmId: res.setupIntent.payment_method,
						cusId,
					});

					await axios.post('/api/users/payment-method', body, config);

					setModal({
						...modal,
						type: null,
						active: false,
					});

					setPaymentMethodState({
						...paymentMethodState,
						status: 'loading',
					});

					return dispatch(
						setAlert({
							title: 'Success',
							message: 'Your card was successfully added',
							alertType: 'success',
						})
					);
				}
			} else {
				dispatch(
					setAlert({
						title: 'Something went wrong',
						message: 'There was a problem adding this card',
						alertType: 'danger',
					})
				);
			}
		} else {
			dispatch(
				setAlert({
					title: 'Something went wrong',
					message: 'There was a problem adding this card',
					alertType: 'danger',
				})
			);
		}
	};

	const handleCardUpdate = async (cusId: string | undefined, pmId: string) => {
		if (!cusId && !pmId) {
			return;
		}

		dispatch(removeAlert());

		await axios.put(
			`/api/users/payment-method/default?cusId=${cusId}&pmId=${pmId}`
		);

		setPaymentMethodState({
			...paymentMethodState,
			status: 'loading',
		});

		setModal({
			...modal,
			type: null,
			active: false,
		});

		return dispatch(
			setAlert({
				title: 'Success',
				message: 'Your default payment method was updated',
				alertType: 'success',
			})
		);
	};

	const handleCardDelete = async (pmId: string, defaultPmId: string) => {
		if (paymentMethodState.paymentMethods.length < 2) {
			setModal({
				...modal,
				type: null,
				active: false,
			});

			return dispatch(
				setAlert({
					title: 'Error',
					message:
						'Please add a backup payment method before deleting this one',
					alertType: 'danger',
				})
			);
		}

		if (defaultPmId && defaultPmId !== pmId) {
			dispatch(removeAlert());

			await axios.delete<{
				message:
					| 'Payment method deleted'
					| 'Payment method could not be deleted';
			}>(`/api/users/payment-method?pmId=${pmId}`);

			const newPaymentMethods = paymentMethodState.paymentMethods.filter(
				(pm) => pm.id !== pmId
			);
			setPaymentMethodState({
				...paymentMethodState,
				paymentMethods: newPaymentMethods,
			});

			setModal({
				...modal,
				type: null,
				active: false,
			});

			return dispatch(
				setAlert({
					title: 'Success',
					message: 'Your card was successfully removed',
					alertType: 'success',
				})
			);
		} else {
			setModal({
				...modal,
				type: null,
				active: false,
			});

			return dispatch(
				setAlert({
					title: 'Error',
					message: "The default payment method can't be removed",
					alertType: 'danger',
				})
			);
		}
	};

	const getPaymentMethods = useCallback(async (cusId: string) => {
		const res = await axios.get<{
			message: 'Payment methods found' | 'No payment methods found';
			paymentMethods: PaymentMethod[];
			defaultPmId: string | null;
		}>(`/api/users/payment-methods?cusId=${cusId}`);

		setPaymentMethodState({
			...paymentMethodState,
			status: 'idle',
			paymentMethods: res.data.paymentMethods,
			defaultPmId: res.data.defaultPmId,
		});
	}, []);

	useEffect(() => {
		paymentMethodState.status === 'loading' &&
			user?.subscription.cusId &&
			getPaymentMethods(user?.subscription.cusId);
	}, [
		user,
		getPaymentMethods,
		paymentMethodState.status,
		paymentMethodState.paymentMethods,
	]);

	const submitSlackFeedback = async () => {
		const dateCreatedMillis = DateTime.fromISO(
			user?.dateCreated.toString()!
		).toMillis();

		const body = JSON.stringify({
			name: user?.name,
			email: user?.email,
			cusId: user?.subscription.cusId,
			plan: user?.role ? capitalize(user?.role) : 'User',
			trial: true,
			cancellation: {
				timeLeft: planState.cancelAt ? planState.cancelAt : 'UNKNOWN',
				joinDate: user?.dateCreated
					? formatTimeDiff(dateCreatedMillis / 1000)
					: 'UNKNOWN',
				reason: 'I know how to source better than u, kid',
				feedback: 'THIS THING SUCKS!',
			},
		});

		await axios.post('/api/users/slack-webhook', body, config);
	};

	// TODO<Jake>: Show trial status in navbar w/ how many days left
	// TODO<Jake>: Change MongoDB schema
	// TODO<Jake>: Update .env in Heroku
	// TODO<Jake>: Resubscribe modal
	// TODO<Jake>: Cancellation confirmation email

	const getSuccessfulPayments = useCallback(
		async (cusId: string) => {
			try {
				// POST request to route
				const { data } = await axios.get(`/api/users/payments?cusId=${cusId}`);

				// update state
				return setPaymentState({
					...paymentState,
					status: 'idle',
					payments: data.payments,
				});
			} catch (error) {
				console.log(error);
				return setPaymentState({
					...paymentState,
					status: 'idle',
				});
			}
		},
		[paymentState, setPaymentState]
	);

	useEffect(() => {
		isAuthenticated &&
			authStatus === 'idle' &&
			paymentState.status === 'loading' &&
			user?.subscription.cusId &&
			getSuccessfulPayments(user.subscription.cusId);
	}, [
		isAuthenticated,
		authStatus,
		paymentState.status,
		user?.subscription.cusId,
		getSuccessfulPayments,
	]);

	const subscriptionInformation = [
		{
			title: 'Member since',
			value: (
				<div>
					{isAuthenticated &&
						user?.dateCreated &&
						DateTime.fromISO(user.dateCreated.toString()).toFormat(
							'LLL dd, yyyy'
						)}
				</div>
			),
		},
		{
			title: 'Active since',
			value: <div>{planState.created ? planState.created : '-'}</div>,
		},
		{
			title: 'Current plan',
			value: (
				<div className='flex items-center'>
					<span>
						{planState.plan.amount && planCheckerByPrice(planState.plan.amount)}
					</span>
					<span
						className={`ml-2 py-0.5 px-2 ${
							planState.cancelAtPeriod ? 'cs-red' : 'cs-teal'
						} text-xs font-semibold rounded-main`}
					>
						{planState.cancelAtPeriod
							? `Cancelled - ${planState.cancelAt} until expiration`
							: 'Active'}
					</span>
				</div>
			),
			action: (
				<button
					onClick={() =>
						planState.cancelAtPeriod
							? setModal({ ...modal, type: 'updateSubscription', active: true })
							: setModal({
									...modal,
									type: 'deleteSubscription',
									active: true,
							  })
					}
					className='link'
				>
					{planState.cancelAtPeriod ? 'Resubscribe' : 'Unsubscribe'}
				</button>
			),
		},
		...(!planState.cancelAtPeriod
			? [
					{
						title: `Est. charge for
           ${planState.currentPeriodEnd && planState.currentPeriodEnd}`,
						value: (
							<div>
								{planState.plan.amount && (
									<div className='font-bold'>
										${planState.plan.amount / 100}
									</div>
								)}
							</div>
						),
					},
			  ]
			: []),
	];

	return (
		authStatus === 'idle' &&
		user && (
			<AuthLayout>
				<SettingsLayout
					title={'Billing'}
					description={'Update your subscription and view past invoices'}
				>
					<section className='my-6'>
						{user?.subscription.cusId ? (
							<>
								{/* subscription information */}
								<section className='pt-2 md:pt-4 lg:pt-6 pb-5 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='card-padding-x'>
											<h2 className='font-bold text-lg text-300'>Plan</h2>
										</header>
									</div>
									{planState.status === 'loading' ? (
										<Spinner
											divWidth={null}
											center={false}
											spinnerWidth={null}
											margin={true}
											text={'Loading subscription information...'}
										/>
									) : planState.plan.id ? (
										<dl className='grid grid-flow-row grid-cols-1 gap-y-3 gap-x-8 mt-4 text-200'>
											{subscriptionInformation.map((subscriptionItem, i) => (
												<DescriptionList
													key={i}
													title={subscriptionItem.title}
													value={subscriptionItem.value}
													action={subscriptionItem.action}
												/>
											))}
										</dl>
									) : (
										<section className='mt-4 card-padding-x'>
											<NullState
												header={'No active plans found'}
												text={
													'There are no subscriptions associated with your account'
												}
												path={svgList.payment}
												link={''}
												linkText={''}
												showButton={false}
											/>
										</section>
									)}
								</section>
								{/* payment method */}
								<section className='mt-4 pt-2 md:pt-4 lg:pt-6 pb-5 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='card-padding-x'>
											<h2 className='font-bold text-lg text-300'>
												Payment details
											</h2>
										</header>
									</div>
									<div className='card-padding-x'>
										{paymentMethodState.status === 'loading' ? (
											<Spinner
												divWidth={null}
												center={false}
												spinnerWidth={null}
												margin={true}
												text={'Loading payment methods...'}
											/>
										) : (
											<ul className='grid grid-cols-3 gap-4'>
												{paymentMethodState.paymentMethods.length > 0 &&
													paymentMethodState.paymentMethods.map((pm, i) => (
														<CardItem
															key={i}
															cusId={user.subscription.cusId!}
															pm={pm}
															paymentMethodState={paymentMethodState}
															setPaymentMethodState={setPaymentMethodState}
															handleCardUpdate={handleCardUpdate}
															modal={modal}
															setModal={setModal}
														/>
													))}
												<li className='all-center w-64 mt-4 p-14 card-100 cs-bg'>
													<button
														className='relative icon-button'
														onClick={() =>
															setModal({
																...modal,
																type: 'createCard',
																active: true,
															})
														}
														onMouseEnter={() => setAddNewCard(true)}
														onMouseLeave={() => setAddNewCard(false)}
													>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='h-5 w-5'
															viewBox='0 0 20 20'
															fill='currentColor'
														>
															<path
																fillRule='evenodd'
																d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
																clipRule='evenodd'
															/>
														</svg>
														{addNewCard && (
															<Badge
																title={'Add a new card'}
																edge={null}
																alignment={'bottom'}
															/>
														)}
													</button>
												</li>
											</ul>
										)}
									</div>
								</section>
								{modal.active && (
									<Modal
										user={user}
										type={modal.type}
										paymentMethodState={paymentMethodState}
										planState={planState}
										handleCardCreation={handleCardCreation}
										handleCardUpdate={handleCardUpdate}
										handleCardDelete={handleCardDelete}
										handleSubscriptionUpdate={handleSubscriptionUpdate}
										setModal={setModal}
									/>
								)}
								{/* billing history */}
								<section className='mt-4 pt-2 md:pt-4 lg:pt-6 pb-4 cs-light-300 card-200'>
									<header className='pb-4 card-padding-x border-b border-200'>
										<h2 className='font-bold text-lg text-300'>
											Billing history
										</h2>
									</header>
									{paymentState.status === 'loading' ? (
										<Spinner
											divWidth={null}
											center={false}
											spinnerWidth={null}
											margin={true}
											text={'Loading billing history...'}
										/>
									) : paymentState.payments.length > 0 ? (
										<div className={classes.tableWrapper}>
											<table className={classes.table} id='payments'>
												<thead className={classes.tableHeadWrapper}>
													<tr className={classes.tableHead}>
														<th className='pl-4 md:pl-6 lg:pl-8 pr-2'>Date</th>
														<th>Plan</th>
														<th className={classes.tableHeadCell}>Amount</th>
														<th className={classes.tableHeadCell} />
													</tr>
												</thead>
												<tbody className={classes.tableBody}>
													{paymentState.payments.map(
														(payment: any, i: number) => (
															<tr key={i} className={classes.rowWrapper}>
																{/* date */}
																<td className='pl-4 md:pl-6 lg:pl-8 pr-2 w-2/5'>
																	{formatTimestamp(payment.created, true)}
																</td>
																{/* plan */}
																<td>{planCheckerByPrice(payment.amount)}</td>
																{/* amount */}
																<td className={classes.defaultCellWrapper}>
																	<span>$</span>
																	{payment.amount / 100}
																	<span className={classes.valueIndicator}>
																		{payment.currency.toUpperCase()}
																	</span>
																</td>
																{/* download */}
																<td className='pl-2 pr-4 md:pr-6 lg:pr-8 text-right'>
																	<a
																		href={payment.invoice.pdf}
																		className='link rounded-sm ring-purple'
																	>
																		View invoice
																	</a>
																</td>
															</tr>
														)
													)}
												</tbody>
											</table>
										</div>
									) : (
										<section className='mt-4 card-padding-x'>
											<NullState
												header={'No subscription payments found'}
												text={'No payments have been found for your account.'}
												path={svgList.payment}
												link={''}
												linkText={''}
												showButton={false}
											/>
										</section>
									)}
								</section>
							</>
						) : (
							<section className='mt-4'>
								<NullState
									header={'No subscription found'}
									text={
										"There isn't a subscription associated with this account."
									}
									path={svgList.affiliate}
									link={''}
									linkText={''}
									showButton={false}
								/>
							</section>
						)}
					</section>
				</SettingsLayout>
			</AuthLayout>
		)
	);
};

interface CardItemProps {
	cusId: string;
	pm: PaymentMethod;
	paymentMethodState: PaymentMethodState;
	setPaymentMethodState: any;
	handleCardUpdate: any;
	modal: any;
	setModal: any;
}

const CardItem: React.FC<CardItemProps> = ({
	cusId,
	pm,
	paymentMethodState,
	setPaymentMethodState,
	handleCardUpdate,
	modal,
	setModal,
}) => {
	// local state
	const [actionModal, setActionModal] = useState(false);

	// action modal handlers
	const actionModalRef = useRef(null);
	useOutsideMouseup(actionModalRef, setActionModal, null);

	const cardActionMenuStyle = useSpring({
		x: actionModal ? 1 : 0,
	});

	// set icon for CC
	const setCardIcon = (
		cardTitle:
			| 'amex'
			| 'diners'
			| 'discover'
			| 'jcb'
			| 'mastercard'
			| 'unionpay'
			| 'visa'
			| 'unknown'
	) => {
		const foundIcon = cardIcons.find(
			(cardIcon) => cardIcon.title === cardTitle
		);
		if (foundIcon) {
			return foundIcon.icon;
		} else {
			return (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='w-8'
					viewBox='0 0 20 20'
					fill='currentColor'
				>
					<path d='M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z' />
					<path
						fillRule='evenodd'
						d='M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z'
						clipRule='evenodd'
					/>
				</svg>
			);
		}
	};

	const isDefaultCard = pm.id === paymentMethodState.defaultPmId;

	return (
		<li ref={actionModalRef} className='relative w-64 mt-4 card-100'>
			<div className='py-4 px-6'>
				<div className='center-between'>
					<div className='text-200 text-sm'>
						{pm.type === 'credit' || pm.type === 'debit' ? (
							<span>{capitalize(pm.type)} card</span>
						) : (
							<span>Card</span>
						)}
					</div>
					{isDefaultCard && (
						<span className='ml-2 py-0.5 px-2 cs-teal text-xs font-semibold rounded-main'>
							Default
						</span>
					)}
				</div>
				<div className='mt-4 flex items-center justify-between text-200'>
					<span className='text-100'>{setCardIcon(pm.brand)}</span>
					<span>**** **** **** {pm.last4}</span>
				</div>
			</div>
			<div className='flex items-center justify-end py-2 px-6 cs-bg rounded-b-lg border-t border-300'>
				<button
					onClick={() => {
						setActionModal(!actionModal);
					}}
					className='link'
				>
					Update
				</button>
			</div>
			{actionModal && (
				<animated.div
					className={
						'absolute right-0 z-10 w-48 mt-2 py-2 cs-light-400 card-200 text-sm'
					}
					style={{
						transform: cardActionMenuStyle.x
							.to({
								range: [0, 0.35, 0.75, 1],
								output: [1, 0.98, 1.02, 1],
							})
							.to((x) => `scale(${x})`),
					}}
				>
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleCardUpdate(cusId, pm.id);
						}}
						disabled={isDefaultCard}
						className={`py-2 px-3 w-full text-left font-semibold ${
							isDefaultCard
								? 'text-gray-300 dark:text-gray-700'
								: 'text-purple-500 dark:text-purple-300 hover:bg-gray-100 dark:hover:bg-darkGray-100 hover:text-gray-800'
						} transition-colors-main ring-gray ring-inset`}
					>
						<span>Set as default card</span>
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setActionModal(false);
							setModal({
								...modal,
								type: 'deleteCard',
								active: true,
							});
							setPaymentMethodState({
								...paymentMethodState,
								currentPaymentMethod: pm,
							});
						}}
						className='py-2 px-3 w-full text-left font-semibold text-purple-500 dark:text-purple-300 hover:bg-gray-100 dark:hover:bg-darkGray-100 hover:text-gray-800 transition-colors-main ring-gray ring-inset'
					>
						<span>Remove card</span>
					</button>
				</animated.div>
			)}
		</li>
	);
};

const CardForm: React.FC = () => {
	const [colorTheme] = useDarkMode();

	//   stripe element input styles
	const cardElementOpts = {
		style: {
			base: {
				fontSize: '15.75px',
				fontFamily: 'inherit',
				color: colorTheme === 'light' ? '#fff' : '#243B53',
				iconColor: colorTheme === 'light' ? '#829AB1' : '#9FB3C8',
				'::placeholder': {
					color: colorTheme === 'light' ? '#627D98' : '#829AB1',
				},
			},
			invalid: {
				iconColor: colorTheme === 'light' ? '#feb2b2' : 'fc8181',
				color: colorTheme === 'light' ? '#feb2b2' : 'fc8181',
			},
			complete: {
				iconColor: colorTheme === 'light' ? '#8EEDC7' : '#65D6AD',
			},
			iconStyle: 'solid',
		},
	};

	return (
		<div className='mt-4'>
			<form>
				<CardElement options={cardElementOpts} className='form-field' />
			</form>
		</div>
	);
};

interface ModalProps {
	user: User;
	type: ModalType;
	paymentMethodState: PaymentMethodState;
	planState: PlanState;
	handleCardCreation: any;
	handleCardUpdate: any;
	handleCardDelete: any;
	handleSubscriptionUpdate: (
		subId: string | null,
		cancel: boolean
	) => Promise<void>;
	setModal: any;
}

const Modal: React.FC<ModalProps> = ({
	user,
	type,
	paymentMethodState,
	planState,
	handleCardCreation,
	handleCardDelete,
	handleSubscriptionUpdate,
	setModal,
}) => {
	const stripe = useStripe();
	const elements = useElements();

	// destructure necessary props
	const { currentPaymentMethod, defaultPmId } = paymentMethodState;
	const { cancelAt, currentPeriodEnd } = planState;

	const modalOptions = [
		{
			type: 'createCard',
			title: 'Add a new card',
			body: <CardForm />,
			action: (
				<Button
					text={'Save'}
					onClick={() =>
						handleCardCreation(stripe, elements, user.subscription.cusId)
					}
					width={null}
					margin={true}
					size={'sm'}
					cta={true}
					path={null}
					conditional={null}
					conditionalDisplay={null}
				/>
			),
		},
		{
			type: 'deleteCard',
			title: 'Remove card',
			body: (
				<p>
					Are you sure you want to remove the{' '}
					<span className='font-semibold'>
						{currentPaymentMethod &&
							currentPaymentMethod.brand !== 'unknown' &&
							currentPaymentMethod.brand.toUpperCase()}
					</span>{' '}
					{(currentPaymentMethod?.type === 'credit' ||
						currentPaymentMethod?.type === 'debit') && (
						<strong>{currentPaymentMethod.type} card</strong>
					)}{' '}
					<strong>
						{currentPaymentMethod && `ending in ${currentPaymentMethod.last4}`}
					</strong>
					? This action is permanent and can't be undone.
				</p>
			),
			action: (
				<Button
					text={'Confirm'}
					onClick={() =>
						handleCardDelete(
							currentPaymentMethod && currentPaymentMethod.id,
							defaultPmId
						)
					}
					width={null}
					margin={true}
					size={'sm'}
					cta={true}
					path={null}
					conditional={null}
					conditionalDisplay={null}
					type={'danger'}
				/>
			),
		},
		{
			type: 'deleteSubscription',
			title: 'Cancel subscription',
			body: (
				<p>
					We'd be sad to see you go!{' '}
					<span role='img' aria-label='Sad emoji'>
						😔
					</span>{' '}
					You currently have <strong>{cancelAt}</strong> left on your
					subscription for no additional charges. You won't be charged for
					another billing cycle until <strong>{currentPeriodEnd}</strong>. Are
					you sure you want to unsubscribe now?
				</p>
			),
			action: (
				<Button
					text={'Confirm'}
					onClick={() => handleSubscriptionUpdate(planState.subId, true)}
					width={null}
					margin={true}
					size={'sm'}
					cta={true}
					path={null}
					conditional={null}
					conditionalDisplay={null}
					type={'danger'}
				/>
			),
		},
		{
			type: 'updateSubscription',
			title: 'Update subscription',
			body: (
				<p>
					Glad to see you back{' '}
					<span role='img' aria-label='Happy emoji'>
						😁
					</span>{' '}
					Click "Resubscribe" below to prevent cancelling your plan in{' '}
					<strong>{cancelAt}</strong>. You'll get another month of awesome leads
					on <strong>{currentPeriodEnd}</strong>!
				</p>
			),
			action: (
				<Button
					text={'Resubscribe'}
					onClick={() => handleSubscriptionUpdate(planState.subId, false)}
					width={null}
					margin={true}
					size={'sm'}
					cta={true}
					path={null}
					conditional={null}
					conditionalDisplay={null}
				/>
			),
		},
	];

	const [content] = useState(
		modalOptions.find((modalOption) => modalOption.type === type)
	);

	return (
		<>
			<div
				onClick={(prev) => {
					setModal({
						...prev,
						type: null,
						active: false,
					});
				}}
				className='absolute inset-0 z-10 h-full w-full bg-gray-900 opacity-25'
			/>
			<div
				className={`absolute top-1/4 inset-x-0 z-20 max-h-screen max-w-lg mx-auto pt-2 md:pt-4 lg:pt-6 cs-light-200 card-200`}
			>
				<div className='relative pb-1 border-b border-200'>
					<header className='card-padding-x'>
						<h3 className='text-xl font-bold text-300'>
							{content?.title ? content?.title : 'Edit'}
						</h3>
					</header>
					<button
						onClick={(prev) => {
							setModal({
								...prev,
								type: null,
								active: false,
							});
						}}
						className='absolute top-0 right-3 md:right-5 lg:right-7 ml-2 p-1 text-100 hover:bg-gray-100 dark:hover:bg-darkGray-100 rounded-md hover:text-gray-700 dark:hover:text-gray-400 ring-gray transition-main'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='svg-base'
							viewBox='0 0 20 20'
							fill='currentColor'
						>
							<path
								fillRule='evenodd'
								d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
								clipRule='evenodd'
							/>
						</svg>
					</button>
				</div>
				{type && (
					<div className='mt-4'>
						<div className='card-padding-x'>{content?.body}</div>
						<div className='flex justify-end mt-4 py-2 card-padding-x cs-bg rounded-b-lg border-t border-300'>
							<div className='flex items-center'>{content?.action}</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

const svgList = {
	subscription: (
		<path d='M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z' />
	),
	payment: (
		<g>
			<path d='M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z' />
			<path
				fillRule='evenodd'
				d='M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z'
				clipRule='evenodd'
			/>
		</g>
	),
	affiliate: (
		<path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' />
	),
};

const cardIcons = [
	{
		title: 'amex',
		icon: <AmexIcon className='w-12' />,
	},
	{
		title: 'discover',
		icon: <DiscoverIcon className='w-12' />,
	},
	{
		title: 'diners',
		icon: <DinersIcon className='w-12' />,
	},
	{
		title: 'jcb',
		icon: <JCBIcon className='w-12' />,
	},
	{
		title: 'mastercard',
		icon: <MastercardIcon className='w-12' />,
	},
	{
		title: 'visa',
		icon: <VisaIcon className='w-12' />,
	},
];

const classes = {
	tableWrapper: 'w-full relative',
	table: 'w-full table-auto',
	tableHeadWrapper: 'border-t border-b border-200',
	tableHead:
		'text-left font-semibold text-xs text-100 uppercase tracking-widest whitespace-no-wrap cs-bg',
	tableHeadCell: 'p-3',
	tableBody: 'text-200',
	rowWrapper: 'relative px-1 border-b border-100 last:border-none',
	defaultCellWrapper: 'p-3',
	defaultSvg: 'svg-base',
	valueIndicator: 'ml-1 text-gray-400 font-semibold',
};

export default BillingPage;
