import React, { useState } from 'react';

import DropdownRow from './DropdownRow';

const Dropdown = ({ header, obj, defaultOpen }) => {
	const [dropdown, toggleDropdown] = useState(defaultOpen || false);
	let type;
	if (header.toLowerCase() == 'core stats') {
		type = 'coreStats';
	}
	// let values = Object.keys(obj).map((k) => obj[k]);
	return (
		<div>
			<button onClick={() => toggleDropdown(!dropdown)}>
				<h4>{header}</h4>
			</button>
			{type === 'coreStats' && dropdown && (
				<div>
					{obj.netProfit && (
						<DropdownRow title={'Net profit'} value={obj.netProfit} />
					)}
					{obj.roi && <DropdownRow title={'Net ROI'} value={obj.roi} />}
					{obj.currentBSR && (
						<DropdownRow title={'Current BSR'} value={obj.currentBSR} />
					)}
					{obj.monthlySales && (
						<DropdownRow title={'Monthly sales'} value={obj.monthlySales} />
					)}
				</div>
			)}
		</div>
	);
};

export default Dropdown;
