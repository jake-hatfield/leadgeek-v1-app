import React from 'react';
import Currency from './Currency';
import Percentage from './Percentage';
import Value from './Value';
import Pill from './Pill';
import DetailLink from './DetailLink';
import Function from './Function';

const DropdownRow = ({
	title,
	currency,
	percentage,
	value,
	valueUnit,
	pill,
	pillColor,
	link,
	source,
	isFunction,
	arg1,
	arg2,
}) => {
	return (
		<div className='mt-2 flex items-center justify-between'>
			<div className='text-gray-500'>{title}</div>
			{currency && <Currency currency={currency} />}
			{percentage && <Percentage percentage={percentage} />}
			{value && <Value value={value} valueUnit={valueUnit} />}
			{pill && <Pill pill={pill} pillColor={pillColor} />}
			{link && <DetailLink link={link} source={source} />}
			{isFunction && <Function arg1={arg1} arg2={arg2} />}
		</div>
	);
};

export default DropdownRow;
