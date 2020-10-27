import React, { useState } from 'react';

const LeadTable = () => {
	const [favorite, setFavorite] = useState(false);
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
						<th className='px-2 text-right'>Sales / Mo</th>
						<th className='px-6' />
						<th className='px-6' />
					</tr>
				</thead>
				<tbody className='text-sm text-gray-500 font-medium whitespace-no-wrap'>
					<tr className='first:border-none border-t-2 border-gray-100'>
						<td className='py-6 pl-6'>
							<span className='p-1 h-3 w-3 flex items-center justify-center bg-teal-200 rounded-full font-bold text-teal-500' />
						</td>
						<td className='py-6'>Disney Princess Finger Puppets</td>
						<td className='p-6'>Beauty & Personal Care</td>
						<td className='p-6 text-gray-600 font-black text-right'>
							<span>$</span>5.76
							<span className='ml-1 text-gray-400 font-semibold uppercase'>
								USD
							</span>
						</td>
						<td className='p-6 text-gray-600 font-black text-right'>
							65<span className='ml-1 text-gray-400 font-semibold'>%</span>
						</td>
						<td className='px-2 text-gray-600 font-black text-right'>
							22,116
							<span className='ml-1 text-gray-400 font-normal'>
								(0.008)
								<span className='ml-1 text-gray-400 font-semibold'>%</span>
							</span>
						</td>
						<td className='px-2 text-gray-600 font-black text-right'>180</td>
						<td className='py-2 px-4 text-center text-gray-400'>
							<button
								onClick={() => setFavorite(!favorite)}
								className='focus:outline-none align-middle'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill={`${favorite ? '#9FB3C8' : 'none'}`}
									viewBox='0 0 24 24'
									stroke={`${favorite ? '#9FB3C8' : 'currentColor'}`}
									className='h-5 w-5'
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
						<td className='pr-6'>
							<button className='text-purple-600 font-semibold'>Details</button>
						</td>
					</tr>
				</tbody>
			</table>
		</section>
	);
};

export default LeadTable;
