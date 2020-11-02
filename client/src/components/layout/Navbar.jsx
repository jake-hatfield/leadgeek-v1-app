import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../redux/actions/auth';

const Navbar = ({ auth: { isAuthenticated }, leads, logout }) => {
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
						<div className='flex flex-row items-end'>
							{primaryLinks.map((link, i) => (
								<NavLink
									exact
									to={link.link}
									className='mt-1 py-1 px-2 flex items-center font-medium rounded-md hover:bg-gray-900 transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline'
									activeClassName='active'
									key={i}
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
										className='h-5 w-5'
									>
										{link.path}
									</svg>
									<aside className='w-full flex items-center justify-between'>
										<span className='ml-2'>{link.title}</span>
										<span className='px-2 bg-purple-600 rounded-full text-white text-xs'>
											{link.notifications}
										</span>
									</aside>
								</NavLink>
							))}
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
	leads: state.leads.leads,
});

export default connect(mapStateToProps, { logout })(Navbar);
