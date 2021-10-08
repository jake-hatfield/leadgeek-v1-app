import React, { useEffect, useCallback } from 'react';

// packages
import axios from 'axios';
import { DateTime } from 'luxon';
import { useStateIfMounted } from 'use-state-if-mounted';

// redux
import { useAppSelector } from '@hooks/hooks';

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

interface PlanState {
	plan: {
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
	};
}

interface PaymentState {
	paymentHistory: {
		status: 'loading' | 'idle';
		payments: any;
		pagination: {
			page: number;
			itemLimit: 10;
		};
	};
}

const BillingPage = () => {
	// auth state
	const authStatus = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const user = useAppSelector((state) => state.auth.user);

	// local state
	const [planState, setPlanState] = useStateIfMounted<PlanState>({
		plan: {
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
		},
	});

	const [paymentState, setPaymentState] = useStateIfMounted<PaymentState>({
		paymentHistory: {
			status: 'loading',
			payments: [],
			pagination: {
				page: 1,
				itemLimit: 10,
			},
		},
	});

	const getActivePlanDetails = useCallback(
		async (activeSubId: string) => {
			try {
				// build request body
				const body = JSON.stringify({ subId: activeSubId });

				// POST request to route
				const {
					data: { message, subscription },
				} = await axios.post('/api/users/active-plan-details', body, config);

				// if subscription data is found, update state
				if (message === 'Subscription data found') {
					return setPlanState({
						...planState,
						plan: {
							...planState.plan,
							status: 'idle',
							id: subscription.id,
							created: subscription.created,
							cancelAt: subscription.cancelAt,
							cancelAtPeriod: subscription.cancelAtPeriod,
							currentPeriodEnd: subscription.currentPeriodEnd,
							plan: {
								...planState.plan.plan,
								id: subscription.plan.id,
								amount: subscription.plan.amount,
							},
						},
					});
				} else {
					// update state loading status
					return setPlanState({
						...planState,
						plan: {
							...planState.plan,
							status: 'idle',
						},
					});
				}
			} catch (error) {
				console.log(error);
				return setPlanState({
					...planState,
					plan: {
						...planState.plan,
						status: 'idle',
					},
				});
			}
		},
		[planState, setPlanState]
	);

	// get active plan details
	useEffect(() => {
		// get the user's active subscription
		const activeSub = user?.subscription.subIds.filter(
			(sub) => sub.active === true
		)[0];

		isAuthenticated &&
			authStatus === 'idle' &&
			planState.plan.status === 'loading' &&
			activeSub?.id &&
			getActivePlanDetails(activeSub.id);
	}, [
		isAuthenticated,
		authStatus,
		planState.plan.status,
		user?.subscription.subIds,
		getActivePlanDetails,
	]);

	const getSuccessfulPayments = useCallback(
		async (cusId: string) => {
			try {
				// build request body
				const body = JSON.stringify({ cusId });

				// POST request to route
				const { data } = await axios.post(
					'/api/users/successful-payments/',
					body,
					config
				);

				// update state
				return setPaymentState({
					...paymentState,
					paymentHistory: {
						...paymentState.paymentHistory,
						status: 'idle',
						payments: data.payments,
					},
				});
			} catch (error) {
				console.log(error);
				return setPaymentState({
					...paymentState,
					paymentHistory: {
						...paymentState.paymentHistory,
						status: 'idle',
					},
				});
			}
		},
		[paymentState, setPaymentState]
	);

	useEffect(() => {
		isAuthenticated &&
			authStatus === 'idle' &&
			paymentState.paymentHistory.status === 'loading' &&
			user?.subscription.cusId &&
			getSuccessfulPayments(user.subscription.cusId);
	}, [
		isAuthenticated,
		authStatus,
		paymentState.paymentHistory.status,
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
						DateTime.fromISO(user.dateCreated).toFormat('LLL dd, yyyy')}
				</div>
			),
		},
		{
			title: 'Current subscription active since',
			value: (
				<div>
					{planState.plan.created &&
						formatTimestamp(+planState.plan.created, true)}
				</div>
			),
		},
		{
			title: 'Current subscription',
			value: (
				<div>
					{planState.plan.plan.amount &&
						planCheckerByPrice(planState.plan.plan.amount)}{' '}
					plan
				</div>
			),
		},
		{
			title: `Est. charge for
           ${
							!planState.plan.cancelAtPeriod &&
							planState.plan.currentPeriodEnd &&
							formatTimestamp(+planState.plan.currentPeriodEnd, false)
						}`,
			value: (
				<div>
					{planState.plan.plan.amount && (
						<div className='font-bold'>${planState.plan.plan.amount / 100}</div>
					)}
				</div>
			),
		},
		{
			title: 'Default payment method',
			value: (
				<div>
					{user?.billing.brand && capitalize(user.billing.brand)}{' '}
					&#8226;&#8226;&#8226;&#8226; {user?.billing.last4}
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
									{planState.plan.status === 'loading' ? (
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
								{/* billing history */}
								<section className='mt-4 pt-2 md:pt-4 lg:pt-6 pb-4 cs-light-300 card-200'>
									<header className='pb-4 card-padding-x border-b border-200'>
										<h2 className='font-bold text-lg text-300'>
											Billing history
										</h2>
									</header>
									{paymentState.paymentHistory.status === 'loading' ? (
										<Spinner
											divWidth={null}
											center={false}
											spinnerWidth={null}
											margin={true}
											text={'Loading historical payments...'}
										/>
									) : paymentState.paymentHistory.payments.length > 0 ? (
										<div className={classes.tableWrapper}>
											<table className={classes.table} id='payments'>
												<thead className={classes.tableHeadWrapper}>
													<tr className={classes.tableHead}>
														<th className='pl-4 md:pl-6 lg:pl-8 pr-2'>
															Invoice ID
														</th>
														<th className={classes.tableHeadCell}>Plan</th>
														<th className={classes.tableHeadCell}>Amount</th>
														<th className={classes.tableHeadCell}>
															Payment method
														</th>
														<th className='pl-2 pr-4 md:pr-6 lg:pr-8 text-right'>
															Date
														</th>
													</tr>
												</thead>
												<tbody className={classes.tableBody}>
													{paymentState.paymentHistory.payments.map(
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
																{/* payment method */}
																<td className={classes.defaultCellWrapper}>
																	{user?.billing.brand &&
																		capitalize(user.billing.brand)}{' '}
																	&#8226;&#8226;&#8226;&#8226;{' '}
																	&#8226;&#8226;&#8226;&#8226;{' '}
																	&#8226;&#8226;&#8226;&#8226;{' '}
																	{payment.paymentMethod.last4}
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
										<section className='mt-4 card-padding-x'>
											<NullState
												header={'No subscription payments found'}
												text={'No payments have been found for your account.'}
												path={svgList.payment}
												link={''}
												linkText={''}
											/>
										</section>
									)}
								</section>
							</>
						) : (
							<section className='mt-4 card-padding-x'>
								<NullState
									header={'No subscription found'}
									text={
										"There isn't a subscription associated with this account."
									}
									path={svgList.affiliate}
									link={''}
									linkText={''}
								/>
							</section>
						)}
					</section>
				</SettingsLayout>
			</AuthLayout>
		)
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
