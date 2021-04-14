import React from 'react';

import PropTypes from 'prop-types';

const Button = ({
	text,
	onClick,
	ref,
	conditional,
	conditionalDisplay,
	margin,
	path,
	cta,
}) => {
	return (
		<button
			onClick={onClick}
			ref={ref}
			className={`${
				margin && 'ml-4'
			} relative py-2 px-3 flex items-center rounded-lg shadow-sm hover:shadow-md text-sm font-semibold ${
				cta
					? 'bg-purple-500 hover:bg-purple-600 text-white'
					: 'text-gray-500 hover:text-gray-600'
			}  transition duration-100 ease-in-out focus:outline-none focus:shadow-outline`}
		>
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
			{conditional && conditionalDisplay}
		</button>
	);
};

Button.propTypes = {
	text: PropTypes.string.isRequired,
	onClick: PropTypes.func,
	ref: PropTypes.any,
	conditional: PropTypes.any,
	conditionalDisplay: PropTypes.object,
	margin: PropTypes.bool,
	path: PropTypes.object,
	cta: PropTypes.bool,
};

export default Button;
