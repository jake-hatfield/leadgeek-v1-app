import React from 'react';

import { Preloader, Oval } from 'react-preloader-icon';

interface SpinnerProps {
	divWidth: string | null;
	spinnerWidth: string | null;
	margin: boolean;
	search: boolean;
	text: string | null;
}

const Spinner: React.FC<SpinnerProps> = ({
	divWidth,
	spinnerWidth,
	margin,
	search,
	text,
}) => {
	return (
		<div
			className={`${
				divWidth ? divWidth : ''
			} flex flex-col items-center justify-center ${margin ? 'mt-16' : ''}`}
		>
			<Preloader
				use={Oval}
				size={spinnerWidth === 'sm' ? 20 : spinnerWidth === 'md' ? 35 : 45}
				strokeWidth={6}
				strokeColor='#5d55fa'
				duration={500}
			/>
			{search && (
				<div className='mt-8 font-semibold text-gray-600'>
					{text || 'Loading results...'}
				</div>
			)}
		</div>
	);
};

export default Spinner;
