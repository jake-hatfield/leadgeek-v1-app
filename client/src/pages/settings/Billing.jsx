import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import { setAlert } from 'redux/actions/alert';
import { cancelStripeSub } from 'redux/actions/auth';
import {
	getSuccessfulPayments,
	getActivePlanDetails,
} from 'redux/actions/users';

import {
	capitalize,
	truncate,
	planCheckerByPrice,
	formatTimestamp,
} from 'utils/utils';
import AuthLayout from 'components/layout/AuthLayout';
import Spinner from 'components/layout/utils/Spinner';
import SettingsLayout from 'components/layout/SettingsLayout';

const BillingPage = ({
	auth: { user, loading: authLoading, isAuthenticated },
	billing: { plan, paymentHistory },
	cancelStripeSub,
	getSuccessfulPayments,
	getActivePlanDetails,
	setAlert,
}) => {
	useEffect(() => {
		isAuthenticated && getSuccessfulPayments(user.subscription.cusId);
	}, [isAuthenticated]);

	useEffect(() => {
		isAuthenticated &&
			!plan.id &&
			getActivePlanDetails(user.subscription.subIds);
	}, [isAuthenticated, user]);

	const handleCancelSubscription = () => {
		const { customerId } = user;
		if (!customerId) {
			return setAlert(
				"Your account couldn't be verified to cancel your subscription. Please contact support@leadgeek.io to cancel.",
				'danger'
			);
		}
		// cancels subscription in stripe and updates to 'canceled' status in db
		cancelStripeSub(customerId, 'sub_IvxscYyUQVlmT7');
	};

	const paymentMethodBrand = isAuthenticated && capitalize(user.billing.brand);

	return (
		<AuthLayout>
			<SettingsLayout
				title={'Billing & plans'}
				desc={'Manage your Leadgeek plan'}
				loading={authLoading}
				isAuthenticated={isAuthenticated}
				user={user}
			>
				<section className='my-6'>
					{authLoading ? (
						<Spinner />
					) : (
						<div className='w-full pr-16 text-gray-800'>
							<section>
								<header className='flex items-end justify-between pb-2 border-b border-gray-200'>
									<h2 className='font-bold text-lg text-gray-800'>
										Subscription information
									</h2>
								</header>
								{plan.loading ? (
									<Spinner />
								) : plan.id ? (
									<div className='mt-6 grid grid-flow-col grid-rows-3 grid-cols-2 gap-y-1 gap-x-8'>
										<div className='flex items-center justify-between'>
											<div>Member since</div>
											<div>
												{isAuthenticated &&
													DateTime.fromISO(user.dateCreated).toFormat(
														'LLL dd, yyyy'
													)}
											</div>
										</div>
										<div className='flex items-center justify-between'>
											<div>Current subscription active since</div>
											<div>
												{isAuthenticated && formatTimestamp(plan.created, true)}
											</div>
										</div>
										<div className='flex items-center justify-between'>
											<div>Current subscription</div>
											<div className='font-bold'>
												{planCheckerByPrice(plan.plan.amount)} plan
											</div>
										</div>
										<div className='flex items-center justify-between'>
											<div>
												Estimate for{' '}
												<span className='font-bold'>
													{isAuthenticated &&
														!plan.cancelAtPeriodEnd &&
														formatTimestamp(plan.currentPeriodEnd)}
												</span>
											</div>
											<div className='font-bold'>${plan.plan.amount / 100}</div>
										</div>
										{/* <div className='flex items-center justify-between'>
											<div>Default payment method</div>
											<div>
												<button className='ml-2 font-semibold text-purple-600 hover:text-gray-700 ring-gray rounded-lg transition-main'>
													{paymentMethodBrand} &#8226;&#8226;&#8226;&#8226;{' '}
													{user.billing.last4}
												</button>
											</div>
										</div> */}
										<div className='flex items-center justify-between'>
											<div>Change subscription preferences</div>
											<div>
												<button className='ml-2 font-semibold text-purple-600 hover:text-gray-700 ring-gray rounded-lg transition-main'>
													Update plan
												</button>
											</div>
										</div>
									</div>
								) : (
									<div>There are no active plans</div>
								)}
							</section>
							<article className='mt-6'>
								<header className='flex items-end justify-between pb-2 border-b border-gray-200'>
									<h2 className='font-bold text-lg text-gray-800'>
										Payment history
									</h2>
								</header>
								{paymentHistory.loading ? (
									<Spinner />
								) : paymentHistory.payments.length > 0 ? (
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
													{paymentHistory.payments.map((payment, i) => (
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
													))}
												</tbody>
											</table>
										</div>
									</div>
								) : (
									<div>
										There are no payments that have been recorded for your
										account.
									</div>
								)}
							</article>
						</div>
					)}
				</section>
			</SettingsLayout>
		</AuthLayout>
	);
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

BillingPage.propTypes = {
	auth: PropTypes.object.isRequired,
	cancelStripeSub: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	billing: state.users.userSettings.billing,
});

export default connect(mapStateToProps, {
	cancelStripeSub,
	getSuccessfulPayments,
	getActivePlanDetails,
	setAlert,
})(BillingPage);
