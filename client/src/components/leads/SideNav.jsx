import React, { useState } from 'react';
import useStickyState from '../layout/localStorageHook';
import PrimaryLinks from './PrimaryLinks';

import Tool from './Tools';

const SideNav = ({ unviewed, liked, setActiveLeadNav }) => {
	// utils
	const lengthChecker = (array) => {
		return array.length > 99 ? '99+' : array.length;
	};
	// state & local storage
	const [showMenu, setShowMenu] = useStickyState('showMenu', 'full-menu');
	const [hover, setHover] = useState(false);
	// primary links
	const primaryLinks = [
		{
			title: 'Feed',
			link: '/',
			notifications: lengthChecker(unviewed),
			path: (
				<path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
			),
		},
		{
			title: 'Liked',
			link: '/leads',
			notifications: lengthChecker(liked),
			path: (
				<path
					fillRule='evenodd'
					d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
					clipRule='evenodd'
				/>
			),
		},
		{
			title: 'Archived',
			link: '/leads',
			path: <path d='M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z' />,
		},
		{
			title: 'Compare',
			link: '/leads',
			path: (
				<path
					fillRule='evenodd'
					d='M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z'
					clipRule='evenodd'
				/>
			),
		},
	];
	const tools = [
		{
			title: 'Filters',
			link: '/',
			path: (
				<path
					fillRule='evenodd'
					d='M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z'
					clipRule='evenodd'
				/>
			),
		},
		{
			title: 'Inventory',
			link: '/leads',
			path: (
				<path
					fillRule='evenodd'
					d='M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z'
					clipRule='evenodd'
				/>
			),
		},
	];
	return (
		<div
			className={`${
				showMenu ? 'mr-8 md:w-72' : 'mr-4 xl:mr-8 h-screen md:w-10 bg-white'
			} `}
		>
			<header
				className={`${showMenu ? 'pb-8' : 'pb-4'} border-b-2 border-gray-100`}
			>
				{showMenu && (
					<div className='xl:flex xl:items-center'>
						<div>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								className='hidden xl:inline-block h-5 w-5 text-gray-300'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
						</div>

						<p className='ml-2 text-sm text-gray-400'>
							Updated Nov. 2 @ 7:58 am
						</p>
					</div>
				)}
				{showMenu && (
					<div className='mt-1 flex items-center'>
						<h1 className='text-4xl font-black text-gray-900'>Leads</h1>
						<span className='ml-2 w-full border border-gray-100' />
					</div>
				)}
				<aside className={`${showMenu && 'pt-4'}`}>
					{showMenu && (
						<h4 className='mb-4 text-gray-400 font-semibold text-sm uppercase tracking-widest'>
							Views
						</h4>
					)}
					{primaryLinks.map((link, i) => (
						<div key={i}>
							<PrimaryLinks
								link={link}
								setActiveLeadNav={setActiveLeadNav}
								showMenu={showMenu}
							/>
						</div>
					))}
				</aside>
			</header>
			<article
				className={`${showMenu ? 'pb-8' : 'pb-4'} border-b-2 border-gray-100`}
			>
				<nav className={`${showMenu ? 'mt-6' : 'mt-4'} flex flex-col`}>
					{showMenu && (
						<h4 className='mb-4 text-gray-400 font-semibold text-sm uppercase tracking-widest'>
							Tools
						</h4>
					)}
					{tools.map((tool, i) => (
						<div key={i}>
							<Tool tool={tool} showMenu={showMenu} setShowMenu={setShowMenu} />
						</div>
					))}
				</nav>
			</article>
			<aside className='mt-4 text-gray-300'>
				<button
					onClick={() => setShowMenu(!showMenu)}
					onMouseEnter={() => setHover(!hover)}
					onMouseLeave={() => setHover(false)}
					className={`p-2 ${
						showMenu && 'w-full flex'
					} relative rounded-md hover:bg-gray-100 hover:shadow-inner focus:outline-none focus:shadow-outline`}
				>
					{!showMenu && hover && (
						<div className='p-2 absolute left-0 transform -translate-y-2 translate-x-12 rounded-md  bg-gray-800 shadow-md text-white text-sm whitespace-no-wrap'>
							Show menu
						</div>
					)}
					{showMenu ? (
						<span className='flex items-center'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='h-5 w-5'
							>
								<path
									fillRule='evenodd'
									d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
									clipRule='evenodd'
								/>
								<path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
							</svg>
							<span className='ml-2 text-gray-500'>Hide menu</span>
						</span>
					) : (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='h-5 w-5'
						>
							<path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
							<path
								fillRule='evenodd'
								d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
								clipRule='evenodd'
							/>
						</svg>
					)}
				</button>
			</aside>
		</div>
	);
};

export default SideNav;
