import React from 'react';

interface BadgeProps {
	title: string;
	description?: string;
	alignment: 'top' | 'bottom' | 'left' | 'right';
	edge: 'left' | 'right' | null;
}

const Badge: React.FC<BadgeProps> = ({
	title,
	description,
	alignment,
	edge,
}) => {
	return (
		<div
			className={`absolute z-40 ${
				edge === 'left' ? 'left-0' : edge === 'right' ? 'right-0' : 'left-1/2'
			} flex items-center p-2 cs-darkGray rounded-main shadow-md text-xs whitespace-nowrap transform ${
				alignment === 'top'
					? ''
					: alignment === 'bottom'
					? ' translate-y-4'
					: ''
			} ${edge === null ? '-translate-x-1/2' : ''}`}
		>
			<span>{title}</span>
			<span className='ml-2 py-0.5 px-1 bg-gray-100 rounded-md font-semibold text-gray-600 text-xs'>
				{description}
			</span>
		</div>
	);
};

export default Badge;
