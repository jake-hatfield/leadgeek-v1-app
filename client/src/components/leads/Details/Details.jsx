import React, { useState } from 'react';
import { truncate } from '../../layout/utils';

import CoreStatsDropdown from './CoreStatsDropdown';
import SummaryDropdown from './SummaryDropdown';
import InsightsDropdown from './InsightsDropdown';

const Details = ({ clearDetailedLead, setShowDetails, currentLead }) => {
	const [fullTitle, toggleFullTitle] = useState(false);
	return (
		<div className='w-full h-screen flex justify-between absolute right-0'>
			<div
				onClick={() => {
					clearDetailedLead();
					setShowDetails(false);
				}}
				className='hidden lg:block lg:w-1/4 xl:w-2/5 max-w-full relative bg-gray-900 opacity-75 cursor-pointer'
			/>
			<section className='w-full lg:w-3/4 xl:w-3/5 relative z-10 bg-white'>
				<header className='container'>
					<div className='pt-10 pb-6 flex justify-between border-b-2 border-gray-100'>
						<div className='relative'>
							<h3
								onMouseEnter={() => toggleFullTitle(true)}
								onMouseLeave={() => toggleFullTitle(false)}
								className='text-gray-800 text-2xl lg:text-3xl font-extrabold leading-none cursor-pointer'
							>
								{truncate(currentLead.title, 40)}
							</h3>
							{fullTitle && (
								<div className='p-2 absolute top-0 transform translate-y-10 rounded-md shadow-md bg-gray-800 text-white text-sm'>
									{currentLead.title}
								</div>
							)}
						</div>
						<div className='flex'>
							<button className='rounded-md focus:outline-none focus:shadow-outline'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
									className='h-6 w-6 text-gray-600'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
									/>
								</svg>
							</button>
							<button
								onClick={() => {
									clearDetailedLead();
									setShowDetails(false);
								}}
								className='ml-6 rounded-md focus:outline-none focus:shadow-outline'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 20 20'
									fill='currentColor'
									className='h-6 w-6 text-gray-600'
								>
									<path
										fillRule='evenodd'
										d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
										clipRule='evenodd'
									/>
								</svg>
							</button>
						</div>
					</div>
				</header>
				<section className='py-10 flex container'>
					<article className='lg:w-2/5'>
						<SummaryDropdown
							header='Summary'
							obj={currentLead}
							defaultOpen={true}
						/>
						<CoreStatsDropdown
							header='Core stats'
							obj={currentLead}
							defaultOpen={true}
						/>
						<InsightsDropdown header='Historic insights' obj={currentLead} />
					</article>
					<div className='w-3/5'>
						<img
							src={currentLead.img}
							alt={currentLead.title}
							className='px-48'
						/>
					</div>
				</section>
			</section>
		</div>
	);
};

export default Details;
