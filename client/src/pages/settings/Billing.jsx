import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setAlert } from 'redux/actions/alert';
import { cancelStripeSub } from 'redux/actions/auth';

import AuthLayout from 'components/layout/AuthLayout';
import Spinner from 'components/layout/utils/Spinner';
import SettingsLayout from 'components/layout/SettingsLayout';

const Dashboard = ({
	auth: { user, loading, isAuthenticated },
	cancelStripeSub,
	setAlert,
}) => {
	const [activeSubscriptions, setActiveSubscriptions] = useState('');
	const [cancelModal, setCancelModal] = useState(false);
	// check for active sub & assign it to a displayable plan string
	// useEffect(() => {
	// 	if (!loading && isAuthenticated) {
	// 		if (user.subId.length === 0) {
	// 			return setActiveSubscriptions('No plans found!');
	// 		} else {
	// 			user.subId.forEach(function (sub) {
	// 				if (sub.status !== 'active') {
	// 					return setActiveSubscriptions('No active plans found!');
	// 				}
	// 				if (sub.plan.id === process.env.REACT_APP_BUNDLE_PRODUCT_ID) {
	// 					setActiveSubscriptions('Bundle');
	// 				} else if (sub.plan.id === process.env.REACT_APP_PRO_PRODUCT_ID) {
	// 					setActiveSubscriptions('Pro');
	// 				} else if (sub.plan.id === process.env.REACT_APP_GROW_PRODUCT_ID) {
	// 					setActiveSubscriptions('Grow');
	// 				} else return;
	// 			});
	// 		}
	// 	}
	// }, [loading, isAuthenticated, user]);

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

	return (
		<AuthLayout>
			<SettingsLayout
				title={'Billing & plans'}
				desc={'Manage your Leadgeek plan'}
				loading={loading}
				isAuthenticated={isAuthenticated}
				user={user}
			>
				<section className='my-6 container'>
					{loading ? (
						<Spinner />
					) : (
						<div className='mx-auto w-full max-w-3xl'>
							{/* <div className='mt-8 md:flex'>
							{user.subId.map(
								(sub) =>
									sub.status === 'active' && (
										<article className='ml-8 w-3/4 shadow-lg rounded-md'>
											<div className='pt-8 px-8'>
												{activeSubscriptions === 'No plans found!' ? (
													<h3 className='pb-8'>{activeSubscriptions}</h3>
												) : (
													<div>
														<h3 className='text-base font-medium text-gray-700'>
															Your current plan:{' '}
															<span className='text-purple-600'>
																{activeSubscriptions} plan
															</span>
														</h3>
														{
															<div className='my-6'>
																<h3 className='text-base font-medium text-gray-700'>
																	Plan details:
																</h3>
																{activeSubscriptions === 'Bundle' ? (
																	<ul className='mt-2'>
																		{featureLists[2].map((feature, i) => (
																			<li key={i}>{feature.body}</li>
																		))}
																	</ul>
																) : activeSubscriptions === 'Pro' ? (
																	<ul className='mt-2'>
																		{featureLists[1].map((feature, i) => (
																			<li key={i}>{feature.body}</li>
																		))}
																	</ul>
																) : (
																	activeSubscriptions === 'Grow' && (
																		<ul className='mt-2'>
																			{featureLists[0].map((feature, i) => (
																				<li key={i}>{feature.body}</li>
																			))}
																		</ul>
																	)
																)}
															</div>
														}
													</div>
												)}
											</div>
											<div className='pt-6 pb-8 px-8 md:flex md:justify-between md:items-end bg-gray-100 rounded-b-md'>
												<button
													className={`py-2 px-4 rounded-md text-white shadow-md bg-purple-600 hover:bg-purple-500 transition-colors duration-200 focus:outline-none focus:shadow-outline`}
												>
													Change plan
												</button>
												<button
													onClick={() => setCancelModal(!cancelModal)}
													className='ml-4 link rounded-md focus:outline-none focus:shadow-outline'
												>
													Cancel subscription
												</button>
											</div>
										</article>
									)
							)}
						</div>
						{cancelModal && (
							<div className='p-8 bg-white shadow-lg rounded-md'>
								<h3 className='text-2xl font-bold'>Cancel modal</h3>
								<div>
									<p>
										Are you sure you want to cancel your {activeSubscriptions}{' '}
										subscription?
									</p>
									<p>
										This action will stop any recurring payments at the end of
										your billing cycle.
									</p>
								</div>
								<button
									type='submit'
									onClick={handleCancelSubscription}
									className={`py-2 px-4 rounded-md text-red-600 shadow-md bg-red-300 hover:bg-red-400 transition-colors duration-200 focus:outline-none focus:shadow-outline`}
								>
									Confirm
								</button>
							</div>
						)} */}
						</div>
					)}
				</section>
			</SettingsLayout>
		</AuthLayout>
	);
};

Dashboard.propTypes = {
	auth: PropTypes.object.isRequired,
	cancelStripeSub: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, {
	cancelStripeSub,
	setAlert,
})(Dashboard);
