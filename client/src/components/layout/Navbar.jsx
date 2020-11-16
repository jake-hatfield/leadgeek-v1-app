import React, { Fragment, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLeads } from '../../redux/actions/leads';
import { logout } from '../../redux/actions/auth';

const Navbar = ({
	auth: { isAuthenticated, loading },
	unviewed,
	getLeads,
	logout,
}) => {
	// get leads
	useEffect(() => {
		!loading && getLeads();
		return () => {};
	}, [loading, getLeads]);
	// utils
	const lengthChecker = (array) => {
		return array.length > 99 ? '99+' : array.length;
	};
	// nav links
	const primaryLinks = [
		{
			title: 'Dashboard',
			link: '/',
			path: (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
				/>
			),
		},
		{
			title: 'Leads',
			link: '/leads',
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
								<div className='absolute z-10 bottom-0 right-0 transform translate-y-40 shadow-md text-gray-600'>
									<div className='p-4 w-56 rounded-t-md bg-white'>
										<button
											onClick={() => logoutUser(logout)}
											className='p-2 w-full flex items-center justify-between rounded-md hover:bg-gray-100 text-left'
										>
											<span className='ml-2 font-medium'>Log out</span>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												className='h-6 w-6 text-gray-400'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
												/>
											</svg>
										</button>
									</div>
									<div className='p-4 bg-gray-100'>Bundle subscriber</div>
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
	logout: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	unviewed: state.leads.unviewed,
});

export default connect(mapStateToProps, { logout, getLeads })(Navbar);
