import React, { Fragment, useState } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	getAllLeads,
	clearCurrentLead,
	setPage,
	setLoading,
} from 'redux/actions/leads';
import { setItemLimit, setDateLimit } from 'redux/actions/filters';
import { setAlert } from 'redux/actions/alert';
import { NavLink } from 'react-router-dom';
import { DateTime } from 'luxon';

import Header from '../layout/navigation/Header';
import DatePicker from './tools/DatePicker';
import Filter from './tools/Filter';
import Prep from './tools/Prep';
import ExportButton from './tools/ExportButton';
import LeadTable from './LeadTable';
import Pagination from '../layout/navigation/Pagination';
import Details from './Details';
import Button from '../layout/formField/Button';
import Spinner from 'components/layout/Spinner';

const Leads = ({
	leads,
	pagination,
	type,
	itemLimit,
	headerTitle,
	user,
	authLoading,
	feed,
	filters,
	currentLead,
	leadLoading,
	lastUpdated,
	search,
	getAllLeads,
	clearCurrentLead,
	setPage,
	setItemLimit,
	setDateLimit,
	setLoading,
}) => {
	// toggle additional information
	const [showDetails, setShowDetails] = useState(false);
	const [date, setDate] = useState(false);
	const [filter, setFilter] = useState(false);
	const [prep, setPrep] = useState(false);
	const { _id: userId, role, dateCreated, likedLeads, archivedLeads } = user;
	const likedCount = likedLeads && likedLeads.length > 0 && likedLeads.length;
	const archivedCount =
		archivedLeads && archivedLeads.length > 0 && archivedLeads.length;
	const primaryLinks = [
		{
			title: 'Feed',
			link: '',
			count: null,
		},
		{
			title: 'Liked',
			link: '/liked',
			count: likedCount,
		},
		{
			title: 'Archived',
			link: '/archived',
			count: archivedCount,
		},
	];
	const {
		count: filterCount,
		dateLimits: { selected: dateSelected },
	} = filters;
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
			conditional: filterCount > 0,
			conditionalDisplay: (
				<span className='h-4 w-4 absolute top-0 right-0 flex items-center justify-center p-2 rounded-full bg-purple-500 text-white transform -translate-y-2 translate-x-3'>
					{filterCount}
				</span>
			),
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
			conditional: filters.prep.unit || filters.prep.lb,
			conditionalDisplay: (
				<span className='h-5 w-5 absolute top-0 right-0 flex items-center justify-center rounded-full bg-white text-purple-500 transform -translate-y-2 translate-x-3'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path
							fillRule='evenodd'
							d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
							clipRule='evenodd'
						/>
					</svg>
				</span>
			),
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
					<Header
						page={pagination.page}
						title={headerTitle}
						searchActive={true}
						_id={userId}
						role={role}
						dateCreated={dateCreated}
					/>
					{!search && (
						<nav className='mt-6 container'>
							<div className='relative flex items-end justify-between pb-2 border-b border-gray-100'>
								<div>
									{primaryLinks.map((link, i) => (
										<NavLink
											key={i}
											exact
											to={`/leads${link.link}`}
											onClick={() => setLoading()}
											className='relative first:ml-0 ml-10 pb-2 font-semibold text-gray-600 hover:text-gray-900 group transition-colors duration-100 ease-in-out'
											activeClassName='text-purple-500 hover:text-purple-500 border-b-2 border-purple-600'
										>
											<span>{link.title}</span>
											{link.count && (
												<span className='h-4 w-4 absolute top-0 right-0 flex items-center justify-center p-1 rounded-full bg-purple-500 group-hover:bg-purple-600 text-xs text-white transform -translate-y-3 translate-x-5'>
													{link.count}
												</span>
											)}
										</NavLink>
									))}
								</div>
								<div className='flex items-center'>
									<Button
										text={
											dateSelected
												? dateSelected
												: `${
														DateTime.fromISO(user.dateCreated).toFormat(
															'LLL dd, yyyy'
														) || 'Jan 1, 2021'
												  } - ${DateTime.now().toFormat('LLL dd, yyyy')}` ||
												  'All leads'
										}
										path={
											<path
												fillRule='evenodd'
												d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
												clipRule='evenodd'
											/>
										}
										onClick={() => setDate((prev) => !prev)}
									/>
									{tools.map((tool, i) => (
										<Button
											key={i}
											text={tool.text}
											path={tool.path}
											onClick={tool.onClick}
											conditional={tool.conditional}
											conditionalDisplay={tool.conditionalDisplay}
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
									{date && (
										<DatePicker
											date={date}
											setDate={setDate}
											dateCreated={user.dateCreated}
											lastUpdated={lastUpdated}
											type={type}
											setDateLimit={setDateLimit}
											setPage={setPage}
										/>
									)}
									{filter && <Filter filter={filter} setFilter={setFilter} />}
									{prep && <Prep prep={prep} setPrep={setPrep} />}
									{exportLeads &&
										(feed.totalByIds.length > 0 ? (
											<ExportButton
												user={user}
												leads={feed.totalByIds}
												setExportLeads={setExportLeads}
											/>
										) : (
											<Spinner
												noMargin={true}
												divWidth={'w-28'}
												spinnerWidth={'sm'}
											/>
										))}
								</div>
							</div>
						</nav>
					)}
					<LeadTable
						leads={leads}
						user={user}
						liked={likedLeads}
						archived={archivedLeads}
						loading={leadLoading}
						showDetails={showDetails}
						setShowDetails={setShowDetails}
						type={type}
					/>
					{pagination && (
						<Pagination
							pagination={pagination}
							type={type}
							loading={leadLoading}
							setPage={setPage}
							itemLimit={itemLimit}
							setItemLimit={setItemLimit}
						/>
					)}
				</section>
				{showDetails && currentLead && (
					<Details
						currentLead={currentLead}
						userId={userId}
						liked={likedLeads}
						archived={archivedLeads}
						showDetails={showDetails}
						setShowDetails={setShowDetails}
						clearCurrentLead={clearCurrentLead}
					/>
				)}
			</Fragment>
		)
	);
};

Leads.propTypes = {
	leads: PropTypes.array.isRequired,
	pagination: PropTypes.object.isRequired,
	type: PropTypes.string.isRequired,
	headerTitle: PropTypes.string,
	user: PropTypes.object.isRequired,
	authLoading: PropTypes.bool.isRequired,
	feed: PropTypes.object.isRequired,
	filters: PropTypes.object.isRequired,
	leadLoading: PropTypes.bool.isRequired,
	currentLead: PropTypes.object,
	search: PropTypes.bool,
	getAllLeads: PropTypes.func.isRequired,
	clearCurrentLead: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
	const {
		leads,
		pagination,
		headerTitle,
		currentSearchParam,
		type,
		itemLimit,
		user,
		loading: authLoading,
	} = ownProps;
	const { feed, currentLead, loading: leadLoading, lastUpdated } = state.leads;
	const { filters } = state;
	return {
		leads,
		pagination,
		headerTitle,
		currentSearchParam,
		type,
		itemLimit,
		user,
		authLoading,
		feed,
		filters,
		currentLead,
		leadLoading,
		lastUpdated,
	};
};

export default connect(mapStateToProps, {
	getAllLeads,
	clearCurrentLead,
	setPage,
	setItemLimit,
	setDateLimit,
	setLoading,
})(Leads);
