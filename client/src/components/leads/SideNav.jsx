import React from 'react';

import Tool from './Tools';

const SideNav = ({ feed, liked, setActiveLeadNav }) => {
	// utils
	const lengthChecker = (array) => {
		return array.length > 99 ? '99+' : array.length;
	};
	// primary links
	const primaryLinks = [
		{
			title: 'Feed',
			link: '/',
			notifications: lengthChecker(feed),
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
	const handleLeadNav = (link) => {
		setActiveLeadNav(link);
	};
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
		<div className='pr-8 w-1/5'>
			<header className='pb-8 border-b-2 border-gray-100'>
				<div className='flex items-center'>
					<span>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							className='h-5 w-5 text-gray-300'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
					</span>
					<p className='ml-1 text-sm text-gray-400'>
						Last updated Nov. 2 @ 7:58 am CST
					</p>
				</div>
				<div className='mt-1 flex items-center'>
					<h1 className='text-4xl font-black text-gray-900'>Leads</h1>
					<span className='ml-2 w-full border border-gray-100' />
				</div>
				<aside className='pt-4'>
					{primaryLinks.map((link, i) => (
						<div v-for='item in items' className='first:mt-2 mt-1' key={i}>
							<button
								className='p-2 w-full flex items-center justify-between rounded-md hover:bg-gray-100 transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline'
								onClick={() => handleLeadNav(link.title)}
							>
								<span className='flex items-center'>
									<span className='text-center text-gray-300'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 24 24'
											fill='currentColor'
											className='h-6 w-6'
										>
											{link.path}
										</svg>
									</span>
									<span className='ml-2'>{link.title}</span>
								</span>
								<span
									className={`px-2 ${
										link.title === 'Feed'
											? `bg-purple-600 text-white`
											: link.title === 'Liked'
											? `bg-teal-200 text-teal-600`
											: `bg-gray-100 text-gray-500`
									}  rounded-full text-xs font-semibold`}
								>
									{link.notifications
										? link.title === 'Feed'
											? `${link.notifications} new`
											: link.notifications
										: ''}
								</span>
							</button>
						</div>
					))}
				</aside>
			</header>
			<article>
				<nav className='mt-6 flex flex-col'>
					<h4 className='mb-4 text-gray-400 font-bold text-sm uppercase tracking-widest'>
						Tools
					</h4>
					{tools.map((tool, i) => (
						<Tool key={i} tool={tool} />
					))}
				</nav>
			</article>
		</div>
	);
};

export default SideNav;