import React, { useRef, useCallback, useState, useEffect } from 'react';

import { getFeedLeads } from '@features/leads/leadsSlice';
import { setPrepFilter, clearPrepFilter } from '@features/filters/filtersSlice';
import { setAlert } from '@features/alert/alertSlice';
import { useOutsideMousedown } from '@utils/utils';
import { useAppSelector, useAppDispatch } from '@utils/hooks';

interface PrepProps {
	prep: boolean;
	setPrep: React.Dispatch<React.SetStateAction<boolean>>;
}

const Prep: React.FC<PrepProps> = ({ prep, setPrep }) => {
	const dispatch = useAppDispatch();

	const user = useAppSelector((state) => state.auth.user);
	const filters = useAppSelector((state) => state.filters);
	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, setPrep, null);
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
	const [prepFee, setPrepFee] = useState<boolean | object>(false);
	const [checked, setChecked] = useState({
		unit: false,
		lb: false,
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value) {
			// if (e.target.value.match(/^\d*\.?\d*$/) !== null) {
			// 	setPrepFee({ ...prepFee, [e.target.name]: e.target.value });
			// } else {
			// 	setAlert(
			// 		'Error creating the filter',
			// 		"The filter can't contain letters or special characters.",
			// 		'danger'
			// 	);
			// }
		}
	};
	return (
		user && (
			<article
				ref={wrapperRef}
				className='absolute top-0 right-0 z-10 w-64 transform translate-y-12 -translate-x-24 pt-4 pb-1 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-900'
			>
				<div className='relative'>
					<header className='pb-2 px-4 flex items-center justify-between'>
						<div>
							<h5 className='inline-block font-bold text-lg'>Prep fees</h5>
						</div>
						<button
							onClick={() => {
								// setPrepFilter(prepFee);
								dispatch(getFeedLeads({ user, page: 1, filters }));
								setPrep((prev) => !prev);
							}}
							className='font-semibold text-sm text-purple-500 rounded-sm hover:text-purple-600 transition-colors duration-100 ease-in-out ring-purple'
						>
							Apply
						</button>
					</header>
					<div className='py-2 px-4 bg-gray-100 font-semibold text-sm text-gray-700'>
						<div className='flex items-center justify-between'>
							<label className='flex items-center justify-between'>
								Weight-based prep fee?
							</label>
							<input
								name='checkbox'
								type='checkbox'
								checked={checked.unit || checked.lb}
								// onChange={() => setChecked((prev) => !prev)}
								className='w-4 p-2 bg-white rounded-md text-sm text-purple-600 ring-purple'
							/>
						</div>
						<div className='mt-3'>
							<label>
								{`${checked ? 'Fee per lb' : 'Fee per unit'} ($)`}
								<input
									name={checked ? 'lb' : 'unit'}
									type='text'
									placeholder={checked ? 'eg. $0.10' : 'eg. $0.95'}
									onChange={onChange}
									className='w-full mt-2 p-2 bg-white rounded-lg text-sm border border-gray-200 shadow-sm placeholder-gray-300 ring-purple'
								/>
							</label>
						</div>
					</div>
					<div className='border-t border-gray-200'>
						<div className='flex justify-end py-2 px-4'>
							<button
								onClick={() => {
									dispatch(clearPrepFilter());
									dispatch(getFeedLeads({ user, page: 1, filters }));
									setPrep((prev) => !prev);
								}}
								className='font-semibold text-sm text-red-500 rounded-sm ring-red'
							>
								Clear
							</button>
						</div>
					</div>
				</div>
			</article>
		)
	);
};

export default Prep;
