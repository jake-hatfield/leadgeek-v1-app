import React, { useState } from 'react';

const Tools = ({ tool, showMenu }) => {
	const [openTool, setOpenTool] = useState(false);
	const [hover, setHover] = useState(false);
	return (
		<div v-for='item in items' className='first:mt-2 mt-1'>
			<button
				onClick={() => setOpenTool(!openTool)}
				onMouseEnter={() => setHover(!hover)}
				onMouseLeave={() => setHover(false)}
				className={`p-2 w-full ${!showMenu && 'relative'} rounded-md ${
					openTool && 'bg-gray-100'
				} hover:bg-gray-100 hover:shadow-inner transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline`}
			>
				{!showMenu && hover && (
					<div className='p-2 absolute left-0 transform -translate-y-2 translate-x-12 rounded-md bg-gray-800 shadow-md text-white text-sm whitespace-no-wrap'>
						{tool.title}
					</div>
				)}
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
						{showMenu && <span className='ml-2'>{tool.title}</span>}
					</span>
					{showMenu && (
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
					)}
				</div>
				{openTool && (
					<div className='mt-2 text-left'>Hewwo uwu {tool.title}</div>
				)}
			</button>
		</div>
	);
};

export default Tools;
