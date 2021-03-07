import React from 'react';
import LeadRow from './LeadRow';

const LeadTable = ({ loading, leads, showDetails, setShowDetails, user }) => {
	return (
		<section className='mt-8'>
			{loading ? (
				<div>We're loading!</div>
			) : leads.length > 0 ? (
				<table className='w-full table-auto' id='leads'>
					<thead>
						<tr className='bg-gray-100 text-gray-400 text-xs text-left uppercase tracking-widest whitespace-no-wrap'>
							<th className='pl-1' />
							<th className='pl-3' />
							<th className='py-3'>Title</th>
							<th className='pl-6'>Category</th>
							<th className='pl-6 text-right'>Net Profit</th>
							<th className='pl-6 text-right'>Net ROI</th>
							<th className='px-6 text-right'>Current BSR</th>
							<th className='pr-6 text-right'>Sales</th>
							<th className='pr-6' />
						</tr>
					</thead>
					<tbody className='text-gray-600 text-xs lg:text-sm font-medium'>
						{leads.map((lead, i) => (
							<LeadRow
								key={i}
								lead={lead}
								showDetails={showDetails}
								setShowDetails={setShowDetails}
								user={user}
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
