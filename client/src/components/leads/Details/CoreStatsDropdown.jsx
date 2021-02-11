import React, { useState } from 'react';
import DropdownRow from './DropdownRow';

const CoreStatsDropdown = ({ header, obj, defaultOpen }) => {
	const [dropdown, toggleDropdown] = useState(defaultOpen || false);
	const coreStats = obj.coreStats;
	return (
		<div className='mb-8'>
			<button
				onClick={() => toggleDropdown(!dropdown)}
				className='w-full flex items-end justify-between rounded-md focus:outline-none'
			>
				<h4 className='text-2xl leading-none font-semibold text-gray-700'>
					{header}
				</h4>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					className='h-5 w-5 text-gray-300'
				>
					{dropdown ? (
						<path
							fillRule='evenodd'
							d='M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z'
							clipRule='evenodd'
						/>
					) : (
						<path
							fillRule='evenodd'
							d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
							clipRule='evenodd'
						/>
					)}
				</svg>
			</button>
			<div className='mt-2 border-t-2 border-gray-100' />
			{dropdown && (
				<div className='mt-4'>
					{coreStats.netProfit && (
						<DropdownRow title='Net profit' currency={coreStats.netProfit} />
					)}
					{coreStats.roi && (
						<DropdownRow title='ROI' percentage={coreStats.roi} />
					)}
					{coreStats.monthlySales && (
						<DropdownRow
							title='Estimated sales'
							value={coreStats.monthlySales}
							valueUnit='/ mo'
						/>
					)}
					{coreStats.currentBSR && (
						<DropdownRow
							title='BSR %'
							isFunction
							arg1={coreStats.currentBSR}
							arg2={obj.category}
						/>
					)}
					{coreStats.currentBSR && (
						<DropdownRow title='Current BSR' value={coreStats.currentBSR} />
					)}
				</div>
			)}
		</div>
	);
};

export default CoreStatsDropdown;
