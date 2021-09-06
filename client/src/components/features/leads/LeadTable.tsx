import React from 'react';

import LeadRow from './LeadRow';
import NullState from '@components/layout/utils/NullState';
import Spinner from '../../layout/utils/Spinner';

import { Lead } from '@utils/interfaces/leads/Lead';
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
	currentSearchParam: string | null;
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
	currentSearchParam,
}) => {
	return (
		<section className={classes.tableWrapper}>
			{status === 'failed' ? (
				<div>
					There was an error making that request. If this issue persists, please
					contact Leadgeek support.
				</div>
			) : status === 'loading' ? (
				<Spinner
					divWidth={null}
					center={false}
					spinnerWidth={null}
					margin={false}
					text={'Loading leads...'}
				/>
			) : leads.length > 0 ? (
				<table className={classes.table} id='leads'>
					<thead className={classes.tableHeadWrapper}>
						<tr className={classes.tableHead}>
							<th className={classes.tableHeadCell} />
							<th className={classes.tableHeadCell}>Title</th>
							<th className={classes.tableHeadCell}>Category</th>
							<th className={classes.tableHeadCell}>Details</th>
							<th className={classes.tableHeadCell}>Profit</th>
							<th className={classes.tableHeadCell}>ROI</th>
							<th className={classes.tableHeadCell}>BSR</th>
							<th className={classes.tableHeadCell}>Sales</th>
							<th className={classes.tableHeadCell}>Date</th>
							<th className={classes.tableHeadCell} />
						</tr>
					</thead>
					<tbody className={classes.tableBody}>
						{leads.map((lead, i) => (
							<LeadRow
								key={lead._id}
								lead={lead}
								user={user}
								liked={liked}
								archived={archived}
								showDetails={showDetails}
								setShowDetails={setShowDetails}
								lbFee={1}
								unitFee={1}
							/>
						))}
					</tbody>
				</table>
			) : type === 'feed' ? (
				<NullState
					header={'Your Feed is empty'}
					text={
						"No leads were found. Please check that your filters aren't too strict or try refreshing the page."
					}
					path={svgList.feed}
					link={''}
					linkText={''}
				/>
			) : type === 'liked' ? (
				<NullState
					header={'No liked leads were found'}
					text={
						"You haven't liked any leads yet, but you can go to the Feed to check some products out."
					}
					path={svgList.liked}
					link={'/leads'}
					linkText={'Go to the Feed'}
				/>
			) : type === 'archived' ? (
				<NullState
					header={'No archived leads were found'}
					text={
						"You haven't archived any leads yet, but you can go to the Feed to check some products out."
					}
					path={svgList.archived}
					link={'/leads'}
					linkText={'Go to the Feed'}
				/>
			) : type === 'search' && !currentSearchParam ? (
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
					text={
						"No results could be found. Please check that your filters aren't too strict or try refreshing the page."
					}
					path={svgList.search}
					link={''}
					linkText={''}
				/>
			)}
		</section>
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
	tableWrapper: 'relative mt-6 container',
	table: 'w-full table-auto',
	tableHeadWrapper: 'border-b border-gray-200',
	tableHead:
		'text-left font-semibold text-xs text-gray-600 uppercase tracking-widest whitespace-no-wrap',
	tableHeadCell: 'p-2',
	tableBody: 'text-sm text-gray-800',
};

export default LeadTable;
