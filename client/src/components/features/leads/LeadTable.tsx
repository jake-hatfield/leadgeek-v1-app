import React from 'react';

// packages
import { DateTime } from 'luxon';
import ContentLoader from 'react-content-loader';

// redux
import { useAppSelector } from '@utils/hooks';

// components
import LeadRow from './LeadRow';
import NullState from '@components/utils/NullState';
import Spinner from '@components/utils/Spinner';

// utils
import { Lead } from '@utils/interfaces/Lead';
import { User } from '@utils/interfaces/User';

interface LeadTableProps {
	leads: Lead[];
	user: User;
	liked: Lead[];
	archived: Lead[];
	status: 'idle' | 'loading' | 'failed';
	showDetails: boolean;
	setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
	type: string;
	currentSearchValue: string | null;
}

const LeadTable: React.FC<LeadTableProps> = ({
	leads,
	user,
	liked,
	archived,
	status,
	showDetails,
	setShowDetails,
	type,
	currentSearchValue,
}) => {
	// filter state
	const filters = useAppSelector((state) => state.filters);

	const minDate =
		filters.dateLimits.min &&
		DateTime.fromISO(filters.dateLimits.min).endOf('day');

	const maxDate =
		filters.dateLimits.max &&
		DateTime.fromISO(filters.dateLimits.max).endOf('day');

	return (
		<section className={classes.sectionWrapper}>
			{status === 'failed' ? (
				<div className='mt-6 container'>
					There was an error making that request. If this issue persists, please{' '}
					<a
						href='mailto:support@leadgeek.io'
						target='_blank'
						rel='noopener noreferrer'
						className='link text-purple-500 hover:text-purple-600 rounded-lg transition-main ring-gray'
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
					margin={false}
					text={'Loading leads...'}
				/>
			) : leads.length > 0 ? (
				<div className={classes.tableWrapper}>
					<table className={classes.table} id='leads'>
						<thead className={classes.tableHeadWrapper}>
							<tr className={classes.tableHead}>
								<th className='p-2 rounded-tl-lg' />
								<th className={classes.tableHeadCell}>Title</th>
								<th className={classes.tableHeadCell}>Category</th>
								<th className={classes.tableHeadCell}>Details</th>
								<th className={classes.tableHeadCell}>Profit</th>
								<th className={classes.tableHeadCell}>ROI</th>
								<th className={classes.tableHeadCell}>BSR</th>
								<th className={classes.tableHeadCell}>Sales</th>
								<th className={classes.tableHeadCell}>Date</th>
								<th className='p-2 rounded-tr-lg' />
							</tr>
						</thead>
						<tbody className={classes.tableBody}>
							{leads.map((lead, i) => {
								// return status === 'loading' ? (
								// 	<LeadRow
								// 		key={lead._id}
								// 		lead={lead}
								// 		user={user}
								// 		liked={liked}
								// 		archived={archived}
								// 		showDetails={showDetails}
								// 		setShowDetails={setShowDetails}
								// 		lbFee={1}
								// 		unitFee={1}
								// 	/>
								// ) : (
								// 	<LeadRowLoader />
								// );
								return status === 'loading' ? (
									<LeadRowLoader key={i} />
								) : (
									<LeadRow
										key={lead._id}
										lead={lead}
										user={user}
										liked={liked}
										archived={archived}
										showDetails={showDetails}
										setShowDetails={setShowDetails}
									/>
								);
							})}
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
					link={'/leads'}
					linkText={'Go to the Feed'}
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
					link={'/leads'}
					linkText={'Go to the Feed'}
				/>
			) : type === 'search' && !currentSearchValue ? (
				<NullState
					header={'No search results found'}
					text={'Please try a different search query'}
					path={svgList.search}
					link={'/leads'}
					linkText={'Go to the Feed'}
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
				/>
			)}
		</section>
	);
};

const LeadRowLoader = (props: any) => {
	return (
		<tr className='w-full py-16 border-b border-gray-100 dark:border-gray-900'>
			{/* like */}
			<td className='w-10 py-2 px-2' />
			{/* title */}
			<td className='w-32 md:w-64 lg:w-64 xl:w-96 pl-2 pr-12'>
				<ContentLoader
					speed={2}
					height={35}
					width={'100%'}
					backgroundColor='#F0F4F8'
					foregroundColor='#E6EBF0'
					{...props}
				>
					<rect x='0' y='7.5' rx='8' ry='8' width='100%' height='20' />
				</ContentLoader>
			</td>
			{/* category */}
			<td className='px-2 lg:w-40 xl:w-56'>
				<ContentLoader
					speed={2}
					height={35}
					width={'100%'}
					backgroundColor='#F0F4F8'
					foregroundColor='#E6EBF0'
					{...props}
				>
					<rect x='0' y='7.5' rx='8' ry='8' width='70%' height='20' />
				</ContentLoader>
			</td>
			{/* details */}
			<td className='hidden xl:table-cell w-20 px-2'>
				<ContentLoader
					speed={2}
					height={35}
					width={'100%'}
					backgroundColor='#F0F4F8'
					foregroundColor='#E6EBF0'
					{...props}
				>
					<rect x='4' y='7.5' rx='8' ry='8' width='24' height='20' />
					<rect x='36' y='7.5' rx='8' ry='8' width='24' height='20' />
				</ContentLoader>
			</td>
			{/* profit */}
			<td className='w-36 px-2'>
				<ContentLoader
					speed={2}
					height={35}
					width={'100%'}
					backgroundColor='#F0F4F8'
					foregroundColor='#E6EBF0'
					{...props}
				>
					<rect x='0' y='7.5' rx='8' ry='8' width='90' height='20' />
				</ContentLoader>
			</td>
			{/* roi */}
			<td className='px-2'>
				<ContentLoader
					speed={2}
					height={35}
					width={'100%'}
					backgroundColor='#F0F4F8'
					foregroundColor='#E6EBF0'
					{...props}
				>
					<rect x='0' y='7.5' rx='8' ry='8' width='90' height='20' />
				</ContentLoader>
			</td>
			{/* bsr */}
			<td className='px-2'>
				<ContentLoader
					speed={2}
					height={35}
					width={'100%'}
					backgroundColor='#F0F4F8'
					foregroundColor='#E6EBF0'
					{...props}
				>
					<rect x='0' y='7.5' rx='8' ry='8' width='90' height='20' />
				</ContentLoader>
			</td>
			{/* sales */}
			<td className='px-2'>
				<ContentLoader
					speed={2}
					height={35}
					width={'100%'}
					backgroundColor='#F0F4F8'
					foregroundColor='#E6EBF0'
					{...props}
				>
					<rect x='0' y='7.5' rx='8' ry='8' width='60' height='20' />
				</ContentLoader>
			</td>
			{/* date */}
			<td className='px-2'>
				<ContentLoader
					speed={2}
					height={35}
					width={'100%'}
					backgroundColor='#F0F4F8'
					foregroundColor='#E6EBF0'
					{...props}
				>
					<rect x='0' y='7.5' rx='8' ry='8' width='60' height='20' />
				</ContentLoader>
			</td>
			{/* hover menu */}
			<td className='px-2' />
		</tr>
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
	sectionWrapper: 'relative mt-6 container',
	tableWrapper:
		'pb-3 bg-white dark:bg-darkGray-400 shadow-xl rounded-lg border border-gray-400 dark:border-darkGray-100',
	table: 'w-full',
	tableHeadWrapper: 'border-b border-gray-100 dark:border-darkGray-100',
	tableHead:
		'text-left font-semibold text-xs bg-gray-100 dark:bg-darkGray-400 text-gray-700 dark:text-gray-400 uppercase tracking-widest',
	tableHeadCell: 'p-2',
	tableBody: 'mx-4 text-sm text-gray-800 dark:text-gray-200',
};

export default LeadTable;
