import React, { useEffect } from 'react';

import LeadRow from './LeadRow';

const LeadTable = ({ loading, leads, showDetails, setShowDetails }) => {
	return (
		<section className='mt-8'>
			{loading ? (
				<div>We're loading!</div>
			) : leads.length > 0 ? (
				<table className='w-full table-auto' id='leads'>
					<thead>
						<tr className='bg-gray-100 text-gray-400 text-xs text-left uppercase tracking-widest whitespace-no-wrap'>
							<th className='pl-6' />
							<th className='py-3'>Title</th>
							<th className='pl-6'>Category</th>
							<th className='pl-6 text-right'>Net Profit</th>
							<th className='pl-6 text-right'>Net ROI</th>
							<th className='px-6 text-right'>Current BSR</th>
							<th className='pr-6 text-right'>Sales</th>
						</tr>
					</thead>
					<tbody className='text-gray-500 text-xs lg:text-sm font-medium'>
						{leads.map((lead, i) => (
							<LeadRow
								key={i}
								lead={lead}
								showDetails={showDetails}
								setShowDetails={setShowDetails}
							/>
						))}
					</tbody>
				</table>
			) : (
				<div>No leads to show!</div>
			)}
		</section>
	);
};

export default LeadTable;
