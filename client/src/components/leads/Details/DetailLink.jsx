import React from 'react';

const DetailLink = ({ link, source }) => {
	return (
		<div>
			<a
				href={link}
				target='_blank'
				rel='noopener noreferrer'
				className='font-semibold text-purple-600 hover:underline'
			>
				{source || 'Amazon'}
			</a>
		</div>
	);
};

export default DetailLink;
