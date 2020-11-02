import React, { Fragment, useState } from 'react';

const LeadRow = ({ lead }) => {
	const [favorite, setFavorite] = useState(false);
	// show/hide additional details
	const [detailedView, setDetailedView] = useState(false);

	const handleShowDetails = ({ leads }) => {
		setDetailedView(!detailedView);
	};

	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	return (
		<Fragment>
			<tr
				className='rounded-md last:border-none border-b-2 border-gray-100 hover:bg-gray-100 hover:shadow-sm transition-all duration-200 cursor-pointer'
				onClick={handleShowDetails}
			>
				<td className='py-2 px-4 text-center text-gray-400'>
					<button
						onClick={() => setFavorite(!favorite)}
						className='rounded-md focus:outline-none align-middle'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill={`${favorite ? '#5d55fa' : 'none'}`}
							viewBox='0 0 24 24'
							stroke={`${favorite ? '#5d55fa' : 'currentColor'}`}
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
				<td className='py-6'>{lead.name}</td>
				<td className='pl-6'>{lead.category}</td>
				<td className='pl-6 text-gray-600 font-bold text-right'>
					<span>$</span>
					{lead.netProfit}
					<span className='ml-1 text-gray-400 font-semibold uppercase'>
						USD
					</span>
				</td>
				<td className='pl-6 text-gray-600 font-bold text-right'>
					{lead.roi}
					<span className='ml-1 text-gray-400 font-semibold'>%</span>
				</td>
				<td className='px-6 text-gray-600 font-bold text-right'>
					{numberWithCommas(lead.currentBSR)}
					<span className='ml-1 text-gray-400 font-normal'>
						(0.008)
						<span className='ml-1 text-gray-400 font-semibold'>%</span>
					</span>
				</td>
				<td className='pr-6 text-gray-600 font-bold text-right'>
					{numberWithCommas(lead.monthlySales)}
				</td>
			</tr>
			{detailedView && (
				<div className='px-6 w-full inline-block'>
					{numberWithCommas(lead.monthlySales)}
				</div>
			)}
		</Fragment>
	);
};

export default LeadRow;
