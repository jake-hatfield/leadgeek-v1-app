import React, { Fragment, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLeads } from '../../redux/actions/leads';
import { logout } from '../../redux/actions/auth';
import AltDropdown from './AltDropdown';

const Navbar = ({
	auth: { isAuthenticated, loading, user },
	unviewed,
	getLeads,
	logout,
}) => {
	// get leads
	useEffect(() => {
		!loading && isAuthenticated && getLeads();
	}, [loading, isAuthenticated, getLeads]);
	// utils
	const lengthChecker = (array) => {
		return array.length > 99 ? '99+' : array.length;
	};
	// nav links
	const primaryLinks = [
		{
			title: 'Leads',
			link: '/',
			path: (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
				/>
			),
			notifications: lengthChecker(unviewed),
		},
	];
	// toggle user dropdown
	const [userDropdown, setUserDropdown] = useState(false);
	// assign stripe plan IDs to displayable text
	const [activeSubscription, setActiveSubscription] = useState('');
	useEffect(() => {
		if (!loading && isAuthenticated) {
			user.subId.forEach(function (sub) {
				if (sub === process.env.REACT_APP_BUNDLE_PRODUCT_ID) {
					setActiveSubscription('Bundle');
				} else if (sub === process.env.REACT_APP_PRO_PRODUCT_ID) {
					setActiveSubscription('Pro');
				} else if (sub === process.env.REACT_APP_GROW_PRODUCT_ID) {
					setActiveSubscription('Grow');
				} else return;
			});
		}
	}, [user]);
	const moreItems = [
		{
			linkID: 100,

			path: (
				<svg
					className='p-2 h-10 w-10 flex-shrink-0 rounded-md bg-purple-100 text-purple-600'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
					/>
				</svg>
			),
			title: 'Account',
			description: 'Edit account settings and other information',
			link: 'account',
		},
	];
	const logoutUser = (logout) => {
		logout();
		setUserDropdown(false);
	};
	return (
		<Fragment>
			{isAuthenticated && (
				<nav className='w-full bg-gray-800 text-gray-400'>
					<div className='py-3 container flex items-center justify-between'>
						<div className='flex items-center'>
							<h2 className='font-bold text-xl lg:text-2xl text-white'>
								LeadGeek
							</h2>
							<div className='ml-8 flex items-center'>
								{primaryLinks.map((link, i) => (
									<NavLink
										exact
										to={link.link}
										className='first:ml-0 ml-6 py-2 px-4 flex items-center font-medium rounded-md hover:bg-gray-900 hover:text-white transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline'
										activeClassName='active'
										key={i}
									>
										<div className='w-full flex items-center justify-between'>
											<span>{link.title}</span>
											{link.notifications !== 0 &&
												link.notifications !== undefined && (
													<span className='ml-2 px-2 bg-purple-600 rounded-full text-white font-semibold text-xs'>
														{link.notifications}
													</span>
												)}
										</div>
									</NavLink>
								))}
							</div>
						</div>
						<div className='relative flex items-center'>
							<button className='rounded-md focus:outline-none focus:shadow-outline'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
									className='h-6 w-6'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
									/>
								</svg>
							</button>
							<div className='ml-6'>
								<button
									onClick={() => setUserDropdown(!userDropdown)}
									className='rounded-full focus:outline-none focus:shadow-outline'
								>
									<img
										src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
										alt=''
										className='h-10 w-10 rounded-full'
									/>
								</button>
							</div>
							{userDropdown && (
								<div className='absolute z-10 bottom-0 right-0 transform text-gray-600'>
									<div>
										<AltDropdown
											items={moreItems}
											open={userDropdown}
											setOpen={setUserDropdown}
											logout={logout}
											logoutUser={logoutUser}
											loading={loading}
											activeSubscription={activeSubscription}
											// animation={mobileAnimation}
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				</nav>
			)}
		</Fragment>
	);
};

Navbar.propTypes = {
	auth: PropTypes.object.isRequired,
	logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	unviewed: state.leads.unviewed,
});

export default connect(mapStateToProps, { logout, getLeads })(Navbar);
