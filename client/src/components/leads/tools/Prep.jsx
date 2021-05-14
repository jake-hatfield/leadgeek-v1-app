import React, { useRef, useCallback, useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLeads } from 'redux/actions/leads';
import { setPrepFilter, clearPrepFilter } from 'redux/actions/filters';
import { setAlert } from 'redux/actions/alert';
import { useOutsideMousedown } from 'utils/utils';

const Prep = ({
	prep,
	setPrep,
	user,
	filters,
	setPrepFilter,
	clearPrepFilter,
	getLeads,
}) => {
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
	const [prepFee, setPrepFee] = useState(false);
	const [checked, setChecked] = useState({
		unit: null,
		lb: null,
	});

	const onChange = (e) => {
		if (e.target.value) {
			if (e.target.value.match(/^\d*\.?\d*$/) !== null) {
				setPrepFee({ ...prepFee, [e.target.name]: e.target.value });
			} else {
				setAlert(
					'Error creating the filter',
					"The filter can't contain letters or special characters.",
					'danger'
				);
			}
		}
	};
	return (
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
							setPrepFilter(prepFee);
							getLeads(user, 1, filters);
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
							checked={checked}
							onChange={() => setChecked((prev) => !prev)}
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
								clearPrepFilter();
								getLeads(user, 1, filters);
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
	);
};

Prep.propTypes = {
	prep: PropTypes.bool.isRequired,
	setPrep: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	filters: PropTypes.object.isRequired,
	setPrepFilter: PropTypes.func.isRequired,
	clearPrepFilter: PropTypes.func.isRequired,
	getLeads: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
	const { prep, setPrep } = ownProps;
	const { user } = state.auth;
	const { filters } = state;
	return { prep, setPrep, user, filters };
};

export default connect(mapStateToProps, {
	setPrepFilter,
	clearPrepFilter,
	getLeads,
})(Prep);
