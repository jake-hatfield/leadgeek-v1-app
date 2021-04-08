import React, { Fragment, useState } from 'react';

import { connect } from 'react-redux';
import { getAllLeads, clearCurrentLead } from '../../redux/actions/leads';
import { NavLink } from 'react-router-dom';

import Header from '../layout/navigation/Header';
import Filter from './tools/Filter';
import Prep from './tools/Prep';
import ExportButton from './tools/ExportButton';
import LeadTable from './LeadTable';
import Pagination from '../layout/navigation/Pagination';
import Details from './details/Details';
import Button from '../layout/formField/Button';
import { setAlert } from '../../redux/actions/alert';

const Leads = ({
	headerTitle,
	leads,
	pagination,
	type,
	search,
	user,
	feed,
	currentLead,
	totalItems,
	authLoading,
	leadLoading,
	getAllLeads,
	clearCurrentLead,
}) => {
	// toggle additional information
	const [showDetails, setShowDetails] = useState(false);
	const [filter, setFilter] = useState(false);
	const [prep, setPrep] = useState(false);
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
			onClick: () => setFilter((prev) => !prev),
		},
		{
			text: 'Prep',
			path: (
				<path
					fillRule='evenodd'
					d='M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z'
					clipRule='evenodd'
				/>
			),
			onClick: () => setPrep((prev) => !prev),
		},
	];

	const [exportLeads, setExportLeads] = useState(false);
	const handleExport = async () => {
		try {
			getAllLeads(user);
			setExportLeads(true);
		} catch (error) {
			setAlert('Error exporting leads, please try again', 'danger');
		}
	};

	return (
		!authLoading &&
		user && (
			<Fragment>
				<section className='relative my-6'>
					<Header title={headerTitle} searchActive={true} />
					{!search && (
						<nav className='mt-6 container'>
							<div className='relative flex items-end justify-between pb-2 border-b border-gray-200'>
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
								<div className='flex items-center'>
									{tools.map((tool, i) => (
										<Button
											key={i}
											text={tool.text}
											path={tool.path}
											onClick={tool.onClick}
											margin={true}
										/>
									))}
									{!exportLeads && (
										<Button
											text='Export'
											path={
												<path
													fillRule='evenodd'
													d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
													clipRule='evenodd'
												/>
											}
											onClick={handleExport}
											margin={true}
										/>
									)}
									{filter && <Filter setFilter={setFilter} filter={filter} />}
									{prep && <Prep setPrep={setPrep} prep={prep} />}
									{exportLeads && feed.totalByIds && (
										<ExportButton
											user={user}
											leads={feed.totalByIds}
											setExportLeads={setExportLeads}
										/>
									)}
								</div>
							</div>
						</nav>
					)}
					<LeadTable
						leads={leads}
						loading={leadLoading}
						showDetails={showDetails}
						setShowDetails={setShowDetails}
						user={user}
					/>
					{!search && <Pagination pagination={pagination} type={type} />}
				</section>
				{showDetails && currentLead && (
					<Details
						clearCurrentLead={clearCurrentLead}
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
	const { feed, currentLead, lastUpdated, loading: leadLoading } = state.leads;
	return {
		leads,
		pagination,
		type,
		user,
		authLoading,
		feed,
		currentLead,
		totalItems,
		lastUpdated,
		leadLoading,
	};
};

export default connect(mapStateToProps, {
	clearCurrentLead,
	getAllLeads,
})(Leads);
