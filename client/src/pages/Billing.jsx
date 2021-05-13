import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from 'redux/actions/alert';
import { cancelStripeSub } from 'redux/actions/auth';

import AuthLayout from 'components/layout/AuthLayout';
import Spinner from 'components/layout/utils/Spinner';

const Dashboard = ({
	auth: { user, loading, isAuthenticated },
	cancelStripeSub,
	setAlert,
}) => {
	const [initials, setInitials] = useState('');
	const [activeSubscriptions, setActiveSubscriptions] = useState('');
	const [cancelModal, setCancelModal] = useState(false);
	// check for active sub & assign it to a displayable plan string
	useEffect(() => {
		if (!loading && isAuthenticated) {
			if (user.subId.length === 0) {
				return setActiveSubscriptions('No plans found!');
			} else {
				user.subId.forEach(function (sub) {
					if (sub.status !== 'active') {
						return setActiveSubscriptions('No active plans found!');
					}
					if (sub.plan.id === process.env.REACT_APP_BUNDLE_PRODUCT_ID) {
						setActiveSubscriptions('Bundle');
					} else if (sub.plan.id === process.env.REACT_APP_PRO_PRODUCT_ID) {
						setActiveSubscriptions('Pro');
					} else if (sub.plan.id === process.env.REACT_APP_GROW_PRODUCT_ID) {
						setActiveSubscriptions('Grow');
					} else return;
				});
			}
		}
	}, [loading, isAuthenticated, user]);

	const accountLinks = [
		{
			title: 'Profile',
			link: '/account/profile',
			path: (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
				/>
			),
		},
		{
			title: 'Password',
			link: '/account/password',
			path: (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
				/>
			),
		},
		{
			title: 'Plans & Billing',
			link: '/account/billing',
			path: (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
				/>
			),
		},
	];
	useEffect(() => {
		if (!loading && isAuthenticated) {
			let userInitials = user.name.split(' ').map((n) => n[0]);
			setInitials(userInitials);
		}
	}, [loading, isAuthenticated, user]);
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
			<section className='my-6 lg:my-10 relative container flex'>
				{loading ? (
					<Spinner />
				) : (
					<div className='mx-auto w-full max-w-3xl'>
						<h1 className='text-3xl font-black text-gray-900'>Account</h1>
						<div className='mt-6 md:flex md:items-center'>
							<div className='ml-8'>
								<div className='md:flex md:items-center text-lg font-semibold text-gray-600'>
									<h2 className='text-purple-600'>{user.name}</h2>
									<span className='mx-2 text-gray-200'>/</span>
									<h3>Change billing information</h3>
								</div>
								<p>
									Update the billing or subscription information associated with
									your account
								</p>
							</div>
						</div>
						<div className='mt-8 md:flex'>
							<nav className='w-1/4'>
								{accountLinks.map((link, i) => (
									<NavLink
										to={link.link}
										className='mt-2 py-2 px-4 flex items-center font-medium rounded-md hover:bg-gray-100 hover:text-gray-400 transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline'
										activeClassName='account-nav-active'
										key={i}
									>
										{link.title}
									</NavLink>
								))}
							</nav>
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
						)}
					</div>
				)}
			</section>
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
