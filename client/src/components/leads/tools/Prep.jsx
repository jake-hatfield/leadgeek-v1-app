import React, { useRef, useCallback, useEffect } from 'react';

import { useOutsideMousedown } from '../../../utils/utils';

// set weight based fee
// set per item fee
// calc difference in row?

const Prep = ({ prep, setPrep }) => {
	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, setPrep);
	// close modal on esc key
	const keyPress = useCallback(
		(e) => {
			if (e.key === 'Escape' && prep) {
				setPrep(false);
			}
		},
		[setPrep, prep]
	);
	useEffect(() => {
		document.addEventListener('keydown', keyPress);
		return () => document.removeEventListener('keydown', keyPress);
	}, [keyPress]);
	return (
		<article
			ref={wrapperRef}
			className='absolute top-0 right-0 z-10 w-64 transform translate-y-10 -translate-x-24 pt-4 pb-2 rounded-lg bg-white shadow-lg text-gray-900'
		>
			<div className='relative'>
				<header className='pb-2 px-4 flex items-center justify-between'>
					<div>
						<h5 className='inline-block font-bold text-lg'>Prep fees</h5>
					</div>
					<button className='font-semibold text-sm text-purple-600 hover:text-gray-700 transition-colors duration-100 ease-in-out'>
						Apply
					</button>
				</header>
				<div className='mt-2 px-4 flex items-center justify-between'>
					<input
						name='min'
						type='checkbox'
						placeholder={'Min'}
						className='w-1/2 p-2 bg-white rounded-lg text-sm border border-gray-200 shadow-sm placeholder-gray-300 focus:outline-none focus:shadow-outline'
					/>
					<input
						name='min'
						type='text'
						placeholder={'Min'}
						className='w-1/2 p-2 bg-white rounded-lg text-sm border border-gray-200 shadow-sm placeholder-gray-300 focus:outline-none focus:shadow-outline'
					/>
				</div>
				<div className='border-t border-gray-200'>
					<div className='flex justify-end py-2 px-4'>
						<button className='font-semibold text-sm text-red-500'>
							Clear all
						</button>
					</div>
				</div>
			</div>
		</article>
	);
};

export default Prep;
