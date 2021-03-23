import React, { Fragment, useState } from 'react';

import { connect } from 'react-redux';
import { clearDetailedLead } from '../../redux/actions/leads';
import { NavLink } from 'react-router-dom';

import Header from '../layout/navigation/Header';
import LeadTable from './LeadTable';
import Pagination from '../layout/navigation/Pagination';
import Details from './details/Details';

const Leads = ({
	headerTitle,
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
	// toggle additional information
	const [showDetails, setShowDetails] = useState(false);
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
					<Header title={headerTitle} user={user} leads={leads} />
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
						showDetails={showDetails}
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
