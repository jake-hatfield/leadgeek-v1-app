import React, { Fragment, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLeads } from '../../redux/actions/leads';
import { logout } from '../../redux/actions/auth';

const Navbar = ({
	auth: { isAuthenticated, loading },
	leads,
	getLeads,
	logout,
}) => {
	useEffect(() => {
		!loading && getLeads();
		return () => {};
	}, [loading, getLeads]);
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
			notifications: leads.length,
		},
	];

	return (
		<Fragment>
			{isAuthenticated && (
				<nav className='bg-gray-800 text-gray-400'>
					<div className='py-6 lg:py-3 container flex items-center justify-between'>
						<div className='flex items-center'>
							<h1 className='font-bold text-xl lg:text-2xl text-white'>
								LeadGeek
							</h1>
							<div className='ml-8 flex items-center'>
								{primaryLinks.map((link, i) => (
									<NavLink
										exact
										to={link.link}
										className='first:ml-0 ml-6 py-1 px-2 flex items-center font-medium rounded-md hover:bg-gray-900 transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline'
										activeClassName='active'
										key={i}
									>
										<div className='w-full flex items-center justify-between'>
											<span>{link.title}</span>
											{link.notifications && (
												<span className='ml-2 px-2 bg-purple-600 rounded-full text-white text-xs'>
													{link.notifications}
												</span>
											)}
										</div>
									</NavLink>
								))}
							</div>
						</div>
						<div className='flex items-center'>
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
							<button className='ml-6 rounded-full focus:outline-none focus:shadow-outline'>
								<img
									src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
									alt=''
									className='h-10 w-10 rounded-full'
								/>
							</button>
						</div>
						{/* <div className='bg-gray-700'>
							<div className='py-6 px-3 flex items-center text-gray-200'>
								<span className='py-2 px-4 bg-gray-600 rounded-md'>J</span>
								<div className='ml-2 w-full flex justify-between'>
									<div>
										<h1 className='font-medium text-lg'>LeadGeek</h1>
										<h4 className='text-sm'>
											<Link
												to='/profile'
												className='rounded-md focus:outline-none focus:shadow-outline hover:underline transition-all duration-100 ease-in-out'
											>
												Jake Hatfield
											</Link>
										</h4>
									</div>
									<button
										onClick={logout}
										className='mt-1 rounded-md focus:outline-none focus:shadow-outline'
									>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
											className='h-5 w-5 hover:text-gray-300 transition-colors duration-100 ease-in-out cursor-pointer'
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
							</div>
						</div> */}
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
	leads: state.leads.feed,
});

export default connect(mapStateToProps, { logout, getLeads })(Navbar);
