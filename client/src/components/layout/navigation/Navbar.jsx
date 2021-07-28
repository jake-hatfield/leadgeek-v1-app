import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from 'redux/actions/auth';

import AltDropdown from './AltDropdown';
import { ReactComponent as LeadGeekLogo } from 'assets/images/svgs/leadgeek-logo-light.svg';

const NavbarLink = ({ link, showMenu }) => {
	const [hover, setHover] = useState(false);
	return (
		<div v-for='item in items'>
			<NavLink
				className='p-2 relative flex items-center justify-between rounded-lg group text-gray-300 hover:text-gray-200 hover:bg-gray-800 hover:shadow-md transition duration-100 ease-in-out ring-purple'
				onMouseEnter={() => setHover(!hover)}
				onMouseLeave={() => setHover(false)}
				to={link.link}
			>
				<span>{link.svg}</span>
				{hover && (
					<div className='mt-2 p-2 absolute left-0 z-40 transform -translate-y-1 translate-x-14 rounded-lg bg-gray-900 shadow-md text-white text-sm whitespace-nowrap'>
						{link.title}
					</div>
				)}
				{showMenu && (
					<span
						className={`px-2 ${
							link.title === 'Feed'
								? `bg-purple-600 text-white`
								: link.title === 'Liked'
								? `bg-teal-200 text-teal-600`
								: `bg-gray-100 text-gray-600`
						}  rounded-full text-xs font-semibold`}
					>
						{link.notifications
							? link.title === 'Feed'
								? `${link.notifications} new`
								: link.notifications
							: ''}
					</span>
				)}
			</NavLink>
		</div>
	);
};

NavbarLink.propTypes = {
	link: PropTypes.object.isRequired,
	showMenu: PropTypes.bool,
};

const Navbar = ({ _id, role, name, loading, logout }) => {
	// state & local storage
	const [hover, setHover] = useState(false);
	const [userDropdown, setUserDropdown] = useState(false);
	const [activeSubscription] = useState('');
	// primary links
	const svgClass = 'h-6 w-6';
	const primaryLinks = [
		// {
		// 	title: 'Dashboard',
		// 	link: '/',
		// 	// notifications: lengthChecker(unviewedLeads),
		// 	svg: (
		// 		<svg
		// 			xmlns='http://www.w3.org/2000/svg'
		// 			viewBox='0 0 20 20'
		// 			fill='currentColor'
		// 			className={svgClass}
		// 		>
		// 			<path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
		// 		</svg>
		// 	),
		// },
		{
			title: 'Leads',
			link: '/leads',
			// notifications: lengthChecker(likedLeads),
			svg: (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					className={svgClass}
				>
					<path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
				</svg>
			),
		},
	];
	const secondaryLinks = [
		// {
		// 	title: 'Notifications',
		// 	link: '/#',
		// 	svg: (
		// 		<svg
		// 			xmlns='http://www.w3.org/2000/svg'
		// 			viewBox='0 0 20 20'
		// 			fill='currentColor'
		// 			className={svgClass}
		// 		>
		// 			<path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
		// 		</svg>
		// 	),
		// },
		{
			title: 'Help',
			link: '/help',
			svg: (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					className={svgClass}
				>
					<path
						fillRule='evenodd'
						d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
						clipRule='evenodd'
					/>
				</svg>
			),
		},
	];
	const adminLinks = [
		{
			title: 'Admin',
			link: '/admin/',
			svg: (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					className={svgClass}
				>
					<path
						fillRule='evenodd'
						d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
						clipRule='evenodd'
					/>
				</svg>
			),
		},
	];
	const dropdownItems = [
		{
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
			title: 'Settings',
			description: 'Edit account settings and other information',
			link: 'settings/profile/',
		},
	];
	const logoutUser = (logout) => {
		logout(_id);
		setUserDropdown(false);
	};
	return (
		<nav className='fixed top-0 left-0 z-20 h-full min-h-screen w-16 py-6 px-3 flex flex-col justify-between bg-gray-900 text-gray-400'>
			<aside>
				{primaryLinks.map((link, i) => (
					<div key={i} className='first:mt-0 mt-6'>
						<NavbarLink link={link} />
					</div>
				))}
			</aside>
			<article>
				{role === 'admin' ||
					(role === 'master' && (
						<nav className='mt-4 flex flex-col'>
							{adminLinks.map((link, i) => (
								<div key={i} className='first:mt-0 mt-6'>
									<NavbarLink link={link} />
								</div>
							))}
						</nav>
					))}
				<nav className='mt-4 flex flex-col'>
					{secondaryLinks.map((link, i) => (
						<div key={i} className='first:mt-0 mt-6'>
							<NavbarLink link={link} />
						</div>
					))}
				</nav>
				<aside className='relative mt-16 text-gray-400'>
					<button
						onClick={() => {
							setHover(false);
							setUserDropdown(!userDropdown ? true : false);
						}}
						onMouseEnter={() => setHover(!userDropdown && true)}
						onMouseLeave={() => setHover(false)}
						className='p-2 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 shadow-sm hover:shadow-md transition duration-100 ease-in-out ring-purple'
					>
						<span className='h-6 w-6 text-xl font-bold'>
							<LeadGeekLogo />
						</span>
						{hover && (
							<div className='w-auto mt-2 p-2 absolute left-0 z-40 transform -translate-y-1 translate-x-14 rounded-lg bg-gray-900 shadow-md text-white text-sm text-left whitespace-nowrap'>
								{name}
							</div>
						)}
					</button>
					{userDropdown && (
						<div className='relative'>
							<AltDropdown
								items={dropdownItems}
								open={userDropdown}
								setOpen={setUserDropdown}
								logout={logout}
								logoutUser={logoutUser}
								name={name}
								loading={loading}
								activeSubscription={activeSubscription}
							/>
						</div>
					)}
				</aside>
			</article>
		</nav>
	);
};

Navbar.propTypes = {
	_id: PropTypes.string.isRequired,
	role: PropTypes.string.isRequired,
	loading: PropTypes.bool.isRequired,
};

export default connect(null, { logout })(Navbar);
