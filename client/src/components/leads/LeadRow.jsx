import React, { useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	viewLead,
	handleLikeLead,
	handleArchiveLead,
	setCurrentLead,
} from 'redux/actions/leads';
import { DateTime } from 'luxon';

import {
	truncate,
	numberWithCommas,
	calculateBSR,
	openLinkHandler,
	useOutsideMousedown,
} from 'utils/utils';

const buttonClasses =
	'py-1 px-3 w-full text-left font-semibold text-purple-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-100 ease-in-out ring-gray';

const LeadRow = ({
	lead,
	user,
	liked,
	archived,
	viewLead,
	showDetails,
	setShowDetails,
	handleLikeLead,
	handleArchiveLead,
	setCurrentLead,
	unitFee,
	lbFee,
}) => {
	const { data } = lead;
	const [newLead, setNewLead] = useState(false);
	const [quickView, setQuickView] = useState(false);
	const [expandedView, setExpandedView] = useState(false);
	const [titleHover, setTitleHover] = useState(false);
	const [eyeDesc, setEyeDesc] = useState(false);
	const [linkDesc, setLinkDesc] = useState(false);
	const hoverClasses =
		'mt-2 p-2 absolute top-0 left-0 z-20 transform -translate-y-12 rounded-lg bg-gray-800 shadow-md text-white text-sm';
	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, setQuickView, setExpandedView);
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
	}, [user, lead._id]);
	const datePosted = DateTime.fromISO(data.date).toFormat('LLL dd');
	const viewDetailsHandler = () => {
		newLead && setNewLead(false);
		setShowDetails(!showDetails);
		viewLead(user._id, lead._id);
		setCurrentLead(lead);
		setQuickView(false);
		setExpandedView(false);
	};
	const [like, setLike] = useState(
		liked.some((l) => l._id === lead._id) ? true : false
	);
	useEffect(() => {
		if (liked.some((l) => l._id === lead._id)) {
			setLike(true);
		} else {
			setLike(false);
		}
	}, [liked]);
	const [archive, setArchive] = useState(
		archived.some((l) => l._id === lead._id) ? true : false
	);
	useEffect(() => {
		if (archived.some((l) => l._id === lead._id)) {
			setArchive(true);
		} else {
			setArchive(false);
		}
	}, [archived]);
	const favoriteHandler = (e) => {
		e.stopPropagation();
		newLead && setNewLead(false);
		handleLikeLead(user._id, lead._id);
		viewLead(user._id, lead._id);
	};
	const archiveHandler = (e) => {
		e.stopPropagation();
		newLead && setNewLead(false);
		handleArchiveLead(user._id, lead._id);
		viewLead(user._id, lead._id);
	};

	const [viewImage, setViewImage] = useState(false);
	const [viewCompetition, setViewCompetition] = useState(false);
	const propertyButtonClasses =
		'p-1 rounded-md hover:text-gray-600 transition duration-100 ease-in-out ring-gray';
	return (
		<tr
			className='relative px-1 border-b border-gray-200 hover:bg-gray-100 transition duration-100 cursor-pointer'
			onClick={() => {
				viewDetailsHandler();
			}}
		>
			<td className='p-2 pl-0 text-center text-gray-400'>
				<button
					onClick={(e) => {
						favoriteHandler(e);
					}}
					className='p-1 rounded-md ring-purple align-middle'
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
			<td
				onMouseEnter={() => setTitleHover(true)}
				onMouseLeave={() => setTitleHover(false)}
				className='p-2 font-semibold'
			>
				<div>{truncate(data.title, 31)}</div>
			</td>
			{/* <td className='relative p-2 text-gray-600'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 20 20'
					fill='currentColor'
				>
					<path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
				</svg>
			</td> */}
			<td className='p-2'>{truncate(data.category, 28)}</td>
			<td className='relative p-2 flex items-center text-gray-400'>
				{/* image */}
				<button
					onMouseEnter={() => setViewImage(true)}
					onMouseLeave={() => setViewImage(false)}
					onClick={(e) => {
						e.stopPropagation();
						setViewImage((prev) => !prev);
					}}
					className={propertyButtonClasses}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path
							fillRule='evenodd'
							d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
							clipRule='evenodd'
						/>
					</svg>
				</button>
				{/* competitors */}
				<button
					onMouseEnter={() => setViewCompetition(true)}
					onMouseLeave={() => setViewCompetition(false)}
					onClick={(e) => {
						e.stopPropagation();
						setViewCompetition((prev) => !prev);
					}}
					className={`ml-2 ${propertyButtonClasses}`}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
					</svg>
				</button>
				{viewImage && (
					<div className='absolute z-10 p-2 transform lg:-translate-y-16 xl:-translate-y-20 translate-x-24 bg-white shadow-xl rounded-lg border border-gray-200'>
						<img
							src={data.img}
							alt={data.title}
							className='max-h-56 max-w-xs'
						/>
					</div>
				)}
				{viewCompetition && (
					<div className='w-36 absolute bottom-0 z-10 p-2 transform -translate-y-12 translate-x-8 rounded-md shadow-md bg-gray-800 text-white text-sm'>
						<div className='flex items-center justify-between'>
							<span>Buy box</span>
							<span className='font-semibold text-teal-500'>
								{data.competitorType}
							</span>
						</div>
						{data.competitorCount > 0 && (
							<div className='flex items-center justify-between'>
								<span># Competitors</span>
								<span className='font-semibold'>{data.competitorCount}</span>
							</div>
						)}
					</div>
				)}
			</td>
			<td className='p-2'>
				<span>$</span>
				{(data.netProfit - (unitFee || lbFee * data.weight || 0)).toFixed(2)}
				<span className='ml-1 text-gray-400 font-semibold uppercase'>USD</span>
			</td>
			<td className='p-2'>
				{(
					((data.netProfit.toFixed(2) - (unitFee || lbFee * data.weight || 0)) /
						data.buyPrice.toFixed(2)) *
					100
				).toFixed(0)}
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
			<td className={quickView ? 'p-4' : 'p-2'}>
				<div ref={wrapperRef}>
					<div
						onMouseEnter={() => setQuickView(true)}
						onMouseLeave={() => !expandedView && setQuickView(false)}
						className='flex items-center justify-center rounded-r-lg ring-gray'
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
							} text-gray-500 hover:text-gray-700 ring-gray`}
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
										onMouseEnter={() => setEyeDesc(true)}
										onMouseLeave={() => setEyeDesc(false)}
										className='relative p-2 rounded-l-lg border-r border-gray-200 hover:text-gray-700 transition duration-100 ease-in-out ring-gray'
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
										{eyeDesc && <div className={hoverClasses}>Details</div>}
									</button>
									{/* link */}
									<button
										onClick={(e) => {
											e.stopPropagation();
											openLinkHandler(e, data.retailerLink, data.amzLink);
											setExpandedView(false);
										}}
										onMouseEnter={() => setLinkDesc(true)}
										onMouseLeave={() => setLinkDesc(false)}
										className='relative p-2 border-r border-gray-200 hover:text-gray-700 transition duration-100 ease-in-out ring-gray'
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
										{linkDesc && <div className={hoverClasses}>Links</div>}
									</button>
								</div>
							</div>
						)}
					</div>
					{/* horiztonal dots */}
					{expandedView && (
						<div className='absolute right-0 z-20 w-40 transform translate-y-6 md:-translate-x-6 lg:-translate-x-8 xl:-translate-x-12 bg-white rounded-lg shadow-md'>
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
									{!archive ? 'Archive lead' : 'Unarchive lead'}
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
			{titleHover && (
				<td className='absolute z-10 left-0 p-2 transform -translate-y-10 lg:translate-x-16 xl:translate-x-20 rounded-md shadow-md bg-gray-800 text-white text-sm'>
					{data.title}
				</td>
			)}
		</tr>
	);
};

LeadRow.propTypes = {
	lead: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	viewLead: PropTypes.func.isRequired,
	showDetails: PropTypes.bool.isRequired,
	setShowDetails: PropTypes.func.isRequired,
	handleLikeLead: PropTypes.func.isRequired,
	handleArchiveLead: PropTypes.func.isRequired,
	setCurrentLead: PropTypes.func.isRequired,
	unitFee: PropTypes.number,
	lbFee: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => {
	const { unit: unitFee, lb: lbFee } = state.filters.prep;
	const { lead, user, showDetails, setShowDetails } = ownProps;
	return { unitFee, lbFee, lead, user, showDetails, setShowDetails };
};

export default connect(mapStateToProps, {
	viewLead,
	handleLikeLead,
	handleArchiveLead,
	setCurrentLead,
})(LeadRow);
