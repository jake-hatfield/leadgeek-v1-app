import React, { useRef, useCallback, useState, useEffect } from 'react';

import { useOutsideMousedown } from '../../../utils/utils';

// set weight based fee
// set per item fee
// calc difference in row?

const Prep = ({ prep, setPrep }) => {
	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, setPrep);
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

	const [checked, setChecked] = useState(false);

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
				<div className='mt-2 py-2 px-4 flex items-center justify-between bg-gray-100'>
					<label>
						{checked ? 'Fee per lb' : 'Fee per unit'}
						<input
							name='fee'
							type='text'
							placeholder={checked ? 'Fee per lb' : 'Fee per unit'}
							className='w-1/2 p-2 bg-white rounded-lg text-sm border border-gray-200 shadow-sm placeholder-gray-300 focus:outline-none focus:shadow-outline'
						/>
					</label>
					<label>
						<input
							name='checkbox'
							type='checkbox'
							checked={checked}
							onClick={() => setChecked((prev) => !prev)}
							className='w-4 p-2 bg-white rounded-md text-sm border border-gray-200 shadow-sm text-purple-600 focus:outline-none focus:shadow-outline'
						/>
					</label>
				</div>
				<div className='border-t border-gray-200'>
					<div className='flex justify-end py-2 px-4'>
						<button className='font-semibold text-sm text-red-500'>
							Clear
						</button>
					</div>
				</div>
			</div>
		</article>
	);
};

export default Prep;