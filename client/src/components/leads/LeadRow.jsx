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
	const [rowHover, setRowHover] = useState(false);
	const [newLead, setNewLead] = useState(false);
	const [quickView, setQuickView] = useState(false);
	const [expandedView, setExpandedView] = useState(false);
	const [titleHover, setTitleHover] = useState(false);
	const [eyeDesc, setEyeDesc] = useState(false);
	const [linkDesc, setLinkDesc] = useState(false);
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

	const classes = {
		rowWrapper:
			'relative px-1 border-b border-gray-200 hover:bg-gray-100 transition duration-100 cursor-pointer',
		likeCellWrapper: 'p-2 pl-0 text-center text-gray-400',
		likeCellButton: 'p-1 rounded-md ring-purple align-middle',
		likeCellActive: 'svg-base hover:text-purple-400 transition-colors-main',
		likeCellNull: 'p-2 px-4 svg-base',
		titleCellWrapper: 'p-2 font-semibold',
		detailsCellWrapper: 'relative p-2 flex items-center text-gray-400',
		detailsCellSvg: 'svg-base',
		detailsCellButton:
			'p-1 rounded-md hover:text-gray-600 transition-main ring-gray',
		detailsCellImageWrapper:
			'absolute z-10 p-2 transform lg:-translate-y-12 xl:-translate-y-16 translate-x-24 bg-white shadow-xl rounded-lg border border-gray-200',
		detailsCellImage: 'max-h-56 max-w-xs',
		competitionWrapper:
			'w-36 absolute bottom-0 z-10 p-2 transform -translate-y-12 translate-x-8 rounded-md shadow-md bg-gray-900 text-white text-sm',
		competitionRow: 'center-between',
		competitorType: 'font-semibold text-purple-300',
		competitorCount: 'font-semibold',
		profitCellWrapper: 'p-2 uppercase',
		titleHover:
			'absolute z-10 left-0 p-2 transform -translate-y-10 lg:translate-x-16 xl:translate-x-20 rounded-md shadow-md bg-gray-900 text-white text-sm',
		quickViewCellWrapper: quickView ? 'p-4' : 'p-2',
		quickViewWrapper:
			'all-center rounded-r-lg text-gray-500 hover:text-gray-700',
		quickViewMenu: quickView
			? 'absolute z-10 p-2 bg-white shadow-sm rounded-r-lg ring-gray'
			: 'rounded-lg ring-gray',
		quickViewExpandedWrapper:
			'absolute transform -translate-x-14 bg-white rounded-l-lg shadow-sm text-gray-500',
		eyeIconWrapper:
			'relative p-2 rounded-l-lg border-r border-gray-200 hover:text-gray-700 transition-main ring-gray',
		linkIconWrapper:
			'relative p-2 border-r border-gray-200 hover:text-gray-700 transition-main ring-gray',
		quickViewMenuHover:
			'w-24 mt-2 p-2 absolute top-0 left-0 z-20 transform -translate-y-12 rounded-lg bg-gray-900 shadow-md text-white text-sm',
		quickViewNull: 'p-2 svg-base',
		expandedViewWrapper:
			'absolute right-0 z-20 w-40 transform translate-y-6 md:-translate-x-6 xl:-translate-x-8 bg-white rounded-lg shadow-md border border-gray-200',
		expandedViewMenuTop: 'py-2 border-b border-gray-200',
		expandedViewMenuBottom: 'py-2',
		expandedViewMenuSvg: 'ml-2 svg-sm',
		expandedViewMenuButton:
			'py-1 px-3 w-full text-left font-semibold text-purple-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-100 ease-in-out ring-gray',
		expandedViewMenuButtonSvg: function () {
			return this.expandedViewMenuButton + ' flex items-center';
		},
		defaultCellWrapper: 'p-2',
		defaultSvg: 'svg-base',
		valueIndicator: 'ml-1 text-gray-400 font-semibold',
	};

	return (
		<tr
			className={classes.rowWrapper}
			onMouseEnter={() => setRowHover(true)}
			onMouseLeave={() => setRowHover(false)}
			onClick={() => {
				viewDetailsHandler();
			}}
		>
			{/* like/unlike */}
			<td className={classes.likeCellWrapper}>
				{rowHover || like ? (
					<button
						onClick={(e) => {
							favoriteHandler(e);
						}}
						className={classes.likeCellButton}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill={`${like ? '#5d55fa' : 'none'}`}
							viewBox='0 0 24 24'
							stroke={`${like ? '#5d55fa' : 'currentColor'}`}
							className={classes.likeCellActive}
						>
							{svgList.heart}
						</svg>
					</button>
				) : (
					<div className={classes.likeCellNull} />
				)}
			</td>
			{/* title */}
			<td
				onMouseEnter={() => setTitleHover(true)}
				onMouseLeave={() => setTitleHover(false)}
				className={classes.titleCellWrapper}
			>
				<div>{truncate(data.title, 31)}</div>
			</td>
			{/* category */}
			<td className={classes.defaultCellWrapper}>
				{truncate(data.category, 28)}
			</td>
			{/* details */}
			<td className={classes.detailsCellWrapper}>
				{/* image */}
				<button
					onMouseEnter={() => setViewImage(true)}
					onMouseLeave={() => setViewImage(false)}
					onClick={(e) => {
						e.stopPropagation();
						setViewImage((prev) => !prev);
					}}
					className={classes.detailsCellButton}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className={classes.detailsCellSvg}
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						{svgList.image}
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
					className={classes.detailsCellButton}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className={classes.detailsCellSvg}
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						{svgList.competition}
					</svg>
				</button>
				{viewImage && (
					<div className={classes.detailsCellImageWrapper}>
						<img
							src={data.img}
							alt={data.title}
							className={classes.detailsCellImage}
						/>
					</div>
				)}
				{viewCompetition && (
					<div className={classes.competitionWrapper}>
						<div className={classes.competitionRow}>
							<span>Buy box</span>
							<span className={classes.competitorType}>
								{data.competitorType}
							</span>
						</div>
						{data.competitorCount > 0 && (
							<div className={classes.competitionRow}>
								<span># Competitors</span>
								<span className={classes.competitorCount}>
									{data.competitorCount}
								</span>
							</div>
						)}
					</div>
				)}
			</td>
			{/* profit */}
			<td className={classes.profitCellWrapper}>
				<span>$</span>
				{(data.netProfit - (unitFee || lbFee * data.weight || 0)).toFixed(2)}
				<span className={classes.valueIndicator}>USD</span>
			</td>
			{/* roi */}
			<td className={classes.defaultCellWrapper}>
				{(
					((data.netProfit.toFixed(2) - (unitFee || lbFee * data.weight || 0)) /
						data.buyPrice.toFixed(2)) *
					100
				).toFixed(0)}
				<span className={classes.valueIndicator}>%</span>
			</td>
			{/* bsr */}
			<td className={classes.defaultCellWrapper}>
				{numberWithCommas(data.bsrCurrent)}
				<span className={classes.valueIndicator}>
					({calculateBSR(data.bsrCurrent, data.category)})
					<span className={classes.valueIndicator}>%</span>
				</span>
			</td>
			{/* monthly sales */}
			<td className={classes.bsrCellWrapper}>
				{numberWithCommas(data.monthlySales)}
			</td>
			{/* date */}
			<td className={classes.defaultCellWrapper}>{datePosted}</td>
			{/* quick menu */}
			<td className={classes.quickViewCellWrapper}>
				<div ref={wrapperRef}>
					{rowHover || expandedView ? (
						<div
							onMouseEnter={() => setQuickView(true)}
							onMouseLeave={() => !expandedView && setQuickView(false)}
							className={classes.quickViewWrapper}
						>
							<button
								onClick={(e) => {
									e.stopPropagation();
									setExpandedView(!expandedView);
								}}
								className={classes.quickViewMenu}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 20 20'
									fill='currentColor'
									className={classes.defaultSvg}
								>
									{svgList.dots}
								</svg>
							</button>
							{quickView && (
								<div className={classes.quickViewExpandedWrapper}>
									<div className='all-center'>
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
											className={classes.eyeIconWrapper}
										>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												viewBox='0 0 20 20'
												fill='currentColor'
												className={classes.defaultSvg}
											>
												{svgList.eye}
											</svg>
											{eyeDesc && (
												<div className={classes.quickViewMenuHover}>
													View details
												</div>
											)}
										</button>
										{/* link */}
										<button
											onClick={(e) => {
												e.stopPropagation();
												openLinkHandler(data.retailerLink, data.amzLink);
												setExpandedView(false);
											}}
											onMouseEnter={() => setLinkDesc(true)}
											onMouseLeave={() => setLinkDesc(false)}
											className={classes.linkIconWrapper}
										>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												viewBox='0 0 20 20'
												fill='currentColor'
												className={classes.defaultSvg}
											>
												{svgList.link}
											</svg>
											{linkDesc && (
												<div className={classes.quickViewMenuHover}>
													Open links
												</div>
											)}
										</button>
									</div>
								</div>
							)}
						</div>
					) : (
						<div className={classes.quickViewNull} />
					)}
					{/* horiztonal dots */}
					{expandedView && (
						<div className={classes.expandedViewWrapper}>
							<div className={classes.expandedViewMenuTop}>
								<button
									onClick={(e) => {
										favoriteHandler(e);
									}}
									className={classes.expandedViewMenuButton}
								>
									{!like ? 'Like lead' : 'Unlike lead'}
								</button>
								<button
									onClick={(e) => {
										archiveHandler(e);
									}}
									className={classes.expandedViewMenuButton}
								>
									{!archive ? 'Archive lead' : 'Unarchive lead'}
								</button>
							</div>
							<div className={classes.expandedViewMenuBottom}>
								<button
									onClick={() =>
										openLinkHandler(data.retailerLink, data.amzLink)
									}
									className={classes.expandedViewMenuButtonSvg()}
								>
									<span>Open links</span>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 20 20'
										fill='currentColor'
										className={classes.expandedViewMenuSvg}
									>
										{svgList.link}
									</svg>
								</button>
								<button
									onClick={() => viewDetailsHandler()}
									className={classes.expandedViewMenuButtonSvg()}
								>
									<span>View details</span>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 20 20'
										fill='currentColor'
										className={classes.expandedViewMenuSvg}
									>
										{svgList.eye}
									</svg>
								</button>
							</div>
						</div>
					)}
				</div>
			</td>
			{/* title hover */}
			{titleHover && (
				<td
					onMouseEnter={() => setRowHover(false)}
					className={classes.titleHover}
				>
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

const svgList = {
	heart: (
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
		/>
	),
	image: (
		<path
			fillRule='evenodd'
			d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
			clipRule='evenodd'
		/>
	),
	competition: (
		<path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
	),
	dots: (
		<path d='M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z' />
	),
	eye: (
		<g>
			<path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
			<path
				fillRule='evenodd'
				d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
				clipRule='evenodd'
			/>
		</g>
	),
	link: (
		<path
			fillRule='evenodd'
			d='M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z'
			clipRule='evenodd'
		/>
	),
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
