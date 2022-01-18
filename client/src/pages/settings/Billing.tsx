import React, { useEffect, useCallback } from 'react';

// packages
import axios from 'axios';
import { DateTime } from 'luxon';
import { useStateIfMounted } from 'use-state-if-mounted';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

// redux
import { useAppSelector, useAppDispatch } from '@hooks/hooks';
import { setAlert } from '@components/features/alert/alertSlice';

// components
import AuthLayout from '@components/layout/AuthLayout';
import DescriptionList from '@components/utils/DescriptionList';
import NullState from '@components/utils/NullState';
import SettingsLayout from '@components/layout/SettingsLayout';
import Spinner from '@components/utils/Spinner';

// utils
import {
	capitalize,
	config,
	formatTimestamp,
	planCheckerByPrice,
	truncate,
} from '@utils/utils';
import { User } from '@utils/interfaces/User';

// assets
import { ReactComponent as MastercardIcon } from '@assets/images/svgs/mastercard.svg';
import { ReactComponent as VisaIcon } from '@assets/images/svgs/visa.svg';
import { ReactComponent as DiscoverIcon } from '@assets/images/svgs/discover.svg';
import { ReactComponent as AmexIcon } from '@assets/images/svgs/amex.svg';

interface PlanState {
	status: 'loading' | 'idle';
	id: string | null;
	created: string | null;
	cancelAt: string | null;
	cancelAtPeriod: boolean | null;
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
	brand: string;
	expMonth: number;
	expYear: number;
	last4: string;
	type: 'card';
}

interface PaymentMethodState {
	status: 'loading' | 'idle';
	paymentMethods: PaymentMethod[];
}

const BillingPage = () => {
	// auth state
	const authStatus = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const user = useAppSelector((state) => state.auth.user);

	// local state
	const [planState, setPlanState] = useStateIfMounted<PlanState>({
		status: 'loading',
		id: null,
		created: null,
		cancelAt: null,
		cancelAtPeriod: null,
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
			paymentMethods: [],
		});

	const getActivePlanDetails = useCallback(
		async (activeSubId: string) => {
			try {
				// GET request to route
				const {
					data: { message, subscription },
				} = await axios.get(`/api/users/plan?subId=${activeSubId}`);

				// if subscription data is found, update state
				if (message === 'Subscription data found') {
					return setPlanState({
						...planState,
						status: 'idle',
						id: subscription.id,
						created: subscription.created,
						cancelAt: subscription.cancelAt,
						cancelAtPeriod: subscription.cancelAtPeriod,
						currentPeriodEnd: subscription.currentPeriodEnd,
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
	}, []);

	// get active plan details
	useEffect(() => {
		// get the user's active subscription
		const activeSub = getActiveSub();

		isAuthenticated &&
			authStatus === 'idle' &&
			planState.status === 'loading' &&
			activeSub?.id &&
			getActivePlanDetails(activeSub.id);
	}, [
		getActiveSub,
		isAuthenticated,
		authStatus,
		planState.status,
		user?.subscription.subIds,
		getActivePlanDetails,
	]);

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
			title: 'Leadgeek member since',
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
			title: 'Current subscription active since',
			value: (
				<div>
					{planState.created && formatTimestamp(+planState.created, true)}
				</div>
			),
		},
		{
			title: 'Current subscription',
			value: (
				<div>
					{planState.plan.amount && planCheckerByPrice(planState.plan.amount)}{' '}
					plan
				</div>
			),
		},
		{
			title: `Est. charge for
           ${
							!planState.cancelAtPeriod &&
							planState.currentPeriodEnd &&
							formatTimestamp(+planState.currentPeriodEnd, false)
						}`,
			value: (
				<div>
					{planState.plan.amount && (
						<div className='font-bold'>${planState.plan.amount / 100}</div>
					)}
				</div>
			),
		},
		{
			title: 'Update subscription',
			value: (
				<div>
					<a
						href='mailto:support@leadgeek.io'
						target='_blank'
						rel='noopener noreferrer'
						className='link'
					>
						Contact support
					</a>
				</div>
			),
		},
	];

	const getPaymentMethods = useCallback(async (cusId: string) => {
		const res = await axios.get(`/api/users/payment-methods?cusId=${cusId}`);

		setPaymentMethodState(res.data);
	}, []);

	useEffect(() => {
		user?.subscription.cusId && getPaymentMethods(user?.subscription.cusId);
	}, [user, getPaymentMethods]);

	return (
		authStatus === 'idle' &&
		user && (
			<AuthLayout>
				<SettingsLayout
					title={'Plan & billing'}
					description={'Update your plan and view past invoices'}
				>
					<section className='my-6'>
						{user?.subscription.cusId ? (
							<>
								{/* subscription information */}
								<section className='pt-2 md:pt-4 lg:pt-6 pb-5 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='card-padding-x'>
											<h2 className='font-bold text-lg text-300'>
												Subscription information
											</h2>
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
												/>
											))}
										</dl>
									) : (
										<div className='mt-4 card-padding-x'>
											No active plans were found.
										</div>
									)}
								</section>
								{/* payment method */}
								<section className='mt-4 pt-2 md:pt-4 lg:pt-6 pb-5 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='card-padding-x'>
											<h2 className='font-bold text-lg text-300'>
												Payment method
											</h2>
										</header>
									</div>
									<div className='card-padding-x'>
										{/* <button onClick={() => handleUpdatePayment()}>REE</button> */}
										{/* <CardForm user={user} /> */}
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
														<li className='w-64 mt-4 card-100'>
															<div className='pt-4 pb-1 px-6'>
																{pm.type === 'card' && (
																	<div className='text-sm text-100'>
																		{capitalize(pm.type)}
																	</div>
																)}
																<div className='mt-2 flex items-center justify-between text-200'>
																	<VisaIcon className='w-14' />
																	<span>**** **** **** {pm.last4}</span>
																</div>
															</div>
															<div className='flex justify-end py-2 px-6 cs-bg rounded-b-lg border-t border-300'>
																<button className='link'>Edit</button>
															</div>
														</li>
													))}
												<li className='all-center w-64 mt-4 p-14 card-100 cs-bg'>
													{/* TODO: Add hover state with popup for "add new card" */}
													<button className='text-100'>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='h-8 w-8'
															viewBox='0 0 20 20'
															fill='currentColor'
														>
															<path
																fillRule='evenodd'
																d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
																clipRule='evenodd'
															/>
														</svg>
													</button>
												</li>
											</ul>
										)}
									</div>
								</section>
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
														<th className='pl-4 md:pl-6 lg:pl-8 pr-2'>
															Invoice ID
														</th>
														<th className={classes.tableHeadCell}>Plan</th>
														<th className={classes.tableHeadCell}>Amount</th>
														<th className='pl-2 pr-4 md:pr-6 lg:pr-8 text-right'>
															Date
														</th>
													</tr>
												</thead>
												<tbody className={classes.tableBody}>
													{paymentState.payments.map(
														(payment: any, i: number) => (
															<tr key={i} className={classes.rowWrapper}>
																{/* invoice id */}
																<td className='pl-4 md:pl-6 lg:pl-8 pr-2'>
																	<a
																		href={payment.invoice.pdf}
																		className='link rounded-sm ring-purple'
																	>
																		{truncate(payment.invoice.id, 31)}
																	</a>
																</td>
																{/* plan */}
																<td className={classes.defaultCellWrapper}>
																	{planCheckerByPrice(payment.amount)}
																</td>
																{/* amount */}
																<td className={classes.defaultCellWrapper}>
																	<span>$</span>
																	{payment.amount / 100}
																	<span className={classes.valueIndicator}>
																		{payment.currency.toUpperCase()}
																	</span>
																</td>
																{/* date */}
																<td className='pl-2 pr-4 md:pr-6 lg:pr-8 text-right'>
																	{formatTimestamp(payment.created, true)}
																</td>
															</tr>
														)
													)}
												</tbody>
											</table>
										</div>
									) : (
										<section className='mt-4'>
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

interface CardFormProps {
	user: User;
}

const CardForm: React.FC<CardFormProps> = ({ user }) => {
	const dispatch = useAppDispatch();
	const stripe = useStripe();
	const elements = useElements();

	const cusId = user.subscription.cusId;

	const handleCardSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!stripe || !elements || !cusId) {
			return;
		}

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
							name: user.name,
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
					console.log(card);
					const body = JSON.stringify({
						pmId: res.setupIntent.payment_method,
						cusId,
					});

					await axios.post('/api/users/payment-method', body, config);
				}
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
	return (
		<form onSubmit={handleCardSubmit}>
			<CardElement />
			<button type={'submit'}>HEELO</button>
		</form>
	);
};

const svgList = {
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

const classes = {
	tableWrapper: 'w-full relative',
	table: 'w-full table-auto',
	tableHeadWrapper: 'border-t border-b border-200',
	tableHead:
		'text-left font-semibold text-xs text-100 uppercase tracking-widest whitespace-no-wrap cs-bg',
	tableHeadCell: 'p-3',
	tableBody: 'text-sm text-200',
	rowWrapper: 'relative px-1 border-b border-100 last:border-none',
	defaultCellWrapper: 'p-3',
	defaultSvg: 'svg-base',
	valueIndicator: 'ml-1 text-gray-400 font-semibold',
};

export default BillingPage;
