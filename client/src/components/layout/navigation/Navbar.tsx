import React, { useState, useEffect, useRef, useCallback } from 'react';

// packages
import { NavLink, useLocation } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';

// components
import SearchBar from '@components/layout/navigation/SearchBar';
import { ReactComponent as LeadGeekLogo } from '@assets/images/svgs/logo-app.svg';

// redux
import { useAppDispatch } from '@hooks/hooks';
import { removeUserData } from '@components/features/auth/authSlice';
import {
	setLeadLoading,
	clearCurrentLead,
} from '@components/features/leads/leadsSlice';

// utils
import { Notification } from '@utils/interfaces/Notification';
import { useOutsideMouseup } from '@utils/utils';
import { useDarkMode } from '@hooks/hooks';

interface NavbarProps {
	name: string;
	notifications: Notification[];
}

const Navbar: React.FC<NavbarProps> = ({ name, notifications }) => {
	const dispatch = useAppDispatch();
	const location = useLocation();

	// local state
	const [notificationDropdown, setNotificationDropdown] = useState(false);
	const [userDropdown, setUserDropdown] = useState(false);
	const [firstInitial, setFirstInitial] = useState<string>('');

	// notifications modal handlers
	const notificationsModalRef = useRef(null);
	useOutsideMouseup(notificationsModalRef, setNotificationDropdown, null);

	// settings modal handlers
	const settingsModalRef = useRef(null);
	useOutsideMouseup(settingsModalRef, setUserDropdown, null);

	// hotkeys
	// close details on escape key
	useHotkeys(
		'Escape',
		() => {
			setUserDropdown(false);
			setNotificationDropdown(false);
		},
		{ keyup: true }
	);

	const setInitials = useCallback((name: string | undefined) => {
		if (!name) return;
		const userInitials = name.split(' ').map((n) => n[0]);
		setFirstInitial(userInitials[0]);
	}, []);

	// set user initials
	useEffect(() => {
		setInitials(name);
	}, [name, setInitials]);

	// clear user data on logout
	const logoutUser = () => {
		dispatch(removeUserData());
		setUserDropdown(false);
	};

	const [colorTheme] = useDarkMode();

	return (
		<header className='w-full cs-light-400 text-300 shadow-sm border-b border-300'>
			<nav className='container'>
				<div className='center-between py-1.5'>
					<NavLink
						to={'/leads/'}
						onClick={() => {
							location.pathname !== '/leads/' && dispatch(setLeadLoading());
							dispatch(clearCurrentLead());
						}}
					>
						<LeadGeekLogo
							className={`h-6 ${
								colorTheme === 'dark' ? 'text-purple-500' : 'text-purple-300'
							}`}
						/>
					</NavLink>
					<SearchBar placeholder='Enter a search...' />
					<aside className='flex items-center'>
						<div className='relative text-gray-400'>
							<button
								className='relative p-1 rounded-lg group text-gray-500 hover:text-gray-600 dark:text-gray-700 dark:hover:text-gray-300 transition-main ring-gray'
								onClick={() => {
									setUserDropdown(false);
									setNotificationDropdown(!notificationDropdown ? true : false);
								}}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-6 w-6'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
									/>
								</svg>
								{notifications.length > 0 && (
									<div className='absolute top-0 right-0 h-2.5 w-2.5 bg-pink-600 dark:bg-pink-100 rounded-full shadow-sm border-2 border-white dark:border-darkGray-400 transform translate-y-1 -translate-x-1' />
								)}
							</button>
							{notificationDropdown && (
								<article
									ref={notificationsModalRef}
									className='absolute top-0 right-0 z-30 w-64 pt-4 pb-2 cs-light-400 card-200 text-300 break-words transform translate-y-12'
								>
									<header className='center-between pb-2 px-4 border-b border-200'>
										<h4 className='font-bold text-lg'>Notifications</h4>
										<span className='py-1 px-2 cs-pink rounded-main text-xs font-semibold'>
											{notifications.length > 5 ? '5+' : notifications.length}
										</span>
									</header>
									<ul className='w-full text-sm text-200'>
										{notifications.map((item, i) => (
											<li
												key={i}
												className='py-2 px-4 hover:bg-gray-100 dark:hover:bg-darkGray-100 transition-main focus:outline-none border-b border-100 last:border-none'
											>
												<div className='center-between mb-1'>
													<header className='flex items-center'>
														<h5 className='mr-4 font-semibold text-base'>
															v1.2 Release
														</h5>
													</header>
													<a
														href='https://leadgeek.io/changelog/'
														target='_blank'
														rel='noopener noreferrer'
														className='link transition-main'
													>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='h-5 w-5'
															viewBox='0 0 20 20'
															fill='currentColor'
														>
															<path d='M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z' />
															<path d='M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z' />
														</svg>
													</a>
												</div>
												<time dateTime={'2021-09-22'}>Sep 22</time>
												<p className='pt-2 text-100'>
													Big update! This was a complete overhaul of the
													interface with new features, aesthetic changes, and
													additional error handling.
												</p>
											</li>
										))}
									</ul>
								</article>
							)}
						</div>
						<div className='relative ml-4 text-gray-400'>
							<button
								onClick={() => {
									setNotificationDropdown(false);
									setUserDropdown(userDropdown ? false : true);
								}}
								className='p-2 h-8 w-8 all-center cs-purple rounded-full shadow-sm transition-main ring-purple'
							>
								<span className='text-lg font-bold'>{firstInitial}</span>
							</button>
							{userDropdown && (
								<div className='relative'>
									<article
										ref={settingsModalRef}
										className='absolute top-0 right-0 z-30 w-64 pt-4 pb-2 rounded-main cs-light-400 card-200 text-300 transform translate-y-4'
									>
										<div className='relative'>
											<header className='pb-2 px-4 flex items-center justify-between border-b border-200'>
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
											<nav>
												{navLinks.dropdownItems.map((item, i) => (
													<NavLink
														key={i}
														to={`/${item.link}`}
														className='w-full py-2 px-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-darkGray-100 transition-main focus:outline-none'
													>
														<span className='font-semibold text-sm text-200'>
															{item.title}
														</span>
													</NavLink>
												))}
												<button
													key={'logout'}
													onClick={() => logoutUser()}
													className='w-full py-2 px-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-darkGray-100 group transition-colors-main focus:outline-none'
												>
													<span className='font-semibold text-sm text-200'>
														Logout
													</span>
												</button>
											</nav>
										</div>
									</article>
								</div>
							)}
						</div>
					</aside>
				</div>
			</nav>
		</header>
	);
};

const notifications = [
	{
		title:
			'hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello',
	},
	{
		title:
			'hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello',
	},
];

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
	secondaryLinks: [],
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
			link: 'settings/account/',
			path: null,
		},
	],
};

export default Navbar;
