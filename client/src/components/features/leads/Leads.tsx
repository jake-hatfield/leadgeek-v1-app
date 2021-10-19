import React, { Fragment, useState, useEffect } from 'react';

// packages
import { DateTime } from 'luxon';
import { NavLink, useLocation } from 'react-router-dom';
import { useSpring } from 'react-spring';

// redux
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { setAlert } from '@features/alert/alertSlice';
import {
	clearCurrentLead,
	getAllLeads,
	setLeadLoading,
	setPage,
} from '@features/leads/leadsSlice';

// components
import Button from '@components/utils/Button';
import DatePicker from '../filters/DatePicker';
import Details from './Details';
import ExportButton from './ExportButton';
import Filter from '../filters/Filter';
import LeadTable from './LeadTable';
import PaginationComponent from '@components/layout/navigation/Pagination';
import Spinner from '@components/utils/Spinner';

// utils
import { Lead } from '@utils/interfaces/Lead';
import { Pagination } from '@utils/interfaces/Pagination';
import { User } from '@utils/interfaces/User';

interface LeadsProps {
	leads: Lead[];
	allLeads: Lead[];
	pagination: Pagination;
	type: 'feed' | 'liked' | 'archived' | 'search';
	itemLimit: number;
	user: User;
	status: 'idle' | 'loading' | 'failed';
	search: boolean;
	currentSearchValue: string | null;
}

const Leads: React.FC<LeadsProps> = ({
	leads,
	allLeads,
	pagination,
	type,
	itemLimit,
	user,
	status: authStatus,
	currentSearchValue,
}) => {
	const dispatch = useAppDispatch();
	const location = useLocation();

	// lead state
	const leadStatus = useAppSelector((state) => state.leads.status);
	const currentLead = useAppSelector((state) => state.leads.currentLead);
	const lastUpdated = useAppSelector((state) => state.leads.lastUpdated);
	// filter state
	const filters = useAppSelector((state) => state.filters);

	// local state
	const [date, setDate] = useState(false);
	const [exportLeads, setExportLeads] = useState(false);
	const [filter, setFilter] = useState(false);
	const [showDetails, setShowDetails] = useState(false);

	// destructure necessary items
	const { _id: userId, likedLeads, archivedLeads } = user;
	const {
		count: filterCount,
		dateLimits: { selected: dateSelected },
	} = filters;

	// set counts for "liked" & "archived"
	const likedCount = likedLeads?.length > 0 && likedLeads.length;
	const archivedCount = archivedLeads?.length > 0 && archivedLeads.length;

	// navigation links in header
	const primaryLinks = [
		{
			title: 'Feed',
			link: '/',
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

	// tools in header
	const tools = [
		{
			text: 'Filters',
			path: svgList.filters,
			onClick: () => setFilter((prev) => !prev),
			conditional: filterCount! > 0,
			conditionalDisplay: (
				<span className='svg-sm absolute top-0 right-0 all-center py-2.5 px-3 rounded-full cs-purple transform -translate-y-2 translate-x-3'>
					{filterCount}
				</span>
			),
		},
	];

	// handler for exporting leads
	const handleExport = async () => {
		try {
			if (leads.length > 0) {
				dispatch(
					setAlert({
						title: 'Exporting leads',
						message: 'Hold tight while the data is accumulated.',
						alertType: 'warning',
					})
				);
				dispatch(getAllLeads({ filters, type, query: currentSearchValue }));
				setExportLeads(true);
			} else {
				dispatch(
					setAlert({
						title: 'There are no leads to export',
						message: 'Please adjust your export settings and try again',
						alertType: 'danger',
					})
				);
			}
		} catch (error) {
			console.log(error);
			dispatch(
				setAlert({
					title: 'Error exporting leads',
					message: 'Please try again or refresh the page.',
					alertType: 'danger',
				})
			);
		}
	};

	// set a timeout to get all leads
	useEffect(() => {
		if (exportLeads) {
			const resultTimeout = setTimeout(() => {
				if (allLeads.length === 0) {
					setExportLeads(false);
				}
			}, 18000);

			return () => clearTimeout(resultTimeout);
		}
	}, [allLeads, exportLeads, setExportLeads]);

	// details animation style
	const animationStyle = useSpring({
		transform: showDetails ? 'translateX(0%)' : 'translateX(100%)',
		config: { duration: 250 },
	});

	return authStatus === 'idle' && user ? (
		<Fragment>
			<section className={classes.leadsWrapper}>
				<nav className={classes.navWrapper}>
					<div className={classes.nav}>
						<div>
							{primaryLinks.map((link, i) => (
								<NavLink
									key={i}
									exact
									to={`${link.link}`}
									onClick={() => {
										location.pathname !== '/' && dispatch(setLeadLoading());
										currentLead && dispatch(clearCurrentLead());
									}}
									className={classes.navLink}
									activeClassName={classes.navLinkActive}
								>
									<span>{link.title}</span>
									{link.count && (
										<span className={classes.navLinkCounter}>{link.count}</span>
									)}
								</NavLink>
							))}
						</div>
						<div className={classes.navToolsWrapper}>
							<Button
								text={
									dateSelected && user.dateCreated
										? dateSelected
										: `${
												DateTime.fromISO(user?.dateCreated.toString()).toFormat(
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
							{/* handle active or inactive states for tools */}
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
									dateCreated={user.dateCreated.toString()}
									lastUpdated={lastUpdated}
								/>
							)}
							{filter && (
								<Filter filterActive={filter} setFilterActive={setFilter} />
							)}
							{exportLeads &&
								(allLeads.length > 0 ? (
									<ExportButton
										user={user}
										leads={allLeads}
										setExportLeads={setExportLeads}
									/>
								) : (
									<Spinner
										divWidth={'w-24 ml-1'}
										center={false}
										spinnerWidth={'sm'}
										margin={false}
										text={null}
									/>
								))}
						</div>
					</div>
				</nav>
				<div className='container'>
					{leadStatus === 'failed' ? (
						<div className='mt-6 container text-200'>
							There was an error making that request. If this issue persists,
							please{' '}
							<a
								href='mailto:support@leadgeek.io'
								target='_blank'
								rel='noopener noreferrer'
								className='link rounded-main transition-main ring-gray'
							>
								contact Leadgeek support
							</a>
							.
						</div>
					) : (
						<LeadTable
							leads={leads}
							user={user}
							liked={likedLeads}
							archived={archivedLeads}
							status={leadStatus}
							showDetails={showDetails}
							setShowDetails={setShowDetails}
							type={type}
							currentSearchValue={currentSearchValue}
						/>
					)}
					{leads.length > 0 && pagination && (
						<PaginationComponent
							status={leadStatus}
							pagination={pagination}
							type={type}
							itemLimit={itemLimit}
							setPage={setPage}
						/>
					)}
				</div>
			</section>
			{currentLead && (
				<Details
					type={type}
					user={user}
					currentLead={currentLead}
					showDetails={showDetails}
					setShowDetails={setShowDetails}
					animationStyle={animationStyle}
				/>
			)}
		</Fragment>
	) : authStatus === 'loading' ? (
		<Spinner
			divWidth={null}
			center={true}
			spinnerWidth={null}
			margin={false}
			text={'Loading leads...'}
		/>
	) : (
		<div className='mt-6 container text-200'>
			There was an error making that request. If this issue persists, please{' '}
			<a
				href='mailto:support@leadgeek.io'
				target='_blank'
				rel='noopener noreferrer'
				className='link rounded-main transition-main ring-gray'
			>
				contact Leadgeek support
			</a>
			.
		</div>
	);
};

// svg paths for tools
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

// classes for component
const classes = {
	leadsWrapper: 'relative pb-28',
	navWrapper:
		'pt-3 pb-2 px-4 lg:px-8 cs-light-400 border-b border-300 shadow-sm',
	nav: 'relative flex items-end justify-between container',
	navLink:
		'relative first:ml-0 ml-8 pb-2 font-semibold text-gray-700 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-300 hover:border-b-2 hover:border-purple-500 dark:border-purple-200 group transition-colors-main',
	navLinkActive:
		'text-purple-500 dark:text-purple-300 border-b-2 border-purple-500 dark:border-purple-200',
	navLinkCounter:
		'h-4 w-4 absolute top-0 right-0 all-center py-2.5 px-3 rounded-full cs-purple group-hover:bg-purple-600 dark:group-hover:bg-purple-300 text-xs transform -translate-y-4 translate-x-7',
	navToolsWrapper: 'flex items-center',
};

export default Leads;
