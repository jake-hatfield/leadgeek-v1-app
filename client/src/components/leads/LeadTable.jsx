import React from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import LeadRow from './LeadRow';
import Button from '../layout/formField/Button';
import Spinner from '../layout/Spinner';

const NullState = ({ header, text, path, link, linkText }) => {
	return (
		<div className='w-96 text-gray-600'>
			<div className='h-6 w-6'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					className='p-2 bg-gray-100 rounded-lg text-gray-500 shadow-sm'
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
						cta={true}
					/>
				</div>
			)}
		</div>
	);
};

const LeadTable = ({
	leads,
	user,
	liked,
	archived,
	loading,
	showDetails,
	setShowDetails,
	type,
	currentSearchParam,
}) => {
	return (
		<section className='relative mt-10 container'>
			{loading ? (
				<Spinner search={true} />
			) : leads.length > 0 ? (
				<table className='w-full table-auto' id='leads'>
					<thead className='border-b border-gray-200'>
						<tr className='text-left font-semibold text-xs text-gray-600 uppercase tracking-widest whitespace-no-wrap'>
							{/* <th className='p-2' /> */}
							<th className='p-2' />
							<th className='p-2'>Title</th>
							{/* <th className='p-2'>Properties</th> */}
							<th className='p-2'>Category</th>
							<th className='p-2'>Profit</th>
							<th className='p-2'>ROI</th>
							<th className='p-2'>BSR</th>
							<th className='p-2'>Mo. Sales</th>
							<th className='p-2'>Date</th>
							<th className='p-2' />
						</tr>
					</thead>
					<tbody className='text-sm text-gray-800'>
						{leads.map((lead, i) => (
							<LeadRow
								key={lead._id}
								lead={lead}
								user={user}
								liked={liked}
								archived={archived}
								showDetails={showDetails}
								setShowDetails={setShowDetails}
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
					path={
						<path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
					}
				/>
			) : type === 'liked' ? (
				<NullState
					header={'No liked leads were found'}
					text={
						"You haven't liked any leads yet, but you can go to the Feed to check some products out."
					}
					path={
						<path
							fillRule='evenodd'
							d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
							clipRule='evenodd'
						/>
					}
					link={'/leads'}
					linkText={'Go to the Feed'}
				/>
			) : type === 'archived' ? (
				<NullState
					header={'No archived leads were found'}
					text={
						"You haven't archived any leads yet, but you can go to the Feed to check some products out."
					}
					path={<path d='M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z' />}
					link={'/leads'}
					linkText={'Go to the Feed'}
				/>
			) : type === 'search' && !currentSearchParam ? (
				<NullState
					header={'No search results found'}
					text={'Please try a different search query'}
					path={
						<path
							fillRule='evenodd'
							d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
							clipRule='evenodd'
						/>
					}
					link={'/leads'}
					linkText={'Go to the Feed'}
				/>
			) : (
				<NullState
					header={'No results were found'}
					text={
						"No results could be found. Please check that your filters aren't too strict or try refreshing the page."
					}
					path={
						<path
							fillRule='evenodd'
							d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
							clipRule='evenodd'
						/>
					}
				/>
			)}
		</section>
	);
};

LeadTable.propTypes = {
	leads: PropTypes.array.isRequired,
	loading: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	showDetails: PropTypes.bool.isRequired,
	setShowDetails: PropTypes.func.isRequired,
	search: PropTypes.bool,
};

export default LeadTable;
