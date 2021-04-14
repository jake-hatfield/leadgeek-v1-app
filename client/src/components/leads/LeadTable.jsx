import React from 'react';

import PropTypes from 'prop-types';
import LeadRow from './LeadRow';
import Spinner from '../layout/Spinner';

const LeadTable = ({
	leads,
	loading,
	user,
	showDetails,
	setShowDetails,
	search,
}) => {
	return (
		<section className='relative mt-10 container'>
			{loading ? (
				<Spinner search={true} />
			) : leads.length > 0 ? (
				<table className='w-full table-auto' id='leads'>
					<thead className='border-b border-gray-200'>
						<tr className='text-left font-semibold text-xs text-gray-600 uppercase tracking-widest whitespace-no-wrap'>
							<th className='p-2' />
							<th className='p-2' />
							<th className='p-2'>Title</th>
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
								showDetails={showDetails}
								setShowDetails={setShowDetails}
								user={user}
							/>
						))}
					</tbody>
				</table>
			) : search ? (
				<div>No search results.</div>
			) : (
				<div>No leads to show!</div>
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
