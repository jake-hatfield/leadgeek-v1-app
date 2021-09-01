import React, { useState, useEffect, useRef, useCallback } from 'react';

import { NavLink } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@utils/hooks';
import { removeUserData } from '@components/features/auth/authSlice';

import { useOutsideMouseup } from '@utils/utils';
import { ReactComponent as LeadGeekLogo } from '@assets/images/svgs/leadgeek-logo-light.svg';

interface NavbarLinkProps {
	link: {
		title: string;
		link: string;
		path: JSX.Element;
	};
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ link }) => {
	const [hover, setHover] = useState(false);

	return (
		<div v-for='item in items'>
			<NavLink
				className='p-2 relative flex items-center justify-between rounded-lg group text-gray-300 hover:text-gray-200 hover:bg-gray-800 hover:shadow-md transition duration-100 ease-in-out ring-purple'
				onMouseEnter={() => setHover(!hover)}
				onMouseLeave={() => setHover(false)}
				to={link.link}
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					className='h-6 w-6'
				>
					{link.path}
				</svg>
				{hover && (
					<div className='mt-2 p-2 absolute left-0 z-40 transform -translate-y-1 translate-x-14 rounded-lg bg-gray-900 shadow-md text-white text-sm whitespace-nowrap'>
						{link.title}
					</div>
				)}
			</NavLink>
		</div>
	);
};

const Navbar = () => {
	const dispatch = useAppDispatch();
	const role = useAppSelector((state) => state.auth.user?.role);
	const name = useAppSelector((state) => state.auth.user?.name);
	// state & local storage
	const [hover, setHover] = useState(false);
	const [userDropdown, setUserDropdown] = useState(false);

	const wrapperRef = useRef(null);

	useOutsideMouseup(wrapperRef, setUserDropdown, null);

	// close modal on esc key
	const keyPress = useCallback(
		(e) => {
			if (e.key === 'Escape') {
				setUserDropdown(false);
			}
		},
		[setUserDropdown]
	);
	useEffect(() => {
		document.addEventListener('keydown', keyPress);
		return () => document.removeEventListener('keydown', keyPress);
	}, [keyPress]);

	const logoutUser = () => {
		dispatch(removeUserData());
		setUserDropdown(false);
	};

	return (
		<nav className='fixed top-0 left-0 z-20 h-full min-h-screen w-16 py-6 px-3 flex flex-col justify-between bg-gray-900 text-gray-400'>
			<aside>
				{navLinks.primaryLinks.map((link, i) => (
					<div key={i} className='first:mt-0 mt-6'>
						<NavbarLink link={link} />
					</div>
				))}
			</aside>
			<article>
				{role === 'admin' ||
					(role === 'master' && (
						<nav className='mt-4 flex flex-col'>
							{navLinks.adminLinks.map((link, i) => (
								<div key={i} className='first:mt-0 mt-6'>
									<NavbarLink link={link} />
								</div>
							))}
						</nav>
					))}
				<nav className='mt-4 flex flex-col'>
					{navLinks.secondaryLinks.map((link, i) => (
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
							<article
								ref={wrapperRef}
								className='absolute bottom-0 left-0 z-30 w-64 transform translate-x-16 pt-4 pb-2 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-900'
							>
								<div className='relative'>
									<header className='pb-2 px-4 flex items-center justify-between border-b border-gray-200'>
										<div>
											<h5 className='inline-block font-bold text-lg'>
												<span
													role='img'
													aria-label='Waving emoji'
													className='mr-1'
												>
													👋
												</span>
												Hi, {name?.split(' ')[0] || 'Account'}
											</h5>
										</div>
									</header>
									<div>
										{navLinks.dropdownItems.map((item, i) => (
											<NavLink
												key={i}
												to={`/${item.link}`}
												className='w-full py-2 px-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-100 ease-in-out focus:outline-none'
											>
												<span className='font-semibold text-sm text-gray-800'>
													{item.title}
												</span>
											</NavLink>
										))}
										<button
											key={'logout'}
											onClick={() => logoutUser()}
											className='w-full py-2 px-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-100 ease-in-out focus:outline-none'
										>
											<span className='font-semibold text-sm text-gray-800'>
												Logout
											</span>
										</button>
									</div>
								</div>
							</article>
						</div>
					)}
				</aside>
			</article>
		</nav>
	);
};

// primary links
const navLinks = {
	primaryLinks: [
		{
			title: 'Leads',
			link: '/leads',
			path: (
				<path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
			),
		},
	],
	secondaryLinks: [
		{
			title: 'Help',
			link: '/help',
			path: (
				<path
					fillRule='evenodd'
					d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
					clipRule='evenodd'
				/>
			),
		},
	],
	adminLinks: [
		{
			title: 'Admin',
			link: '/admin/',
			path: (
				<path
					fillRule='evenodd'
					d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
					clipRule='evenodd'
				/>
			),
		},
	],
	dropdownItems: [
		{
			title: 'Settings',
			link: 'settings/profile/',
			path: null,
		},
	],
};

export default Navbar;
