import React, { useState } from 'react';

import { NavLink } from 'react-router-dom';
import { DateTime } from 'luxon';

import { useAppDispatch, useAppSelector } from '@utils/hooks';
import {
	getAllLeads,
	clearCurrentLead,
	setPage,
} from '@features/leads/leadsSlice';
import { setItemLimit, setDateLimit } from '@features/filters/filtersSlice';
import { setAlert } from '@redux/actions/alert';

import Header from '../layout/navigation/Header';
import DatePicker from './tools/DatePicker';
import Filter from './tools/Filter';
import Prep from './tools/Prep';
import ExportButton from './tools/ExportButton';
import LeadTable from './LeadTable';
import PaginationComponent from '../layout/navigation/Pagination';
import Details from './Details';
import Button from '../layout/utils/Button';
import Spinner from '../layout/utils/Spinner';

import { Lead } from '@utils/interfaces/leads/Lead';
import { Pagination } from '@utils/interfaces/leads/Pagination';
import { User } from '@utils/interfaces/User';

interface LeadsProps {
	leads: Lead[];
	pagination: Pagination;
	type: string;
	itemLimit: number;
	headerTitle: string | null;
	user: User;
	status: 'idle' | 'loading' | 'failed';
	search: boolean;
	currentSearchParam: string | null;
}

const Leads: React.FC<LeadsProps> = ({
	leads,
	pagination,
	type,
	itemLimit,
	headerTitle,
	user,
	status: authStatus,
	search,
	currentSearchParam,
}) => {
	const dispatch = useAppDispatch();
	// redux selectors
	const leadStatus = useAppSelector((state) => state.leads.status);
	const feed = useAppSelector((state) => state.leads.feed);
	const currentLead = useAppSelector((state) => state.leads.currentLead);
	const lastUpdated = useAppSelector((state) => state.leads.lastUpdated);
	const filters = useAppSelector((state) => state.filters);

	const [showDetails, setShowDetails] = useState(false);
	const [date, setDate] = useState(false);
	const [filter, setFilter] = useState(false);
	const [prep, setPrep] = useState(false);

	const {
		_id: userId,
		role,
		dateCreated,
		likedLeads,
		archivedLeads,
		comments,
	} = user;

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
			link: '/liked/',
			count: likedCount,
		},
		{
			title: 'Archived',
			link: '/archived/',
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
			path: svgList.filters,
			onClick: () => setFilter((prev) => !prev),
			conditional: filterCount! > 0,
			conditionalDisplay: (
				<span className='h-4 w-4 absolute top-0 right-0 flex items-center justify-center p-2 rounded-full bg-purple-500 text-white transform -translate-y-1 translate-x-3'>
					{filterCount}
				</span>
			),
		},
		{
			text: 'Prep',
			path: svgList.prep,
			onClick: () => setPrep((prev) => !prev),
			conditional: filters.prep.unit || filters.prep.lb,
			conditionalDisplay: (
				<span className='h-5 w-5 absolute top-0 right-0 flex items-center justify-center rounded-full bg-white text-purple-500 transform -translate-y-1 translate-x-3'>
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
			// getAllLeads(user);
			setExportLeads(true);
		} catch (error) {
			setAlert(
				'Error exporting leads',
				'Please try again or refresh the page.',
				'danger'
			);
		}
	};
	return authStatus === 'idle' && user ? (
		<>
			<section className={classes.leadsWrapper}>
				<Header
					title={headerTitle}
					role={role}
					dateCreated={dateCreated}
					searchActive={true}
				/>
				{!search && (
					<nav className={classes.navWrapper}>
						<div className={classes.nav}>
							<div>
								{primaryLinks.map((link, i) => (
									<NavLink
										key={i}
										exact
										to={`/leads${link.link}`}
										// onClick={() => setLoading()}
										className={classes.navLink}
										activeClassName={classes.navLinkActive}
									>
										<span>{link.title}</span>
										{link.count && (
											<span className={classes.navLinkCounter}>
												{link.count}
											</span>
										)}
									</NavLink>
								))}
							</div>
							<div className={classes.navToolsWrapper}>
								<Button
									text={
										// dateSelected
										// 	? dateSelected
										// 	: `${
										// 			DateTime.fromISO(user.dateCreated).toFormat(
										// 				'LLL dd, yyyy'
										// 			) || 'Jan 1, 2021'
										// 	  } - ${DateTime.now().toFormat('LLL dd, yyyy')}` ||
										// 	  'All leads'
										`${
											DateTime.fromISO(user.dateCreated).toFormat(
												'LLL dd, yyyy'
											) || 'Jan 1, 2021'
										} - ${DateTime.now().toFormat('LLL dd, yyyy')}` ||
										'All leads'
									}
									onClick={() => setDate((prev) => !prev)}
									width={null}
									margin={false}
									size={null}
									cta={false}
									path={svgList.calendar}
									conditional={null}
									conditionalDisplay={null}
								/>
								{tools.map((tool, i) => (
									<Button
										key={i}
										text={tool.text}
										onClick={tool.onClick}
										width={null}
										margin={true}
										size={null}
										cta={false}
										path={tool.path}
										conditional={tool.conditional}
										conditionalDisplay={tool.conditionalDisplay}
									/>
								))}
								{!exportLeads && (
									<Button
										text='Export'
										onClick={handleExport}
										width={null}
										margin={true}
										size={null}
										cta={false}
										path={svgList.export}
										conditional={null}
										conditionalDisplay={null}
									/>
								)}
								{date && (
									<DatePicker
										type={type}
										date={date}
										setDate={setDate}
										dateCreated={user.dateCreated}
										lastUpdated={lastUpdated}
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
											divWidth={'w-28'}
											spinnerWidth={'sm'}
											margin={false}
											search={false}
											text={null}
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
					status={leadStatus}
					showDetails={showDetails}
					setShowDetails={setShowDetails}
					type={type}
					currentSearchParam={currentSearchParam}
				/>
				{pagination && (
					<PaginationComponent
						status={leadStatus}
						pagination={pagination}
						type={type}
						itemLimit={itemLimit}
						padding={false}
						setPage={setPage}
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
					comments={comments || []}
					showDetails={showDetails}
					setShowDetails={setShowDetails}
					clearCurrentLead={clearCurrentLead}
				/>
			)}
		</>
	) : (
		<div>Hello</div>
	);
};

const svgList = {
	calendar: (
		<path
			fillRule='evenodd'
			d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
			clipRule='evenodd'
		/>
	),
	filters: (
		<path
			fillRule='evenodd'
			d='M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z'
			clipRule='evenodd'
		/>
	),
	prep: (
		<path
			fillRule='evenodd'
			d='M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z'
			clipRule='evenodd'
		/>
	),
	export: (
		<path
			fillRule='evenodd'
			d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
			clipRule='evenodd'
		/>
	),
};

const classes = {
	leadsWrapper: 'relative my-6',
	navWrapper: 'mt-6 container',
	nav: 'relative flex items-end justify-between pb-2 border-b border-gray-200',
	navLink:
		'relative first:ml-0 ml-8 pb-2 font-semibold text-gray-600 hover:text-purple-500 hover:border-b-2 hover:border-purple-600 group transition-colors-main',
	navLinkActive:
		'text-purple-500 hover:text-purple-500 border-b-2 border-purple-600',
	navLinkCounter:
		'h-4 w-4 absolute top-0 right-0 flex items-center justify-center p-1 rounded-full bg-purple-500 group-hover:bg-purple-600 text-xs text-white transform -translate-y-3 translate-x-5',
	navToolsWrapper: 'flex items-center',
};

export default Leads;
