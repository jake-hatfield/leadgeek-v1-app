import React, { useState, useEffect, useRef, useCallback } from 'react';

// packages
import { NavLink } from 'react-router-dom';

// redux
import { useAppDispatch, useAppSelector } from '@utils/hooks';
import { removeUserData } from '@components/features/auth/authSlice';

// utils
import { useOutsideMouseup } from '@utils/utils';
interface NavbarLinkProps {
	link: {
		title: string;
		link: string;
		path: JSX.Element;
	};
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ link }) => {
	// local state
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
	// auth state
	const role = useAppSelector((state) => state.auth.user?.role);
	const name = useAppSelector((state) => state.auth.user?.name);
	// local state & local storage
	const [hover, setHover] = useState(false);
	const [notificationDropdown, setNotificationDropdown] = useState(false);
	const [notificationHover, setNotificationHover] = useState(false);
	const [userDropdown, setUserDropdown] = useState(false);
	const [firstInitial, setFirstInitial] = useState<string>('');

	// notifications modal handlers
	const notificationsModalRef = useRef(null);
	useOutsideMouseup(notificationsModalRef, setNotificationDropdown, null);

	// settings modal handlers
	const settingsModalRef = useRef(null);
	useOutsideMouseup(settingsModalRef, setUserDropdown, null);

	// close modals on esc key
	const keyPress = useCallback(
		(e) => {
			if (e.key === 'Escape') {
				setUserDropdown(false);
				setNotificationDropdown(false);
			}
		},
		[setUserDropdown]
	);
	useEffect(() => {
		document.addEventListener('keydown', keyPress);
		return () => document.removeEventListener('keydown', keyPress);
	}, [keyPress]);

	// set user initials
	useEffect(() => {
		if (name) {
			let userInitials = name.split(' ').map((n) => n[0]);
			setFirstInitial(userInitials[0]);
		}
	}, [name]);

	// clear user data on logout
	const logoutUser = () => {
		dispatch(removeUserData());
		setUserDropdown(false);
	};

	return (
		<nav className='fixed top-0 left-0 z-20 h-full min-h-screen w-16 py-6 px-3 flex flex-col justify-between bg-gray-900 dark:bg-darkGray-300 text-gray-400'>
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
				<nav className='mt-4 flex flex-col pt-4 border-t border-gray-700'>
					{navLinks.secondaryLinks.map((link, i) => (
						<div key={i} className='first:mt-0 mt-6'>
							<NavbarLink link={link} />
						</div>
					))}
				</nav>
				<aside className='relative mt-4 text-gray-400'>
					<button
						className='relative flex items-center justify-between mt-4 p-2 rounded-lg group text-gray-300 hover:text-gray-200 hover:bg-gray-800 hover:shadow-md transition-main ring-purple'
						onMouseEnter={() => setNotificationHover(true)}
						onMouseLeave={() => setNotificationHover(false)}
						onClick={() => {
							setNotificationHover(false);
							setUserDropdown(false);
							setNotificationDropdown(!notificationDropdown ? true : false);
						}}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='h-6 w-6'
						>
							<path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
						</svg>
						{notificationHover && (
							<div className='mt-2 p-2 absolute left-0 z-40 transform -translate-y-1 translate-x-14 rounded-lg bg-gray-900 shadow-md text-white text-sm whitespace-nowrap'>
								Notifications
							</div>
						)}
						{notifications.length > 0 && (
							<div className='absolute top-0 right-0 h-2 w-2 bg-pink-600 rounded-full transform translate-y-1 -translate-x-1 shadow-sm' />
						)}
					</button>
					{notificationDropdown && (
						<article
							ref={notificationsModalRef}
							className='absolute bottom-0 left-0 z-30 w-64 transform translate-x-16 pt-4 pb-2 rounded-lg bg-white shadow-lg border border-gray-300 text-gray-900 break-words'
						>
							<header className='pb-2 px-4 border-b border-gray-200 flex items-center justify-between'>
								<h4 className='font-bold text-lg'>Notifications</h4>
								<span className='py-1 px-2 bg-pink-600 border border-pink-500 text-white rounded-lg shadow-sm text-xs'>
									{notifications.length > 5 ? '5+' : notifications.length}
								</span>
							</header>
							<ul className='w-full text-sm text-gray-800'>
								{notifications.map((item, i) => (
									<li
										key={i}
										className='py-2 px-4 hover:bg-gray-100 transition-main focus:outline-none'
									>
										<div className='flex items-center justify-between'>
											<h5 className='font-semibold text-base mr-4'>
												v1.2 Release
											</h5>
											<a
												href='https://leadgeek.io/changelog/'
												target='_blank'
												rel='noopener noreferrer'
												className='text-purple-500 hover:text-purple-600 transition-main'
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
										<p className='pt-2 text-gray-700'>
											Big update! This was a complete overhaul of the interface
											with new features, aesthetic changes, and additional error
											handling.
										</p>
									</li>
								))}
							</ul>
						</article>
					)}
				</aside>
				<aside className='relative mt-4 text-gray-400 pt-4 border-t border-gray-700'>
					<button
						onClick={() => {
							setHover(false);
							setNotificationDropdown(false);
							setUserDropdown(!userDropdown ? true : false);
						}}
						onMouseEnter={() => setHover(!userDropdown && true)}
						onMouseLeave={() => setHover(false)}
						className='p-2 h-10 w-10 flex items-center justify-center rounded-full bg-purple-500 text-white shadow-sm hover:shadow-md transition duration-100 ease-in-out ring-purple'
					>
						<span className='text-lg font-bold'>{firstInitial}</span>
						{hover && (
							<div className='w-auto mt-2 p-2 absolute left-0 z-40 transform -translate-y-1 translate-x-14 rounded-lg bg-gray-900 shadow-md text-white text-sm text-left whitespace-nowrap'>
								{name}
							</div>
						)}
					</button>
					{userDropdown && (
						<div className='relative'>
							<article
								ref={settingsModalRef}
								className='absolute bottom-0 left-0 z-30 w-64 transform translate-x-16 pt-4 pb-2 rounded-lg bg-white shadow-lg border border-gray-300 text-gray-900'
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
											className='w-full py-2 px-4 flex items-center justify-between hover:bg-gray-100 group transition-colors duration-100 ease-in-out focus:outline-none'
										>
											<span className='font-semibold text-sm text-gray-800 '>
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
			link: 'settings/security/',
			path: null,
		},
	],
};

export default Navbar;
