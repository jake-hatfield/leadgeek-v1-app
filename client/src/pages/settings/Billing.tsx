import React, { useState, useEffect } from 'react';

// packages
import axios from 'axios';
import { DateTime } from 'luxon';

// redux
import { useAppSelector } from '@hooks/hooks';
// import { cancelStripeSub } from '@redux/actions/auth';

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
		},
	});
	const [validBilling] = useState(
		isAuthenticated && user?.subscription.cusId ? true : false
	);

	const getSuccessfulPayments = async (cusId: string) => {
		try {
			const body = JSON.stringify({ cusId });
			const { data } = await axios.post(
				'/api/users/get-successful-payments/',
				body,
				config
			);
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

	const getActivePlanDetails = async (subIds: string) => {
		try {
			const body = JSON.stringify({ subIds });
			const {
				data: { message, subscription },
			} = await axios.post('/api/users/get-active-plan-details', body, config);
			if (message === 'Subscription data found') {
				console.log(subscription);
			} else {
				setBillingState({
					...billingState,
					plan: {
						...billingState.plan,
						status: 'idle',
					},
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		isAuthenticated &&
			validBilling &&
			user?.subscription.cusId &&
			getSuccessfulPayments(user.subscription.cusId);
	}, [isAuthenticated, user?.subscription.cusId, validBilling]);

	// useEffect(() => {
	// 	isAuthenticated &&
	// 		validBilling &&
	// 		user?.subscription.subIds &&
	// 		// getActivePlanDetails(user.subscription.subIds);
	// }, [isAuthenticated, validBilling, user?.subscription.subIds]);

	const paymentMethodBrand =
		isAuthenticated &&
		validBilling &&
		user?.billing.brand &&
		capitalize(user.billing.brand);

	return (
		authStatus === 'idle' &&
		user && (
			<AuthLayout colorTheme={'light'}>
				<SettingsLayout
					isAuthenticated={isAuthenticated}
					user={user}
					title={'Billing & plans'}
					description={'Manage your Leadgeek plan'}
					pill={null}
				>
					<section className='my-6'>
						{validBilling ? (
							<div className='w-full pr-16 text-gray-800'>
								<section>
									<header className='flex items-end justify-between pb-2 border-b border-gray-200'>
										<h2 className='font-bold text-lg text-gray-800'>
											Subscription information
										</h2>
									</header>
									{billingState.plan.status === 'loading' ? (
										<Spinner
											divWidth={null}
											center={false}
											spinnerWidth={null}
											margin={true}
											text={'Loading your subscription info...'}
										/>
									) : billingState.plan.id ? (
										// <div className='mt-6 grid grid-flow-col grid-rows-3 grid-cols-2 gap-y-2 gap-x-8'>
										// 	<div className='flex items-center justify-between'>
										// 		<div>Member since</div>
										// 		<div>
										// 			{isAuthenticated &&
										// 				DateTime.fromISO(user.dateCreated).toFormat(
										// 					'LLL dd, yyyy'
										// 				)}
										// 		</div>
										// 	</div>
										// 	<div className='flex items-center justify-between'>
										// 		<div>Current subscription active since</div>
										// 		<div>
										// 			{isAuthenticated &&
										// 				formatTimestamp(billingState.plan.created, true)}
										// 		</div>
										// 	</div>
										// 	<div className='flex items-center justify-between'>
										// 		<div>Current subscription</div>
										// 		<div className='font-bold'>
										// 			{planCheckerByPrice(billingState.plan.plan.amount)}{' '}
										// 			plan
										// 		</div>
										// 	</div>
										// 	<div className='flex items-center justify-between'>
										// 		<div>
										// 			Est. charge for{' '}
										// 			<span className='font-bold'>
										// 				{isAuthenticated &&
										// 					!plan.cancelAtPeriodEnd &&
										// 					formatTimestamp(plan.currentPeriodEnd)}
										// 			</span>
										// 		</div>
										// 		<div className='font-bold'>
										// 			${plan.plan.amount / 100}
										// 		</div>
										// 	</div>
										{
											/* <div className='flex items-center justify-between'>
                                        <div>Default payment method</div>
                                        <div>
                                            <button className='ml-2 font-semibold text-purple-600 hover:text-gray-700 ring-gray rounded-lg transition-main'>
                                                {paymentMethodBrand} &#8226;&#8226;&#8226;&#8226;{' '}
                                                {user.billing.last4}
                                            </button>
                                        </div>
                                    </div> */
										}
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
								<article className='mt-6'>
									<header className='flex items-end justify-between pb-2 border-b border-gray-200'>
										<h2 className='font-bold text-lg text-gray-800'>
											Payment history
										</h2>
									</header>
									{billingState.paymentHistory.status === 'loading' ? (
										<Spinner
											divWidth={null}
											center={false}
											spinnerWidth={null}
											margin={true}
											text={'Loading your account payments...'}
										/>
									) : billingState.paymentHistory.payments.length > 0 ? (
										<div>
											<div className={classes.tableWrapper}>
												<table className={classes.table} id='payments'>
													<thead className={classes.tableHeadWrapper}>
														<tr className={classes.tableHead}>
															<th>Invoice ID</th>
															<th className={classes.tableHeadCell}>Plan</th>
															<th className={classes.tableHeadCell}>Amount</th>
															<th className={classes.tableHeadCell}>
																Payment method
															</th>
															<th className='pl-2 text-right'>Date</th>
														</tr>
													</thead>
													<tbody className={classes.tableBody}>
														{billingState.paymentHistory.payments.map(
															(payment: any, i: number) => (
																<tr key={i} className={classes.rowWrapper}>
																	{/* invoice id */}
																	<td>
																		<a
																			href={payment.invoice.pdf}
																			className='font-semibold text-purple-600 hover:text-gray-700 ring-gray rounded-lg transition-main'
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
																	<td className='pl-2 text-right'>
																		{formatTimestamp(payment.created, true)}
																	</td>
																</tr>
															)
														)}
													</tbody>
												</table>
											</div>
										</div>
									) : (
										<section className='mt-6'>
											<NullState
												header={'No subscription payments found'}
												text={'No payments have been found for your account.'}
												path={svgList.payment}
												link={''}
												linkText={''}
											/>
										</section>
									)}
								</article>
							</div>
						) : (
							<section className='mt-6'>
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
	tableHeadWrapper: 'border-b border-gray-200',
	tableHead:
		'text-left font-semibold text-xs text-gray-600 uppercase tracking-widest whitespace-no-wrap',
	tableHeadCell: 'p-2',
	tableBody: 'text-sm text-gray-800',
	rowWrapper: 'relative px-1 border-b border-gray-200 hover:bg-gray-100',

	defaultCellWrapper: 'p-2',
	defaultSvg: 'svg-base',
	valueIndicator: 'ml-1 text-gray-400 font-semibold',
};

export default BillingPage;
