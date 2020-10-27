import React, { useState } from 'react';

const LeadRow = ({ lead }) => {
	const [favorite, setFavorite] = useState(false);
	const [newLead, setNewLead] = useState(true);
	const disableNewLead = () => setNewLead(false);

	const showDetails = ({ leads }) => {
		disableNewLead();
		alert('More details');
	};

	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	return (
		<tr className='first:border-none border-t-2 border-gray-100'>
			<td className='py-6 pl-6'>
				<span
					className={`p-1 h-3 w-3 flex items-center justify-center ${
						newLead ? 'bg-teal-400' : 'bg-white'
					} rounded-full`}
				/>
			</td>
			<td className='py-6 pl-2'>{lead.name}</td>
			<td className='p-6'>{lead.category}</td>
			<td className='p-6 text-gray-600 font-bold text-right'>
				<span>$</span>
				{lead.netProfit}
				<span className='ml-1 text-gray-400 font-semibold uppercase'>USD</span>
			</td>
			<td className='p-6 text-gray-600 font-bold text-right'>
				{lead.roi}
				<span className='ml-1 text-gray-400 font-semibold'>%</span>
			</td>
			<td className='px-2 text-gray-600 font-bold text-right'>
				{numberWithCommas(lead.currentBSR)}
				<span className='ml-1 text-gray-400 font-normal'>
					(0.008)
					<span className='ml-1 text-gray-400 font-semibold'>%</span>
				</span>
			</td>
			<td className='px-2 text-gray-600 font-bold text-right'>
				{lead.monthlySales}
			</td>
			<td className='py-2 px-4 text-center text-gray-400'>
				<button
					onClick={() => setFavorite(!favorite)}
					className='rounded-md focus:outline-none align-middle'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill={`${favorite ? '#9FB3C8' : 'none'}`}
						viewBox='0 0 24 24'
						stroke={`${favorite ? '#9FB3C8' : 'currentColor'}`}
						className='h-6 w-6'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
						/>
					</svg>
				</button>
			</td>
			<td className='pr-6 text-right'>
				<button
					onClick={showDetails}
					className='rounded-md text-purple-600 font-semibold focus:outline-none focus:shadow-outline'
				>
					Details
				</button>
			</td>
		</tr>
	);
};

export default LeadRow;
