import React from 'react';

import PropTypes from 'prop-types';
import { Preloader, Oval } from 'react-preloader-icon';

const Spinner = ({ divWidth, spinnerWidth, noMargin, search, text }) => {
	return (
		<div
			className={`${divWidth} flex flex-col items-center justify-center ${
				!noMargin && 'mt-12'
			}`}
		>
			<Preloader
				use={Oval}
				size={spinnerWidth === 'sm' ? 20 : spinnerWidth === 'md' ? 35 : 45}
				strokeWidth={6}
				strokeColor='#5d55fa'
				duration={500}
				// style={{ position: 'absolute', left: '50%', top: '50%' }}
			/>
			{search && (
				<div className='mt-8 font-semibold text-gray-600'>
					{text || 'Loading results...'}
				</div>
			)}
		</div>
	);
};

Spinner.propTypes = {
	search: PropTypes.bool,
	text: PropTypes.string,
};

export default Spinner;
