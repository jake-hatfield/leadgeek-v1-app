import React from 'react';
import { truncate } from '../../layout/utils';

import Dropdown from './Dropdown';

const Details = ({ clearDetailedLead, setShowDetails, currentLead }) => {
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
						<h4 className='text-gray-800 text-2xl lg:text-3xl font-extrabold leading-none'>
							{truncate(currentLead.title, 40)}
						</h4>
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
				<div className='py-10 container'>
					<article>
						<header>
							<Dropdown header='Core stats' obj={currentLead.coreStats} />
						</header>
					</article>
				</div>
			</section>
		</div>
	);
};

export default Details;
