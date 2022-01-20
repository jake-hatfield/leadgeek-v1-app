import React from 'react';

interface ButtonProps {
	width: string | null;
	margin: boolean;
	size: string | null;
	text: string;
	onClick(arg: any): any;
	cta: boolean;
	path: any;
	conditional: any;
	conditionalDisplay: any;
	type?: 'success' | 'warning' | 'danger';
	lightOnly?: boolean;
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
	type,
	lightOnly,
}) => {
	return (
		<button
			onClick={onClick}
			className={`${width || 'w-auto'} ${
				margin ? 'ml-4' : ''
			} flex items-center relative py-2 px-3 rounded-main shadow-sm hover:shadow-md font-semibold border border-300 ${
				size === 'sm' ? 'text-sm' : 'text-xs'
			} ${
				cta
					? lightOnly
						? 'cs-purple-light'
						: type && type === 'danger'
						? 'group cs-red-hover'
						: 'cs-purple'
					: 'text-100 group hover:text-purple-500 dark:hover:text-purple-300 dark:bg-darkGray-300 dark:hover:bg-darkGray-200'
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
					cta
						? ''
						: 'text-100 group-hover:text-purple-500 dark:group-hover:text-purple-300'
				} mx-auto`}
			>
				{text}
			</span>
			{conditional && conditionalDisplay}
		</button>
	);
};

export default Button;
