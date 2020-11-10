import React, { Fragment } from 'react';

const Averages = ({ averages, filteredLeads }) => {
	return (
		<Fragment>
			{filteredLeads.length > 0 && (
				<div className='mt-6'>
					<div className='flex items-center'>
						<h4 className='flex-none text-gray-400 font-semibold text-sm uppercase tracking-widest'>
							Product Averages
						</h4>
						<span className='ml-2 w-full border border-gray-100' />
					</div>
					<article className='mt-4 grid grid-flow-col grid-cols-2 grid-rows-2 xl:grid-cols-4 xl:grid-rows-1 gap-8 xl:gap-4'>
						{averages.map(
							(item) =>
								!Number.isNaN(item.average) && (
									<div
										key={item.title}
										className='inline-block rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out'
									>
										<div className='pt-4 pb-6 px-6 flex items-center'>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												className='p-2 h-10 w-10 flex-shrink-0 rounded-md bg-purple-600 text-white'
											>
												{item.path}
											</svg>
											<div className='ml-4'>
												<div className='flex items-center'>
													<h5 className='text-gray-400 font-bold text-xs uppercase tracking-widest'>
														{item.title}
													</h5>
												</div>
												<p className='text-gray-800 font-black text-lg xl:text-xl'>
													{item.title === 'Net Profit'
														? `$${item.average}`
														: item.title === 'Net ROI'
														? `${item.average}%`
														: item.average}
												</p>
											</div>
										</div>
									</div>
								)
						)}
					</article>
				</div>
			)}
		</Fragment>
	);
};

export default Averages;
