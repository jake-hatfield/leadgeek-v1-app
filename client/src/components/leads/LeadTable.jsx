import React, { useEffect } from 'react';

import LeadRow from './LeadRow';

const LeadTable = ({ loading, getLeads, leads }) => {
	useEffect(() => {
		!loading && getLeads();
		return () => {};
	}, [loading, getLeads]);

	return (
		<section className='mt-8'>
			<table className='w-full table-auto' id='leads'>
				<thead>
					<tr className='bg-gray-100 text-gray-400 text-xs text-left uppercase tracking-widest whitespace-no-wrap'>
						<th className='pl-6' />
						<th className='py-3'>Product Name</th>
						<th className='pl-6'>Category</th>
						<th className='pl-6 text-right'>Net Profit</th>
						<th className='pl-6 text-right'>Net ROI</th>
						<th className='px-6 text-right'>Current BSR</th>
						<th className='pr-6 text-right'>Sales</th>
					</tr>
				</thead>
				<tbody className='text-gray-500 text-xs lg:text-sm font-medium'>
					{leads.map((lead, i) => (
						<LeadRow key={i} lead={lead} />
					))}
				</tbody>
			</table>
		</section>
	);
};

export default LeadTable;
