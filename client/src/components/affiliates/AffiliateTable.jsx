import React from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AffiliateRow from './AffiliateRow';
import Button from '../layout/utils/Button';
import Spinner from '../layout/utils/Spinner';

const NullState = ({ header, text, path, link, linkText }) => {
	return (
		<div className={nullStateClasses.nullStateWrapper}>
			<div className={nullStateClasses.svgWrapper}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					className={nullStateClasses.svg}
				>
					{path}
				</svg>
			</div>
			<h3 className='mt-8 font-bold text-lg text-gray-900'>{header}</h3>
			<p className='mt-2'>{text}</p>
			{link ? (
				<Link
					to={link}
					className='mt-4 inline-block py-2 px-3 rounded-lg shadow-sm hover:shadow-md text-sm font-semibold bg-purple-500 hover:bg-purple-600 text-white transition duration-100 ease-in-out ring-purple'
				>
					{linkText}
				</Link>
			) : (
				<div className='mt-4'>
					<Button
						text={'Reload the page'}
						onClick={() => window.location.reload()}
						size={'sm'}
						cta={true}
					/>
				</div>
			)}
		</div>
	);
};

const nullStateClasses = {
	nullStateWrapper: 'w-96 text-gray-600',
	svgWrapper: 'svg-base',
	svg: 'p-2 bg-gray-100 rounded-lg text-gray-500 shadow-sm',
};

const AffiliateTable = ({
	payments,
	user,
	liked,
	archived,
	loading,
	showDetails,
	setShowDetails,
	type,
	currentSearchParam,
}) => {
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

	return (
		<section className={classes.tableWrapper}>
			{loading ? (
				<Spinner />
			) : payments.length > 0 ? (
				<table className={classes.table} id='payments'>
					<thead className={classes.tableHeadWrapper}>
						<tr className={classes.tableHead}>
							<th className={classes.tableHeadCell}>Transaction</th>
							<th className={classes.tableHeadCell}>Date</th>
							<th className={classes.tableHeadCell}>Plan</th>
							<th className={classes.tableHeadCell}>Commission</th>
							<th className={classes.tableHeadCell}>Paid</th>
						</tr>
					</thead>
					<tbody className={classes.tableBody}>
						{payments.map((payment, i) => (
							<AffiliateRow
								key={payment._id}
								lead={payment}
								user={user}
								liked={[]}
								archived={[]}
								showDetails={showDetails}
								setShowDetails={setShowDetails}
							/>
						))}
					</tbody>
				</table>
			) : (
				<NullState
					header={'No affiliate payments'}
					text={`You don't have any affiliate comissions yet. If you think this is an error, please contact support.`}
					path={svgList.feed}
				/>
			)}
		</section>
	);
};

const classes = {
	tableWrapper: 'w-full relative mt-4',
	table: 'w-full table-auto',
	tableHeadWrapper: 'border-b border-gray-200',
	tableHead:
		'text-left font-semibold text-xs text-gray-600 uppercase tracking-widest whitespace-no-wrap',
	tableHeadCell: 'p-2',
	tableBody: 'text-sm text-gray-800',
};

AffiliateTable.propTypes = {
	leads: PropTypes.array.isRequired,
	loading: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	showDetails: PropTypes.bool.isRequired,
	setShowDetails: PropTypes.func.isRequired,
	search: PropTypes.bool,
};

export default AffiliateTable;
