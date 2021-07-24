import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setAlert } from 'redux/actions/alert';
import { cancelStripeSub } from 'redux/actions/auth';
import { getSuccessfulPayments } from 'redux/actions/users';

import { capitalize } from 'utils/utils';
import AuthLayout from 'components/layout/AuthLayout';
import Spinner from 'components/layout/utils/Spinner';
import SettingsLayout from 'components/layout/SettingsLayout';

const BillingPage = ({
	auth: { user, loading: authLoading, isAuthenticated },
	billing,
	cancelStripeSub,
	getSuccessfulPayments,
	setAlert,
}) => {
	useEffect(() => {
		getSuccessfulPayments();
	}, []);
	const [cancelModal, setCancelModal] = useState(false);

	const growPlanSeats = 30;
	const proPlanSeats = 15;
	const featureLists = [
		[
			{
				id: 1,
				body: (
					<span>
						Limited to{' '}
						<strong className='font-semibold'>{growPlanSeats}</strong> members
					</span>
				),
			},
			{
				id: 2,
				body: (
					<span>
						<strong className='font-semibold'>50+</strong> products per week
					</span>
				),
			},
			{
				id: 3,
				body: (
					<span>
						$<strong className='font-semibold'>4</strong>-30+ profit per unit
					</span>
				),
			},
			{
				id: 4,
				body: (
					<span>
						<strong className='font-semibold'>40</strong>%+ ROI per unit
					</span>
				),
			},
			{
				id: 6,
				body: 'Email support',
			},
			{
				id: 7,
				body: 'Free updates',
			},
		],
		[
			{
				id: 1,
				body: (
					<span>
						Limited to <strong className='font-semibold'>{proPlanSeats}</strong>{' '}
						members
					</span>
				),
			},
			{
				id: 2,
				body: (
					<span>
						<strong className='font-semibold'>50+</strong> products per week
					</span>
				),
			},
			{
				id: 3,
				body: (
					<span>
						$<strong className='font-semibold'>5</strong>-30+ profit per unit
					</span>
				),
			},
			{
				id: 4,
				body: (
					<span>
						<strong className='font-semibold'>50</strong>%+ ROI per unit
					</span>
				),
			},
			{
				id: 6,
				body: 'Premium support',
			},
			{
				id: 7,
				body: 'Free updates',
			},
		],
		[
			{
				id: 1,
				body: (
					<span>
						Limited to <strong className='font-semibold'>{proPlanSeats}</strong>{' '}
						members
					</span>
				),
			},
			{
				id: 2,
				body: (
					<span>
						<strong className='font-semibold'>100+</strong> products per week
					</span>
				),
			},
			{
				id: 3,
				body: 'All Grow Plan leads',
			},
			{
				id: 4,
				body: 'All Pro Plan leads',
			},
			{
				id: 6,
				body: 'Premium support',
			},
			{
				id: 7,
				body: 'Free updates',
			},
		],
	];
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

	const planChecker = (price) => {
		let plan;
		if (price === 12900) {
			plan = 'Grow';
		} else if (price === 18900) {
			plan = 'Pro';
		} else if (price === 26300) {
			plan = 'Bundle';
		} else {
			plan = 'Leadgeek';
		}
		return plan;
	};

	const pmBrand = capitalize(user.billing.brand);

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
							<div className='flex items-start justify-between'>
								<article className='w-1/2'>
									<header className='flex items-end justify-between pb-2 border-b border-gray-200'>
										<h2 className='font-bold text-lg text-gray-800'>Plan</h2>
									</header>
									<div className='mt-6'>
										{user.subscription.subIds
											.filter((s) => s.active === 'true')
											.map((s) => (
												<div key={s.id}>
													<div>{s.id}</div>
												</div>
											))}
									</div>
								</article>
								<article className='w-1/2 ml-16'>
									<header className='flex items-end justify-between pb-2 border-b border-gray-200'>
										<h2 className='font-bold text-lg text-gray-800'>
											Payment method
										</h2>
									</header>
									<div className='mt-6 flex items-end justify-between'>
										<div className='flex items-center'>
											<div className='text-sm'>
												<div>
													{pmBrand} &#8226;&#8226;&#8226;&#8226;{' '}
													{user.billing.last4}
												</div>
											</div>
										</div>
										<button className='font-semibold text-purple-600 hover:text-gray-700 ring-gray rounded-lg transition-main'>
											Change card
										</button>
									</div>
								</article>
							</div>
							<article className='mt-6'>
								<header className='flex items-end justify-between pb-2 border-b border-gray-200'>
									<h2 className='font-bold text-lg text-gray-800'>
										Payment history
									</h2>
								</header>
								<ul className='mt-6'>
									{billing.payments.map((p) => (
										<li key={p.id}>
											<div>{planChecker(p.amount)}</div>
											<div>
												{p.paymentMethod.brand} {p.paymentMethod.last4}
											</div>
										</li>
									))}
								</ul>
							</article>
						</div>
					)}
				</section>
			</SettingsLayout>
		</AuthLayout>
	);
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
	setAlert,
})(BillingPage);
