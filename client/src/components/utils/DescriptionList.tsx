import React from 'react';

interface DescriptionListProps {
	title: string;
	value: JSX.Element;
	utility?: JSX.Element;
	action?: JSX.Element;
}

const DescriptionList: React.FC<DescriptionListProps> = ({
	title,
	value,
	utility,
	action,
}) => {
	return (
		<div className='relative flex items-center pb-2 last:pb-0 border-b border-100 last:border-none card-padding-x'>
			<dt className='w-2/5 text-100'>{title}</dt>
			<div className='flex items-center w-2/5 text-300'>
				<dd>{value}</dd>
				{utility && utility}
			</div>
			{action && <div className='w-1/5 text-right'>{action}</div>}
		</div>
	);
};

export default DescriptionList;
