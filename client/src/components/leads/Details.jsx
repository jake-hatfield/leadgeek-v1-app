import React from 'react';

const Details = ({ clearDetailedLead, setShowDetails, currentLead }) => {
	return (
		<div className='w-full h-screen flex absolute right-0'>
			<div
				onClick={() => {
					clearDetailedLead();
					setShowDetails(false);
				}}
				className='w-2/5 bg-gray-900 opacity-75 cursor-pointer'
			/>
			<section className='w-3/5 bg-white'>
				<header className='py-10 bg-gray-100'>
					<div className='container'>
						<div className='flex justify-between'>
							<h4>{currentLead.asin}</h4>
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
						<h1 className='pt-4 text-gray-800 text-3xl font-black'>
							{currentLead.title}
						</h1>
					</div>
				</header>
				<div className='py-10 container'>
					<div>Hello</div>
				</div>
			</section>
		</div>
	);
};

export default Details;
