import React, { useState, useEffect } from 'react';

// packages
import axios from 'axios';
import { DateTime } from 'luxon';

// redux
import { useAppSelector } from '@hooks/hooks';

// components
import AuthLayout from '@components/layout/AuthLayout';
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

interface BillingState {
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
	const [billingState, setBillingState] = useState<BillingState>({
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
		paymentHistory: {
			status: 'loading',
			payments: [],
			pagination: {
				page: 1,
				itemLimit: 10,
			},
		},
	});
	const [validBilling, setValidBilling] = useState(false);

	useEffect(() => {
		if (!isAuthenticated) return setValidBilling(false);

		if (authStatus === 'idle' && isAuthenticated && user?.subscription.cusId) {
			return setValidBilling(true);
		}
	}, [authStatus, isAuthenticated, user?.subscription.cusId]);

	const getSuccessfulPayments = async (cusId: string) => {
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
			setBillingState({
				...billingState,
				paymentHistory: {
					...billingState.paymentHistory,
					status: 'idle',
					payments: data.payments,
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		billingState.paymentHistory.status !== 'idle' &&
			validBilling &&
			user?.subscription.cusId &&
			getSuccessfulPayments(user.subscription.cusId);
	}, [validBilling, user?.subscription.cusId]);

	// get active plan details
	useEffect(() => {
		const getActivePlanDetails = async (subId: string) => {
			try {
				// build request body
				const body = JSON.stringify({ subId });

				// POST request to route
				const {
					data: { message, subscription },
				} = await axios.post('/api/users/active-plan-details', body, config);
				if (message === 'Subscription data found') {
					console.log(subscription);
					setBillingState({
						...billingState,
						plan: {
							...billingState.plan,
							status: 'idle',
							id: subscription.id,
							created: subscription.created,
							cancelAt: subscription.cancelAt,
							cancelAtPeriod: subscription.cancelAtPeriod,
							currentPeriodEnd: subscription.currentPeriodEnd,
							plan: {
								...billingState.plan.plan,
								id: subscription.plan.id,
								amount: subscription.plan.amount,
							},
						},
					});
				} else {
					// // update state loading status
					// setBillingState({
					// 	...billingState,
					// 	plan: {
					// 		...billingState.plan,
					// 		status: 'idle',
					// 	},
					// });
				}
			} catch (error) {
				console.log(error);
			}
		};

		// get the user's active subscription
		const activeSub = user?.subscription.subIds.filter(
			(sub) => sub.active === true
		)[0];

		isAuthenticated &&
			authStatus === 'idle' &&
			billingState.plan.status !== 'idle' &&
			validBilling &&
			activeSub?.id &&
			getActivePlanDetails(activeSub.id);
	}, [
		isAuthenticated,
		authStatus,
		billingState.plan.status,
		validBilling,
		user?.subscription.subIds,
		billingState,
	]);

	const paymentMethodBrand =
		isAuthenticated &&
		validBilling &&
		user?.billing.brand &&
		capitalize(user.billing.brand);

	return (
		authStatus === 'idle' &&
		user && (
			<AuthLayout>
				<SettingsLayout
					isAuthenticated={isAuthenticated}
					user={user}
					title={'Billing'}
					description={'Manage your billing settings'}
					pill={null}
				>
					<section className='my-6'>
						{validBilling ? (
							<>
								{/* subscription information */}
								<section className='mt-4 pt-2 md:pt-4 lg:pt-6 pb-4 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='px-4 md:px-6 lg:px-8'>
											<h2 className='font-bold text-lg text-300'>
												Subscription information
											</h2>
										</header>
									</div>
									{billingState.plan.status === 'loading' ? (
										<Spinner
											divWidth={null}
											center={false}
											spinnerWidth={null}
											margin={true}
											text={'Loading subscription information...'}
										/>
									) : billingState.plan.id ? (
										<ul className='mt-6 px-4 md:px-6 lg:px-8 grid grid-flow-col grid-rows-5 grid-cols-1 gap-y-3 gap-x-8 text-200'>
											<li className='flex items-center justify-between'>
												<div>Member since</div>
												<div>
													{isAuthenticated &&
														DateTime.fromISO(user.dateCreated).toFormat(
															'LLL dd, yyyy'
														)}
												</div>
											</li>
											<li className='flex items-center justify-between'>
												<div>Current subscription active since</div>
												<div>
													{billingState.plan.created &&
														formatTimestamp(+billingState.plan.created, true)}
												</div>
											</li>
											<li className='flex items-center justify-between'>
												<div>Current subscription</div>
												<div className='font-bold'>
													{billingState.plan.plan.amount &&
														planCheckerByPrice(
															billingState.plan.plan.amount
														)}{' '}
													plan
												</div>
											</li>
											<li className='flex items-center justify-between'>
												<div>
													Est. charge for{' '}
													<span className='font-bold'>
														{!billingState.plan.cancelAtPeriod &&
															billingState.plan.currentPeriodEnd &&
															formatTimestamp(
																+billingState.plan.currentPeriodEnd,
																false
															)}
													</span>
												</div>
												{billingState.plan.plan.amount && (
													<div className='font-bold'>
														${billingState.plan.plan.amount / 100}
													</div>
												)}
											</li>
											<li className='flex items-center justify-between'>
												<div>Default payment method</div>
												<div>
													{paymentMethodBrand} &#8226;&#8226;&#8226;&#8226;{' '}
													{user.billing.last4}
												</div>
											</li>
										</ul>
									) : (
										// 	<div className='flex items-center justify-between'>
										// 		<div>Change subscription preferences</div>
										// 		<div>
										// 			<a
										// 				href='mailto:support@leadgeek.io?subject=Update Account'
										// 				target='__blank'
										// 				rel='noopener noreferrer'
										// 				className='ml-2 font-semibold text-purple-600 hover:text-gray-700 ring-gray rounded-lg transition-main'
										// 			>
										// 				Contact support
										// 			</a>
										// 		</div>
										// 	</div>
										// </div>
										<div>There are no active plans</div>
									)}
								</section>
								{/* billing history */}
								<section className='mt-4 pt-2 md:pt-4 lg:pt-6 pb-2 cs-light-300 card-200'>
									<header className='px-4 md:px-6 lg:px-8'>
										<h2 className='font-bold text-lg text-300'>
											Billing history
										</h2>
									</header>
									{billingState.paymentHistory.status === 'loading' ? (
										<Spinner
											divWidth={null}
											center={false}
											spinnerWidth={null}
											margin={true}
											text={'Loading historical payments...'}
										/>
									) : billingState.paymentHistory.payments.length > 0 ? (
										<div>
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
														{billingState.paymentHistory.payments.map(
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
																		{paymentMethodBrand}{' '}
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
											<div className='flex items-center'></div>
										</div>
									) : (
										<section className='mt-4'>
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
							<section className='mt-4'>
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
	tableWrapper: 'w-full relative mt-4',
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
