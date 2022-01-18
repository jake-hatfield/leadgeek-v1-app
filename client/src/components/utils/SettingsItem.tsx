import React from 'react';

interface SettingsItemProps {
	title: string;
	description: string | null;
	action: JSX.Element;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
	title,
	description,
	action,
}) => {
	return (
		<div className='mt-4 card-padding-x center-between text-200'>
			<div className=''>
				<div className='font-semibold'>{title}</div>
				{description && (
					<div className='mt-1 text-100 text-sm'>{description}</div>
				)}
			</div>
			{action}
		</div>
	);
};

export default SettingsItem;
