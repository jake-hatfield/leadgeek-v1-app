import React from 'react';

// packages
import { Preloader, Oval } from 'react-preloader-icon';

// utils
import { useDarkMode } from '@hooks/hooks';

interface SpinnerProps {
	divWidth: string | null;
	center: boolean;
	spinnerWidth: string | null;
	margin: boolean;
	text: string | null;
}

const Spinner: React.FC<SpinnerProps> = ({
	divWidth,
	center,
	spinnerWidth,
	margin,
	text,
}) => {
	const [colorTheme] = useDarkMode();

	return (
		<div
			className={`${divWidth ? divWidth : ''} ${
				center
					? 'absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'
					: ''
			} flex flex-col items-center justify-center ${margin ? 'mt-16' : ''}`}
		>
			<Preloader
				use={Oval}
				size={spinnerWidth === 'sm' ? 20 : spinnerWidth === 'md' ? 35 : 45}
				strokeWidth={6}
				strokeColor={colorTheme === 'dark' ? '#5d55fa' : '#A2A5FC'}
				duration={500}
			/>
			{text && (
				<div className='mt-8 font-semibold text-100'>
					{text || 'Loading results...'}
				</div>
			)}
		</div>
	);
};

export default Spinner;
