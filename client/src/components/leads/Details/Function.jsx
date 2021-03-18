import React from 'react';
import { calculateBSR } from '../../../utils/utils';

const Function = ({ arg1, arg2 }) => {
	return (
		<div className='font-semibold text-gray-600'>
			{calculateBSR(arg1, arg2)}
			<span className='ml-1 text-gray-400 font-semibold'>%</span>
		</div>
	);
};

export default Function;
