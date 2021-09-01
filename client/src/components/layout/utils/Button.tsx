import React from 'react';

interface ButtonProps {
	text: string;
	onClick(arg: any): any;
	width: string | null;
	margin: boolean;
	size: string | null;
	cta: boolean;
	path: any;
	conditional: any;
	conditionalDisplay: any;
}

const Button: React.FC<ButtonProps> = ({
	text,
	onClick,
	width,
	margin,
	size,
	cta,
	path,
	conditional,
	conditionalDisplay,
}) => {
	return (
		<button
			onClick={onClick}
			className={`${width || 'w-auto'} ${
				margin ? 'ml-4' : ''
			} flex items-center relative py-2 px-3 rounded-lg shadow-sm hover:shadow-md border-main ${
				size === 'sm' ? 'text-sm' : 'text-xs'
			} font-semibold ${
				cta
					? 'bg-purple-500 hover:bg-purple-600 text-white'
					: 'text-gray-500 hover:text-gray-700'
			} transition-main ring-purple`}
		>
			{path && (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					className='svg-sm'
				>
					{path}
				</svg>
			)}
			<span
				className={`${path ? 'ml-2' : ''} ${
					cta ? '' : 'text-gray-600'
				} mx-auto`}
			>
				{text}
			</span>
			{conditional && conditionalDisplay}
		</button>
	);
};

export default Button;
