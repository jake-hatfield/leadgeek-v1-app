import React from 'react';

const Button = ({ path, text, onClick }) => {
	return (
		<button className='ml-4 py-2 px-3 flex items-center rounded-lg shadow-sm hover:shadow-md text-sm font-semibold hover:text-gray-500 transition-all duration-100 ease-in-out focus:outline-none focus:shadow-outline'>
			{path && (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					className='h-4 w-4'
				>
					{path}
				</svg>
			)}
			<span className='ml-2'>{text}</span>
		</button>
	);
};

export default Button;
