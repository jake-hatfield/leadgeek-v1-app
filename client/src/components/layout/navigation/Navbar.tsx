import React, { useState, useEffect, useRef, useCallback } from 'react';

// packages
import axios from 'axios';
import { DateTime } from 'luxon';
import { NavLink, useLocation } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';

// redux
import { useAppDispatch } from '@hooks/hooks';
import { removeUserData } from '@components/features/auth/authSlice';
import {
	setLeadLoading,
	clearCurrentLead,
} from '@components/features/leads/leadsSlice';

// components
import SearchBar from '@components/layout/navigation/SearchBar';
import Spinner from '@components/utils/Spinner';
import { ReactComponent as LeadGeekLogo } from '@assets/images/svgs/logo-app.svg';

// utils
import { config, useOutsideMouseup } from '@utils/utils';
import { useDarkMode } from '@hooks/hooks';
import { Notification } from '@utils/interfaces/Notification';

interface NavbarProps {
	name: string;
	notificationIds: { _id: string }[];
}

const Navbar: React.FC<NavbarProps> = ({ name, notificationIds }) => {
	const dispatch = useAppDispatch();
	const location = useLocation();

	// local state
	const [notificationDropdown, setNotificationDropdown] = useState(false);
	const [notifications, setNotifications] = useState<any>([]);
	const [userDropdown, setUserDropdown] = useState(false);
	const [firstInitial, setFirstInitial] = useState<string>('');
	const [status, setStatus] = useState<'loading' | 'idle'>('loading');

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

	const getNotificationData = useCallback(
		async (notificationIds: { _id: string }[]) => {
			const body = JSON.stringify({ ids: notificationIds });
			const res = await axios.post<{ notifications: Notification[] }>(
				'/api/users/notifications',
				body,
				config
			);
			setStatus('idle');
			return setNotifications(res.data.notifications);
		},
		[]
	);

	useEffect(() => {
		getNotificationData(notificationIds);
	}, [notificationIds, getNotificationData]);

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
								{notificationIds.length > 0 && (
									<div className='absolute top-0 right-0 h-2.5 w-2.5 bg-pink-600 dark:bg-pink-100 rounded-full  border-2 border-white dark:border-darkGray-400 transform translate-y-1 -translate-x-0.5' />
								)}
							</button>
							{notificationDropdown && (
								<article
									ref={notificationsModalRef}
									className='absolute top-0 right-0 z-30 w-80 pt-4 cs-light-400 card-200 text-300 break-words transform translate-y-12'
								>
									<header className='pb-2 px-4 border-b border-200'>
										<h4 className='font-bold text-lg'>Notifications</h4>
									</header>
									{status === 'loading' ? (
										<Spinner
											divWidth={null}
											center={false}
											spinnerWidth={'md'}
											margin={true}
											text={null}
										/>
									) : [notifications].length > 0 ? (
										<ul className='w-full text-sm text-200'>
											{notifications.map((item: any, i: number) => (
												<NotificationItem key={i} item={item} />
											))}
										</ul>
									) : (
										<div className='py-6 px-4 font-semibold text-sm text-gray-700 dark:text-gray-400'>
											You're all caught up!{' '}
											<span role='img' aria-label='Party emoji'>
												🎉
											</span>
										</div>
									)}
									<div className='flex justify-center border-t border-200'>
										<div className='pt-2 pb-3 px-4'>
											<button className='link text-sm rounded-main ring-purple'>
												Load older notifications
											</button>
										</div>
									</div>
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

interface NotificationItemProps {
	item: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ item }) => {
	// local state
	const [hover, setHover] = useState(false);
	return (
		<li
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			className='py-2 pl-4 pr-3 hover:bg-gray-100 dark:hover:bg-darkGray-100 transition-main focus:outline-none border-b border-100 last:border-none'
		>
			<div className='center-between mb-1'>
				<header className='flex items-center'>
					{!item.new && (
						<span className='h-1.5 w-1.5 mr-2 bg-pink-600 dark:bg-pink-100 rounded-full shadow-sm' />
					)}
					<h5 className='mr-4 font-semibold text-base'>{item.title}</h5>
				</header>
				{hover && (
					<button className='relative icon-button'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='svg-sm'
							viewBox='0 0 20 20'
							fill='currentColor'
						>
							<path
								fillRule='evenodd'
								d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
								clipRule='evenodd'
							/>
						</svg>
					</button>
				)}
			</div>
			<time dateTime={DateTime.fromISO(item.date).toFormat('yyyy-LL-d')}>
				{DateTime.fromISO(item.date).toFormat('LLL dd @ t')}
			</time>
			<p className='pt-2 text-100'>{item.description}</p>
			{item.externalLink && (
				<a
					href={item.externalLink}
					target='_blank'
					rel='noopener noreferrer'
					className='inline-block mt-2 link transition-main'
				>
					<span className='flex items-center'>
						<span>View</span>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='ml-2 svg-sm'
							viewBox='0 0 20 20'
							fill='currentColor'
						>
							<path d='M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z' />
							<path d='M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z' />
						</svg>
					</span>
				</a>
			)}
			{item.internalLink && (
				<NavLink
					to={item.internalLink}
					className='flex items-center mt-2 link transition-main'
				>
					View
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='ml-2 svg-sm'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path d='M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z' />
						<path d='M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z' />
					</svg>
				</NavLink>
			)}
		</li>
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
