import React, { useState, useRef, useEffect } from 'react';

import { connect } from 'react-redux';
import { setAlert } from '../../../redux/actions/alert';
import {
	setMinMaxFilter,
	clearMinMaxFilter,
} from '../../../redux/actions/filters';
import { useOutsideMouseup } from '../../../utils/utils';

const FilterItem = ({
	title,
	subtitle,
	subtitleValue,
	minDefault,
	maxDefault,
	val,
	setAlert,
	setMinMaxFilter,
	clearMinMaxFilter,
}) => {
	const [toggleItem, setToggleItem] = useState(false);
	const wrapperRef = useRef(null);
	useOutsideMouseup(wrapperRef, setToggleItem);
	const [categories] = useState([
		'Appliances',
		'Arts. Crafts, & Sewing',
		'Automotive Parts & Accessories',
		'Baby',
		'Beauty & Personal Care',
		'Books',
		'CDs & Vinyl',
		'Cell Phones & Accessories',
		'Clothing, Shoes & Jewelry',
		'Computers',
		'Electronics',
		'Garden & Outdoor',
		'Grocery & Gourmet Food',
		'Handmade',
		'Health,Household & Baby Care',
		'Home & Kitchen',
		'Industrial & Scientific',
		'Luggage & Travel Gear',
		'Movies & TV',
		'Musical Instruments',
		'Office Products',
		'Pet Supplies',
		'Sports & Outdoors',
		'Tools & Home Improvement',
		'Toys & Games',
		'Video Games',
	]);
	// todos:
	// set # of filters on button
	// set showing # of filtered products of # of total products
	const [filterData, setFilterData] = useState({
		min: '' || minDefault,
		max: '' || maxDefault,
	});
	const onChange = (e) => {
		if (e.target.value) {
			if (e.target.value.match(/^\d*\.?\d*$/) !== null) {
				setFilterData({ ...filterData, [e.target.name]: e.target.value });
			} else {
				setAlert(
					'Filter cannot contain letters or special characters.',
					'danger'
				);
			}
		}
	};
	const [selectValue, setSelectValue] = useState('Appliances');
	console.log(selectValue);
	const [minActive, setMinActive] = useState(null);
	const [maxActive, setMaxActive] = useState(false);
	const createPill = (min, max) => {
		if (min > 0) {
			setMinActive(min);
		} else {
			setMinActive(null);
		}
		if (max > 0) {
			setMaxActive(max);
		} else {
			setMaxActive(null);
		}
	};
	const clearPill = (min, max) => {
		if (min) {
			setMinActive(null);
		}
		if (max) {
			setMaxActive(null);
		}
	};
	return (
		<div
			ref={wrapperRef}
			onClick={() => setToggleItem(true)}
			className={`${
				toggleItem
					? 'bg-gray-100'
					: 'border-t border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-100 ease-in-out'
			}`}
		>
			<div className='py-2 px-4'>
				<div className='flex items-center justify-between'>
					<div className='font-semibold text-sm text-gray-700'>{title}</div>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setToggleItem((prev) => !prev);
						}}
						className='p-1 rounded-lg text-gray-500 hover:text-gray-700 transition-all duration-100 ease-in-out focus:outline-none focus:shadow-outline'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='h-4 w-4'
						>
							{toggleItem ? (
								<path
									fillRule='evenodd'
									d='M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z'
									clipRule='evenodd'
								/>
							) : (
								<path
									fillRule='evenodd'
									d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
									clipRule='evenodd'
								/>
							)}
						</svg>
					</button>
				</div>
				{toggleItem && (
					<div>
						<div className='flex items-center'>
							{(minActive || minDefault > 0) && (
								<div className='flex items-center w-min py-1 pl-3 pr-2 rounded-lg bg-purple-100 shadow-sm text-purple-600 text-sm'>
									<span>Min:</span>
									<span className='ml-1'>{+minActive || +minDefault}</span>
									<button
										onClick={() => {
											clearMinMaxFilter(null, +filterData.max, val, 'Min');
											clearPill(+filterData.min, null);
											setFilterData({ ...filterData, min: null });
										}}
										className='ml-1 p-1 rounded-lg hover:text-purple-800 transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline'
									>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 20 20'
											fill='currentColor'
											className='h-4 w-4'
										>
											<path
												fillRule='evenodd'
												d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
												clipRule='evenodd'
											/>
										</svg>
									</button>
								</div>
							)}
							{(maxActive || maxDefault > 0) && (
								<div
									className={`${
										(maxActive || maxDefault > 0) &&
										(minActive || minDefault > 0) &&
										'ml-2'
									} flex items-center w-min py-1 pl-3 pr-2 rounded-lg bg-purple-100 shadow-sm text-purple-600 text-sm`}
								>
									<span>Max:</span>
									<span className='ml-1'>{+maxActive || +maxDefault}</span>
									<button
										onClick={() => {
											clearMinMaxFilter(+filterData.min, null, val, 'Max');
											clearPill(null, +filterData.max);
											setFilterData({ ...filterData, max: null });
										}}
										className='ml-1 p-1 rounded-lg hover:text-purple-800 transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline'
									>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 20 20'
											fill='currentColor'
											className='h-4 w-4'
										>
											<path
												fillRule='evenodd'
												d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
												clipRule='evenodd'
											/>
										</svg>
									</button>
								</div>
							)}
						</div>
						{title !== 'Category' ? (
							<div className='mt-3'>
								<div className='font-semibold text-sm text-gray-700'>
									{subtitle} range {subtitleValue}
								</div>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										createPill(+filterData.min, +filterData.max, val);
										setMinMaxFilter(+filterData.min, +filterData.max, val);
									}}
								>
									<div className='mt-2 flex items-center justify-between'>
										<input
											name='min'
											type='text'
											placeholder={'Min'}
											onChange={onChange}
											className='w-1/2 p-2 bg-white rounded-lg text-sm border border-gray-200 shadow-sm placeholder-gray-300 focus:outline-none focus:shadow-outline'
										/>
										<span className='ml-2 text-gray-400'>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												className='w-5'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M18 12H6'
												/>
											</svg>
										</span>
										<input
											name='max'
											type='text'
											placeholder={'Max'}
											onChange={onChange}
											className='w-1/2 ml-2 p-2 bg-white rounded-lg text-sm border border-gray-200 shadow-sm placeholder-gray-300 focus:outline-none focus:shadow-outline'
										/>
									</div>
									<div className='mt-2 border-t border-gray-200'>
										<div className='flex justify-end'>
											<button
												type='sumbit'
												className='mt-2 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm shadow-sm hover:shadow-md transition-all duration-100 ease-in-out focus:outline-none focus:shadow-outline'
											>
												Set filter
											</button>
										</div>
									</div>
								</form>
							</div>
						) : (
							<div className='mt-3'>
								<div className='font-semibold text-sm text-gray-700'>
									Select a category
								</div>
								<select
									value={selectValue}
									onChange={(e) => setSelectValue(e.currentTarget.value)}
									className='w-full mt-2 p-2 bg-white rounded-lg text-sm border border-gray-200 shadow-sm focus:outline-none focus:shadow-outline'
								>
									{categories.map((category, i) => (
										<option key={i} value={category}>
											{category}
										</option>
									))}
								</select>
								<div className='flex justify-end'>
									<button
										type='sumbit'
										className='mt-2 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm shadow-sm hover:shadow-md transition-all duration-100 ease-in-out focus:outline-none focus:shadow-outline'
									>
										Set filter
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	const {
		title,
		subtitle,
		subtitleValue,
		minDefault,
		maxDefault,
		val,
	} = ownProps;
	return { title, subtitle, subtitleValue, minDefault, maxDefault, val };
};

export default connect(mapStateToProps, {
	setAlert,
	setMinMaxFilter,
	clearMinMaxFilter,
})(FilterItem);
