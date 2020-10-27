import React from 'react';

import LeadRow from './LeadRow';

const LeadTable = () => {
	const leads = [
		{
			name: 'Revlon 2-Step Mascara',
			category: 'Beauty & Personal Care',
			netProfit: '5.76',
			roi: '114',
			currentBSR: '22110006',
			monthlySales: '14',
		},
		{
			name: 'Disney Princess Finger Puppets',
			category: 'Toys & Games',
			netProfit: '12.10',
			roi: '65',
			currentBSR: '22116',
			monthlySales: '180',
		},
	];
	return (
		<section className='mt-8'>
			<table className='w-full table-auto shadow-md' id='leads'>
				<thead>
					<tr className='bg-gray-100 text-gray-400 text-xs text-left uppercase tracking-widest whitespace-no-wrap'>
						<th className='px-2' />
						<th className='py-3 pr-6'>Product Name</th>
						<th className='px-6'>Category</th>
						<th className='px-6 text-right'>Net Profit</th>
						<th className='px-6 text-right'>Net ROI</th>
						<th className='px-2 text-right'>Current BSR</th>
						<th className='px-2 text-right'>Mo. Sales</th>
						<th className='px-6' />
						<th className='px-6' />
					</tr>
				</thead>
				<tbody className='text-gray-500 font-medium whitespace-no-wrap'>
					{leads.map((lead) => (
						<LeadRow lead={lead} />
					))}
				</tbody>
			</table>
		</section>
	);
};

export default LeadTable;
