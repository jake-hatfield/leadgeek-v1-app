import React, { useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
// redux
import { connect } from 'react-redux';
import { DateTime } from 'luxon';

import {
	viewLead,
	handleLikeLead,
	setCurrentLead,
} from '../../redux/actions/leads';
// utils
import {
	truncate,
	numberWithCommas,
	calculateBSR,
	openLinkHandler,
} from '../../utils/utils';

const buttonClasses =
	'py-1 px-3 w-full text-left font-semibold text-purple-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline';

const LeadRow = ({
	lead,
	viewLead,
	handleLikeLead,
	showDetails,
	setShowDetails,
	setCurrentLead,
	user,
}) => {
	const { data } = lead;
	const wrapperRef = useRef(null);
	const useOutsideAlerter = (ref) => {
		useEffect(() => {
			function handleClickOutside(event) {
				if (ref.current && !ref.current.contains(event.target)) {
					setQuickView(false);
					setExpandedView(false);
				}
			}
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}, [ref]);
	};
	useOutsideAlerter(wrapperRef);
	const [like, setLike] = useState(false);
	const [newLead, setNewLead] = useState(false);
	const [quickView, setQuickView] = useState(false);
	const [expandedView, setExpandedView] = useState(false);
	useEffect(() => {
		// set unviewed status
		if (user.unviewedLeads.some((l) => l._id === lead._id)) {
			setNewLead(true);
		}
		// set like status
		for (let i = 0; i < user.likedLeads.length; i++) {
			if (user.likedLeads[i]._id === lead._id) {
				setLike(true);
				break;
			}
		}
	}, [user]);
	const datePosted = DateTime.fromISO(data.date).toFormat('LLL dd');
	const viewDetailsHandler = () => {
		newLead && setNewLead(false);
		setShowDetails(!showDetails);
		viewLead(user._id, lead._id);
		setCurrentLead(lead);
		setQuickView(false);
		setExpandedView(false);
	};
	const favoriteHandler = (e) => {
		e.stopPropagation();
		newLead && setNewLead(false);
		setLike(!like);
		handleLikeLead(user._id, lead._id);
		viewLead(user._id, lead._id);
	};
	const archiveHandler = (e) => {
		e.stopPropagation();
		newLead && setNewLead(false);
		setLike(!like);
		handleLikeLead(user._id, lead._id);
		viewLead(user._id, lead._id);
	};

	return (
		<tr
			className='relative px-1 border-b border-gray-200 hover:bg-gray-100 transition-all duration-100 cursor-pointer'
			onClick={() => {
				viewDetailsHandler();
			}}
		>
			<td className='p-2 text-center'>
				{newLead && (
					<span className='h-4 w-4 flex items-center justify-center rounded-full bg-teal-200'>
						<span className='h-2 w-2 inline-block rounded-full bg-teal-400' />
					</span>
				)}
			</td>
			<td className='p-2 pl-0 text-center text-gray-400'>
				<button
					onClick={(e) => {
						favoriteHandler(e);
					}}
					className='p-1 rounded-md focus:outline-none focus:shadow-outline align-middle'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill={`${like ? '#5d55fa' : 'none'}`}
						viewBox='0 0 24 24'
						stroke={`${like ? '#5d55fa' : 'currentColor'}`}
						className='h-5 w-5 hover:text-purple-400 transition-colors duration-100 ease-in-out'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
						/>
					</svg>
				</button>
			</td>
			<td className='p-2 font-semibold'>{truncate(data.title, 40)}</td>
			<td className='p-2'>{truncate(data.category, 28)}</td>
			<td className='p-2'>
				<span>$</span>
				{data.netProfit.toFixed(2)}
				<span className='ml-1 text-gray-400 font-semibold uppercase'>USD</span>
			</td>
			<td className='p-2'>
				{(data.roi.toFixed(2) * 100).toFixed(0)}
				<span className='ml-1 text-gray-400 font-semibold'>%</span>
			</td>
			<td className='p-2'>
				{numberWithCommas(data.bsrCurrent)}
				<span className='ml-1 text-gray-400 font-normal'>
					({calculateBSR(data.bsrCurrent, data.category)})
					<span className='ml-1 text-gray-400 font-semibold'>%</span>
				</span>
			</td>
			<td className='p-2'>{numberWithCommas(data.monthlySales)}</td>
			<td className='p-2'>{datePosted}</td>
			<td className='p-2'>
				<div ref={wrapperRef}>
					<div
						onMouseEnter={() => setQuickView(true)}
						onMouseLeave={() => !expandedView && setQuickView(false)}
						className='flex items-center justify-center rounded-r-lg focus:outline-none focus:shadow-outline'
					>
						<button
							onClick={(e) => {
								e.stopPropagation();
								setExpandedView(!expandedView);
							}}
							className={`${
								quickView
									? 'absolute z-10 p-2 bg-white shadow-sm rounded-r-lg'
									: 'rounded-lg'
							} p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:shadow-outline`}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='h-5 w-5'
							>
								<path d='M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z' />
							</svg>
						</button>
						{quickView && (
							<div className='absolute transform -translate-x-14 bg-white rounded-l-lg shadow-sm text-gray-500'>
								<div className='flex items-center'>
									{/* eye */}
									<button
										onClick={(e) => {
											e.stopPropagation();
											setShowDetails(!showDetails);
											setCurrentLead(lead);
											setExpandedView(false);
										}}
										className='p-2 rounded-l-lg border-r border-gray-200 hover:text-gray-700 transition-all duration-100 ease-in-out focus:outline-none focus:shadow-outline'
									>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 20 20'
											fill='currentColor'
											className='h-5 w-5'
										>
											<path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
											<path
												fillRule='evenodd'
												d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
												clipRule='evenodd'
											/>
										</svg>
									</button>
									{/* link */}
									<button
										onClick={(e) => {
											e.stopPropagation();
											openLinkHandler(e, data.retailerLink, data.amzLink);
											setExpandedView(false);
										}}
										className='p-2 border-r border-gray-200 hover:text-gray-700 transition-all duration-100 ease-in-out focus:outline-none focus:shadow-outline'
									>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 20 20'
											fill='currentColor'
											className='h-5 w-5 hover:text-gray-700'
										>
											<path
												fillRule='evenodd'
												d='M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z'
												clipRule='evenodd'
											/>
										</svg>
									</button>
								</div>
							</div>
						)}
					</div>
					{/* horiztonal dots */}
					{expandedView && (
						<div className='absolute right-0 z-20 w-40 transform translate-y-6 -translate-x-12 bg-white rounded-lg shadow-md'>
							<div className='py-2 border-b border-gray-200'>
								<button
									onClick={(e) => {
										favoriteHandler(e);
									}}
									className={buttonClasses}
								>
									{!like ? 'Like lead' : 'Unlike lead'}
								</button>
								<button
									onClick={(e) => {
										archiveHandler(e);
									}}
									className={buttonClasses}
								>
									Archive lead
								</button>
							</div>
							<div className='py-2'>
								<button
									onClick={(e) =>
										openLinkHandler(e, data.retailerLink, data.amzLink)
									}
									className={`${buttonClasses} flex items-center`}
								>
									<span>Open links</span>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 20 20'
										fill='currentColor'
										className='ml-1 h-4 w-4'
									>
										<path
											fillRule='evenodd'
											d='M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z'
											clipRule='evenodd'
										/>
									</svg>
								</button>
								<button
									onClick={() => viewDetailsHandler()}
									className={`${buttonClasses} flex items-center`}
								>
									<span>View details</span>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 20 20'
										fill='currentColor'
										className='ml-1 h-4 w-4'
									>
										<path
											fillRule='evenodd'
											d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
											clipRule='evenodd'
										/>
									</svg>
								</button>
							</div>
						</div>
					)}
				</div>
			</td>
		</tr>
	);
};

LeadRow.propTypes = {
	viewLead: PropTypes.func.isRequired,
	setCurrentLead: PropTypes.func.isRequired,
};

export default connect(null, {
	viewLead,
	handleLikeLead,
	setCurrentLead,
})(LeadRow);
