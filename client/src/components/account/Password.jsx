import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import ResetPassword from '../auth/login/reset/ResetPassword';

const Dashboard = ({ auth: { user, loading, isAuthenticated } }) => {
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
	const [initials, setInitials] = useState('');
	useEffect(() => {
		if (!loading && isAuthenticated) {
			let userInitials = user.name.split(' ').map((n) => n[0]);
			setInitials(userInitials);
		}
	}, [user, loading, isAuthenticated]);
	return (
		<Fragment>
			<section className='my-6 lg:my-10 relative container flex'>
				{loading ? (
					<Spinner />
				) : (
					<div className='mx-auto w-full max-w-3xl'>
						<h1 className='text-3xl font-black text-gray-900'>Account</h1>
						<div className='mt-6 md:flex md:items-center'>
							<div className='p-3 h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 shadow-sm focus:outline-none focus:shadow-outline'>
								<span className='text-gray-600 text-xl font-bold'>
									{initials}
								</span>
							</div>
							<div className='ml-8'>
								<div className='md:flex md:items-center text-lg font-semibold text-gray-600'>
									<h2 className='text-purple-600'>{user.name}</h2>
									<span className='mx-2 text-gray-200'>/</span>
									<h3>Update password</h3>
								</div>
								<p>Create a new, secure password for your LeadGeek account</p>
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
							<article className='ml-8  p-8 w-3/4 shadow-lg rounded-md'>
								<h3 className='text-base font-medium text-gray-700'>
									Reset Password
								</h3>
								<ResetPassword />
							</article>
						</div>
					</div>
				)}
			</section>
		</Fragment>
	);
};

Dashboard.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(Dashboard);
