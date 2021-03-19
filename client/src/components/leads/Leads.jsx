import React, { Fragment, useState } from 'react';

import { connect } from 'react-redux';
import { clearDetailedLead } from '../../redux/actions/leads';
import { NavLink } from 'react-router-dom';

import LeadTable from './LeadTable';
import Pagination from '../layout/navigation/Pagination';
import Details from './details/Details';
import Button from '../layout/formField/Button';

const Leads = ({
	leads,
	pagination,
	type,
	user,
	currentLead,
	totalItems,
	lastUpdated,
	authLoading,
	leadLoading,
	clearDetailedLead,
}) => {
	// search helpers
	const [search, setSearch] = useState('');
	const onSearchChange = (e) => {
		setSearch(e.target.value);
	};
	// toggle additional information
	const [showDetails, setShowDetails] = useState(false);
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
		{
			text: 'Export',
			path: (
				<path
					fillRule='evenodd'
					d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 k0 010-1.414z'
					clipRule='evenodd'
				/>
			),
		},
	];
	const primaryLinks = [
		{
			title: 'Feed',
			link: '',
		},
		{
			title: 'Liked',
			link: '/liked',
		},
		{
			title: 'Archived',
			link: '/archived',
		},
	];
	return (
		!authLoading &&
		user && (
			<Fragment>
				<section className='my-6'>
					<header className='border-b border-gray-200'>
						<div className='flex justify-between pb-2 container'>
							<div className='w-2/3 flex items-center'>
								<h1 className='text-3xl text-gray-900 font-bold'>Leads</h1>
								<div className='w-full ml-32 relative z-0 text-gray-400'>
									<input
										onChange={(e) => onSearchChange(e)}
										type='text'
										placeholder='Search by name, ASIN, store, etc.'
										className='py-2 pl-10 pr-6 w-3/4 rounded-lg text-sm text-gray-500 placeholder-gray-400 transition-all duration-100 ease-in-out focus:outline-none hover:shadow-outline focus:shadow-outline'
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
								</div>
							</div>
							<div className='w-1/3 flex items-center justify-end text-gray-300'>
								{tools.map((tool, i) => (
									<Button key={i} text={tool.text} path={tool.path} />
								))}
							</div>
						</div>
					</header>
					<nav className='mt-6 container'>
						<div className='flex items-end justify-between pb-2 border-b border-gray-200'>
							<div>
								{primaryLinks.map((link, i) => (
									<NavLink
										key={i}
										exact
										to={`/leads${link.link}`}
										className='pb-2 first:ml-0 ml-10 font-semibold text-lg text-gray-600 hover:text-gray-900 transition-colors duration-100 ease-in-out'
										activeClassName='text-purple-500 hover:text-purple-500 border-b-2 border-purple-600'
									>
										{link.title}
									</NavLink>
								))}
							</div>
							{totalItems && (
								<div className='py-2 px-3 rounded-lg bg-teal-300 font-semibold text-sm text-teal-600'>
									{totalItems} leads
								</div>
							)}
						</div>
					</nav>
					<LeadTable
						leads={leads}
						loading={leadLoading}
						showDetails={showDetails}
						setShowDetails={setShowDetails}
						user={user}
					/>
					<Pagination pagination={pagination} type={type} />
				</section>
				{showDetails && (
					<Details
						clearDetailedLead={clearDetailedLead}
						setShowDetails={setShowDetails}
						currentLead={currentLead}
					/>
				)}
			</Fragment>
		)
	);
};

const mapStateToProps = (state, ownProps) => {
	const { leads, pagination, type, totalItems } = ownProps;
	const { user, loading: authLoading } = state.auth;
	const { currentLead, lastUpdated, loading: leadLoading } = state.leads;
	return {
		leads,
		pagination,
		type,
		user,
		authLoading,
		currentLead,
		totalItems,
		lastUpdated,
		leadLoading,
	};
};

export default connect(mapStateToProps, {
	clearDetailedLead,
})(Leads);
