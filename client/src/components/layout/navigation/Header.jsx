import React, { useState } from 'react';

import { connect } from 'react-redux';
import { getSearchResults } from '../../../redux/actions/leads';
import { useLocation } from 'react-router-dom';

import { DateTime } from 'luxon';
import { CSVLink } from 'react-csv';

import Button from '../formField/Button';
import { Redirect } from 'react-router';

const Header = ({ title, user, leads, getSearchResults }) => {
	// search helpers
	const [search, setSearch] = useState('');
	const [redirect, setRedirect] = useState(false);
	const onSearchChange = (e) => {
		setSearch(e.target.value);
	};

	const location = useLocation();
	const handleSearchSubmit = async (e) => {
		e.preventDefault();
		if (location.pathname !== '/search') {
			setRedirect(true);
		}
		getSearchResults(search);
	};

	const currentLocalDate = DateTime.now().setLocale('el').toLocaleString();

	const tools = [
		{
			text: 'Filters',
			path: (
				<path
					fillRule='evenodd'
					d='M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z'
					clipRule='evenodd'
				/>
			),
		},
		{
			text: 'Inventory',
			path: (
				<path
					fillRule='evenodd'
					d='M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z'
					clipRule='evenodd'
				/>
			),
		},
	];

	if (redirect) {
		return <Redirect to={{ pathname: '/search', search: `?q=${search}` }} />;
	}

	return (
		<header className='border-b border-gray-200'>
			<div className='flex justify-between pb-2 container'>
				<div className='flex items-center'>
					<h1 className='text-3xl text-gray-900 font-bold'>
						{title || 'Leads'}
					</h1>
				</div>
				<div className='ml-32 w-full flex items-center justify-end text-gray-300'>
					<div className='w-48 relative z-0 text-gray-400'>
						<form
							action='/search'
							method='GET'
							onSubmit={(e) => handleSearchSubmit(e)}
						>
							<input
								type='text'
								name='q'
								placeholder='Search...'
								onChange={onSearchChange}
								className='py-2 pl-10 w-full rounded-lg text-sm text-gray-500 placeholder-gray-400 transition-all duration-100 ease-in-out focus:outline-none hover:shadow-outline focus:shadow-outline'
							/>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='mt-2 ml-3 absolute top-0 left-0 h-4 w-4'
							>
								<path
									fillRule='evenodd'
									d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
									clipRule='evenodd'
								/>
							</svg>
						</form>
					</div>
					{tools.map((tool, i) => (
						<Button key={i} text={tool.text} path={tool.path} />
					))}
					<CSVLink
						data={leads}
						filename={`${user.role || 'leadgeek'}_plan_${currentLocalDate}.csv`}
						target='_blank'
						className='ml-4 py-2 px-3 flex items-center rounded-lg shadow-sm hover:shadow-md text-sm font-semibold hover:text-gray-500 transition-all duration-100 ease-in-out focus:outline-none focus:shadow-outline'
					>
						<span>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='h-4 w-4'
							>
								<path
									fillRule='evenodd'
									d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
									clipRule='evenodd'
								/>
							</svg>
						</span>
						<span className='ml-2'>Export Leads</span>
					</CSVLink>
				</div>
			</div>
		</header>
	);
};

export default connect(null, { getSearchResults })(Header);
