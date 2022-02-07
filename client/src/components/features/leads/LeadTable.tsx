import React, { useState, useCallback } from 'react';

// packages
import { DateTime } from 'luxon';
import ContentLoader from 'react-content-loader';

// redux
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { setSortColumn } from '@features/filters/filtersSlice';

// components
import LeadRow from './LeadRow';
import NullState from '@components/utils/NullState';
import Spinner from '@components/utils/Spinner';

// utils
import { Lead } from '@utils/interfaces/Lead';
import { User } from '@utils/interfaces/User';
import { SortTypes } from '@utils/interfaces/Filter';
import { useDarkMode } from '@hooks/hooks';

interface LeadTableProps {
	leads: Lead[];
	user: User;
	liked: { _id: string }[];
	archived: { _id: string }[];
	status: 'idle' | 'loading' | 'failed';
	type: string;
	currentSearchValue: string | null;
}

enum SortingDirection {
	ASCENDING = 1,
	DESCENDING = -1,
	UNSORTED = 0,
}

const LeadTable: React.FC<LeadTableProps> = ({
	leads,
	user,
	liked,
	archived,
	status,
	type,
	currentSearchValue,
}) => {
	const dispatch = useAppDispatch();
	const [colorTheme] = useDarkMode();

	// local state
	const [sortingConfig, setSortingConfig] = useState<{
		active: SortTypes | null;
		keys: {
			title: SortingDirection;
			category: SortingDirection;
			netProfit: SortingDirection;
			roi: SortingDirection;
			bsrCurrent: SortingDirection;
			monthlySales: SortingDirection;
			date: SortingDirection;
		};
	}>({
		active: null,
		keys: {
			title: SortingDirection.UNSORTED,
			category: SortingDirection.UNSORTED,
			netProfit: SortingDirection.UNSORTED,
			roi: SortingDirection.UNSORTED,
			bsrCurrent: SortingDirection.UNSORTED,
			monthlySales: SortingDirection.UNSORTED,
			date: SortingDirection.UNSORTED,
		},
	});

	// filter state
	const filters = useAppSelector((state) => state.filters);

	const minDate =
		filters.dateLimits.min &&
		DateTime.fromISO(filters.dateLimits.min).endOf('day');

	const maxDate =
		filters.dateLimits.max &&
		DateTime.fromISO(filters.dateLimits.max).endOf('day');

	const getNextSortingDirection = (sortingDirection: SortingDirection) => {
		if (
			sortingDirection === SortingDirection.UNSORTED ||
			sortingDirection === SortingDirection.DESCENDING
		) {
			return SortingDirection.ASCENDING;
		}
		return SortingDirection.DESCENDING;
	};

	const sortColumn = useCallback(
		(sortKey: SortTypes) => {
			const currentSortingDirection = sortingConfig.keys[sortKey];

			const nextSortingDirection = getNextSortingDirection(
				currentSortingDirection
			);

			const newSortingDirections = { ...sortingConfig.keys };

			newSortingDirections[sortKey] = nextSortingDirection;

			dispatch(
				setSortColumn({ type: sortKey, value: newSortingDirections[sortKey] })
			);
			return setSortingConfig({
				...sortingConfig,
				active: sortKey,
				keys: newSortingDirections,
			});
		},
		[sortingConfig, dispatch]
	);

	return (
		<section className={classes.sectionWrapper}>
			{status === 'failed' ? (
				<div className='mt-6 text-200'>
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
			) : status === 'loading' && leads.length === 0 ? (
				<Spinner
					divWidth={null}
					center={false}
					spinnerWidth={null}
					margin={true}
					text={'Loading leads...'}
				/>
			) : leads.length > 0 ? (
				<div className={classes.tableWrapper}>
					<table className={classes.table} id='leads'>
						<thead className={classes.tableHeadWrapper}>
							<tr className={classes.tableHead}>
								<th className='p-2 rounded-tl-lg' />
								<th className={classes.tableHeadCell}>
									<div className='flex items-center'>
										<span>Title</span>
										<SortButton
											sortKey={'title'}
											sortingConfig={sortingConfig}
											sortColumn={sortColumn}
										/>
									</div>
								</th>
								<th className={classes.tableHeadCell}>
									<div className='flex items-center'>
										<span>Category</span>
										<SortButton
											sortKey={'category'}
											sortingConfig={sortingConfig}
											sortColumn={sortColumn}
										/>
									</div>
								</th>
								<th className={'p-2 hidden xl:table-cell'}>Details</th>
								<th className={classes.tableHeadCell}>
									<div className='flex items-center'>
										<span>Profit</span>
										<SortButton
											sortKey={'netProfit'}
											sortingConfig={sortingConfig}
											sortColumn={sortColumn}
										/>
									</div>
								</th>
								<th className={classes.tableHeadCell}>
									<div className='flex items-center'>
										<span>ROI</span>
										<SortButton
											sortKey={'roi'}
											sortingConfig={sortingConfig}
											sortColumn={sortColumn}
										/>
									</div>
								</th>
								<th className={classes.tableHeadCell}>
									<div className='flex items-center'>
										<span>BSR</span>
										<SortButton
											sortKey={'bsrCurrent'}
											sortingConfig={sortingConfig}
											sortColumn={sortColumn}
										/>
									</div>
								</th>
								<th className={classes.tableHeadCell}>
									<div className='flex items-center'>
										<span>Sales</span>
										<SortButton
											sortKey={'monthlySales'}
											sortingConfig={sortingConfig}
											sortColumn={sortColumn}
										/>
									</div>
								</th>
								<th className={classes.tableHeadCell}>
									<div className='flex items-center'>
										<span>Date</span>
										<SortButton
											sortKey={'date'}
											sortingConfig={sortingConfig}
											sortColumn={sortColumn}
										/>
									</div>
								</th>
								<th className='p-2 rounded-tr-lg' />
							</tr>
						</thead>
						<tbody className={classes.tableBody}>
							{status === 'loading'
								? [...Array(filters.itemLimit)].map((_, i) => (
										<LeadRowLoader key={i} colorTheme={colorTheme} />
								  ))
								: leads.map((lead: any) => (
										<LeadRow
											key={lead._id}
											lead={lead}
											user={user}
											liked={liked}
											archived={archived}
										/>
								  ))}
						</tbody>
					</table>
				</div>
			) : type === 'feed' ? (
				<NullState
					header={`${
						filters.filters.length > 0
							? 'Your filters are too strict'
							: 'Your Feed is empty'
					}`}
					text={`${
						filters.filters.length > 0
							? 'No leads match your applied filters. Maybe try loosening your criteria.'
							: 'No leads were found, try refreshing the page.'
					}`}
					path={svgList.feed}
					link={''}
					linkText={''}
					showButton={true}
				/>
			) : type === 'liked' ? (
				<NullState
					header={`${
						filters.filters.length > 0
							? 'Your filters are too strict'
							: 'No liked leads were found'
					}`}
					text={`${
						filters.filters.length > 0
							? 'No leads match your applied filters. Maybe try loosening your criteria.'
							: "You haven't liked any leads yet, but you can go to the Feed to check some products out."
					}`}
					path={svgList.liked}
					link={'/'}
					linkText={'Go to the Feed'}
					showButton={true}
				/>
			) : type === 'archived' ? (
				<NullState
					header={`${
						filters.filters.length > 0
							? 'Your filters are too strict'
							: 'No archived leads were found'
					}`}
					text={`${
						filters.filters.length > 0
							? 'No leads match your applied filters. Maybe try loosening your criteria.'
							: "You haven't archived any leads yet, but you can go to the Feed to check some products out."
					}`}
					path={svgList.archived}
					link={'/'}
					linkText={'Go to the Feed'}
					showButton={true}
				/>
			) : type === 'search' && !currentSearchValue ? (
				<NullState
					header={'No search results found'}
					text={'Please try a different search query'}
					path={svgList.search}
					link={'/'}
					linkText={'Go to the Feed'}
					showButton={true}
				/>
			) : (
				<NullState
					header={'No results were found'}
					text={`There were no results that match these criteria${
						minDate && maxDate
							? minDate !== maxDate
								? ` between ${minDate.toFormat('LLL dd')} - ${maxDate.toFormat(
										'LLL dd'
								  )}`
								: `today`
							: minDate
							? ` on ${minDate.toFormat('LLL dd')}`
							: ''
					}`}
					path={svgList.search}
					link={''}
					linkText={''}
					showButton={true}
				/>
			)}
		</section>
	);
};

interface LeadRowLoaderProps {
	colorTheme: any;
}

const LeadRowLoader: React.FC<LeadRowLoaderProps> = ({
	colorTheme,
	...props
}) => {
	// global values
	const height = 25;
	const bgColor = colorTheme === 'dark' ? '#F0F4F8' : '#1C2936';
	const fgColor = colorTheme === 'dark' ? '#E6EBF0' : '#1E2C3C';

	return (
		<tr className='w-full py-16 border-b last:border-none border-100'>
			{/* like */}
			<td className='w-16 pt-6 pb-5' />
			{/* title */}
			<td className='w-32 md:w-64 xl:w-112 pl-2'>
				<ContentLoader
					speed={2}
					height={35}
					width={'80%'}
					backgroundColor={bgColor}
					foregroundColor={fgColor}
					{...props}
				>
					<rect x='0' y='7.5' rx='8' ry='8' width='100%' height={height} />
				</ContentLoader>
			</td>
			{/* category */}
			<td className='px-2 lg:w-40 xl:w-56'>
				<ContentLoader
					speed={2}
					height={35}
					width={'100%'}
					backgroundColor={bgColor}
					foregroundColor={fgColor}
					{...props}
				>
					<rect x='0' y='7.5' rx='8' ry='8' width='70%' height={height} />
				</ContentLoader>
			</td>
			{/* details */}
			<td className='hidden xl:table-cell w-20 px-2'>
				<ContentLoader
					speed={2}
					height={35}
					width={'100%'}
					backgroundColor={bgColor}
					foregroundColor={fgColor}
					{...props}
				>
					<rect x='4' y='7.5' rx='8' ry='8' width='22' height={height} />
					<rect x='36' y='7.5' rx='8' ry='8' width='22' height={height} />
				</ContentLoader>
			</td>
			{/* profit */}
			<td className='w-40 px-2'>
				<ContentLoader
					speed={2}
					height={35}
					width={'100%'}
					backgroundColor={bgColor}
					foregroundColor={fgColor}
					{...props}
				>
					<rect x='0' y='7.5' rx='8' ry='8' width='80' height={height} />
				</ContentLoader>
			</td>
			{/* roi */}
			<td className='px-2 w-24'>
				<ContentLoader
					speed={2}
					height={35}
					width={'100%'}
					backgroundColor={bgColor}
					foregroundColor={fgColor}
					{...props}
				>
					<rect x='0' y='7.5' rx='8' ry='8' width='40px' height={height} />
				</ContentLoader>
			</td>
			{/* bsr */}
			<td className='px-2 w-32'>
				<ContentLoader
					speed={2}
					height={35}
					width={'100%'}
					backgroundColor={bgColor}
					foregroundColor={fgColor}
					{...props}
				>
					<rect x='0' y='7.5' rx='8' ry='8' width='90' height={height} />
				</ContentLoader>
			</td>
			{/* sales */}
			<td className='px-2 w-24'>
				<ContentLoader
					speed={2}
					height={35}
					width={'100%'}
					backgroundColor={bgColor}
					foregroundColor={fgColor}
					{...props}
				>
					<rect x='0' y='7.5' rx='8' ry='8' width='40' height={height} />
				</ContentLoader>
			</td>
			{/* date */}
			<td className='px-2'>
				<ContentLoader
					speed={2}
					height={35}
					width={'100%'}
					backgroundColor={bgColor}
					foregroundColor={fgColor}
					{...props}
				>
					<rect x='0' y='7.5' rx='8' ry='8' width='60' height={height} />
				</ContentLoader>
			</td>
			{/* hover menu */}
			<td className='px-2' />
		</tr>
	);
};

const SortButton: React.FC<{
	sortKey: SortTypes;
	sortingConfig: any;
	sortColumn: (sortKey: SortTypes) => void;
}> = ({ sortKey, sortingConfig, sortColumn }) => {
	const sortDirection = sortingConfig.keys[sortKey];
	return (
		<button
			onClick={() => sortColumn(sortKey)}
			className={`${
				sortingConfig.active === sortKey
					? 'text-purple-500 dark:text-purple-300'
					: 'text-gray-500 dark:text-gray-700'
			} inline-block`}
		>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				className='inline-block ml-2 svg-sm'
				viewBox='0 0 20 20'
				fill='currentColor'
			>
				{sortDirection === SortingDirection.DESCENDING ? (
					<path d='M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z' />
				) : (
					<path d='M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z' />
				)}
			</svg>
		</button>
	);
};

// svg paths for nullState
const svgList = {
	feed: (
		<path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
	),
	liked: (
		<path
			fillRule='evenodd'
			d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
			clipRule='evenodd'
		/>
	),
	archived: <path d='M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z' />,
	search: (
		<path
			fillRule='evenodd'
			d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
			clipRule='evenodd'
		/>
	),
};

// classes for component
const classes = {
	sectionWrapper: 'relative mt-12',
	tableWrapper:
		'pb-1 cs-light-400 card-300 overflow-x-auto overflow-y-visible xl:overflow-visible',
	table: 'w-full',
	tableHeadWrapper: 'border-b border-100',
	tableHead:
		'text-left font-semibold text-xs cs-bg text-100 uppercase tracking-widest',
	tableHeadCell: 'p-4 lg:p-3 xl:p-2',
	tableBody: 'mx-4 text-sm text-200',
};

export default LeadTable;
