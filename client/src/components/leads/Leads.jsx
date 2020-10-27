import React from 'react';

import LeadTable from './LeadTable';

const Leads = () => {
	const primaryLinks = [
		{
			title: 'Feed',
			link: '/',
		},
		{
			title: 'Liked',
			link: '/leads',
		},
		{
			title: 'Compare',
			link: '/leads',
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
			title: 'Averages',
			link: '/leads',
			path: (
				<g>
					<path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' />
					<path
						fillRule='evenodd'
						d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z'
						clipRule='evenodd'
					/>
				</g>
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
		<section className='my-6 app-container'>
			<header>
				<p>
					<span className='font-bold'>16</span> new leads to view
				</p>
				<h1 className='text-4xl font-black text-gray-900'>Arbitrage Leads</h1>
			</header>
			<article>
				<div className='flex items-end justify-between'>
					<nav className='flex items-start'>
						{primaryLinks.map((link, i) => (
							<div
								v-for='item in items'
								className='first:pl-3 pl-12 leading-4'
								key={i}
							>
								<button className='rounded-md focus:outline-none hover:text-purple-600 transition-colors duration-100 ease-in-out'>
									<h3 className='text-xl font-medium'>{link.title}</h3>
								</button>
							</div>
						))}
					</nav>
					<div>
						<button className='py-2 lg:py-3 px-3 lg:px-5 block md:inline-block shadow-sm rounded-md bg-purple-100 text-purple-600 text-sm font-semibold hover:bg-purple-200 transition duration-100 focus:outline-none focus:shadow-outline'>
							Export to CSV
						</button>
					</div>
				</div>
				<hr className='mt-3 w-full border-b-2 border-gray-100' />
				<nav className='mt-6 flex items-end'>
					{tools.map((tool, i) => (
						<div v-for='item in items' className='first:pl-0 pl-6' key={i}>
							<button className='py-2 pl-3 pr-5 flex items-center rounded-md hover:bg-gray-100 transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline'>
								<span>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										fill='currentColor'
										className='h-6 w-6'
									>
										{tool.path}
									</svg>
								</span>
								<span className='ml-2 leading-3'>{tool.title}</span>
							</button>
						</div>
					))}
				</nav>
			</article>
			<LeadTable />
		</section>
	);
};

export default Leads;
