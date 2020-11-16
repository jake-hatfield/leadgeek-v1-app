import React from 'react';

import { numberWithCommas } from '../../layout/utils';

const Value = ({ value, valueUnit }) => {
	return (
		<div className='font-semibold text-gray-600'>
			{numberWithCommas(value)}
			<span className='ml-1 text-gray-400 font-semibold'>{valueUnit}</span>
		</div>
	);
};

export default Value;
