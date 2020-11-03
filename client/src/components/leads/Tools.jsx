import React, { useState } from 'react';

const Tools = ({ tool }) => {
	const [openTool, setOpenTool] = useState(false);
	return (
		<div v-for='item in items' className='first:mt-2 mt-1'>
			<button
				onClick={() => setOpenTool(!openTool)}
				className={`p-2 w-full rounded-md ${
					openTool && 'bg-gray-100'
				} hover:bg-gray-100 transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline`}
			>
				<div className='flex items-center justify-between'>
					<span className='flex items-center'>
						<span className='text-center text-gray-300'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='currentColor'
								className='h-6 w-6'
							>
								{tool.path}
							</svg>
						</span>
						<span className='ml-2'>{tool.title}</span>
					</span>
					<span>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='h-4 w-4 text-gray-300'
						>
							{openTool ? (
								<path
									fillRule='evenodd'
									d='M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z'
									clipRule='evenodd'
								/>
							) : (
								<path
									fillRule='evenodd'
									d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
									d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
									clipRule='evenodd'
								/>
							)}
						</svg>
					</span>
				</div>
				{openTool && (
					<div className='mt-2 text-left'>Hewwo uwu {tool.title}</div>
				)}
			</button>
		</div>
	);
};

export default Tools;
