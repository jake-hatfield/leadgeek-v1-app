import React, { useState } from 'react';

const LeadTable = () => {
	const [favorite, setFavorite] = useState(false);
	return (
		<section className='mt-8'>
			<table className='w-full table-auto shadow-sm'>
				<tr className='bg-gray-100 text-gray-400 text-xs text-left uppercase leading-loose whitespace-no-wrap'>
					<th className='py-2 px-6'>Product Name</th>
					<th className='py-2 px-6'>Category</th>
					<th className='py-2 px-6'>Net Profit</th>
					<th className='py-2 px-6'>Net ROI</th>
					<th className='py-2 px-6 text-right'>Current BSR</th>
					<th className='p-2 text-right'>Sales / Mo</th>
					<th className='py-2 px-6' />
					<th className='py-2 px-6' />
				</tr>
				<tbody className='text-sm text-gray-500 font-medium whitespace-no-wrap'>
					<tr className='border-b-2 border-gray-100'>
						<td className='py-6 pl-6'>Disney Princess Finger Puppets</td>
						<td className='p-6'>Toys & Games</td>
						<td className='p-6 text-gray-600 font-black'>
							<span>$</span>5.76
							<span className='ml-1 text-gray-400 font-semibold uppercase'>
								USD
							</span>
						</td>
						<td className='p-6'>
							65<span>%</span>
						</td>
						<td className='p-6'>
							22,116
							<span>
								(0.008)<span>%</span>
							</span>
						</td>
						<td className='px-2 text-right'>180</td>
						<td className='p-2'>
							<button
								onClick={() => setFavorite(!favorite)}
								className='focus:outline-none'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill={`${favorite ? '#5d55fa' : 'none'}`}
									viewBox='0 0 24 24'
									stroke={`${favorite ? '#5d55fa' : 'currentColor'}`}
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
						<td className='p-6'>Details</td>
					</tr>
				</tbody>
			</table>
		</section>
	);
};

export default LeadTable;
