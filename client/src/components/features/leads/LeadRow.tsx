import React, { useState, useEffect, useRef } from 'react';

// packages
import { DateTime } from 'luxon';
import { animated, useSpring } from 'react-spring';

// redux
import { useAppDispatch, useAppSelector, useDarkMode } from '@hooks/hooks';
import {
	handleArchiveLead,
	handleLikeLead,
	setCurrentLead,
} from '@features/leads/leadsSlice';

// utils
import {
	calculateBSR,
	numberWithCommas,
	openLinkHandler,
	truncate,
	useOutsideMousedown,
} from '@utils/utils';
import { Lead } from '@utils/interfaces/Lead';
import { User } from '@utils/interfaces/User';

interface LeadRowProps {
	lead: Lead;
	user: User;
	liked: Lead[];
	archived: Lead[];
	setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeadRow: React.FC<LeadRowProps> = ({
	lead,
	user,
	liked,
	archived,
	setShowDetails,
}) => {
	const dispatch = useAppDispatch();

	// lead state
	const currentLead = useAppSelector((state) => state.leads.currentLead);

	// local state
	const [expandedView, setExpandedView] = useState(false);
	const [eyeDesc, setEyeDesc] = useState(false);
	const [linkDesc, setLinkDesc] = useState(false);
	const [rowHover, setRowHover] = useState(false);
	const [quickView, setQuickView] = useState(false);
	const [viewCompetition, setViewCompetition] = useState(false);
	const [viewImage, setViewImage] = useState(false);

	// destructure necessary items
	const { data } = lead;

	// disable active states on mousedown
	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, setQuickView, setExpandedView);

	// set like status & handlers
	const [like, setLike] = useState(
		liked.some((l) => l._id === lead._id) ? true : false
	);
	useEffect(() => {
		for (let i = 0; i < user.likedLeads.length; i++) {
			if (user.likedLeads[i]._id === lead._id) {
				setLike(true);
				break;
			}
		}
	}, [user, lead._id]);
	useEffect(() => {
		if (liked.some((l) => l._id === lead._id)) {
			setLike(true);
		} else {
			setLike(false);
		}
	}, [liked, lead._id]);

	// set archive status & handler
	const [archive, setArchive] = useState(
		archived.some((l) => l._id === lead._id) ? true : false
	);
	useEffect(() => {
		if (archived.some((l) => l._id === lead._id)) {
			setArchive(true);
		} else {
			setArchive(false);
		}
	}, [archived, lead._id]);

	// set date
	const datePosted = DateTime.fromISO(data.date).toFormat('LLL dd');

	// handle details on view
	const viewDetailsHandler = () => {
		if (currentLead) {
			setShowDetails(true);
			dispatch(setCurrentLead(lead));
		} else {
			setShowDetails((prev) => !prev);
			dispatch(setCurrentLead(lead));
		}
		setQuickView(false);
		setExpandedView(false);
	};

	// handle liking leads
	const favoriteHandler = (e: any) => {
		e.stopPropagation();
		setLike((prev) => !prev);
		dispatch(handleLikeLead({ userId: user._id, leadId: lead._id }));
	};
	// handle archiving leads
	const archiveHandler = (e: any) => {
		e.stopPropagation();
		setArchive((prev) => !prev);
		dispatch(handleArchiveLead({ userId: user._id, leadId: lead._id }));
	};

	// animations
	const imageAnimationStyle = useSpring({
		opacity: viewImage ? 1 : 0,
	});
	const expandedViewAnimationStyle = useSpring({
		x: expandedView ? 1 : 0,
	});
	const quickViewAnimationStyle = useSpring({
		opacity: quickView ? 1 : 0,
	});

	// classes for component
	const classes = {
		bsrCellWrapper: 'p-4 lg:p-3 xl:p-2 w-24',
		categoryCellWrapper: 'p-2 w-56 truncate',
		competitorCount: 'font-semibold',
		competitionRow: 'center-between',
		competitorType: 'font-semibold text-purple-300',
		competitionWrapper:
			'w-36 absolute bottom-0 z-10 p-2 rounded-md shadow-md bg-gray-900 dark:bg-darkGray-100 text-white text-sm transform -translate-y-12 translate-x-8',
		dateCellWrapper: 'p-2 w-24 whitespace-nowrap',
		defaultCellWrapper: 'p-2',
		defaultSvg: 'svg-base',
		detailsCellButton:
			'p-1 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-main ring-gray',
		detailsCellSvg: 'svg-base',
		detailsCellImage: 'max-h-56 max-w-xs',
		detailsCellImageWrapper:
			'absolute z-10 p-2 bg-white shadow-xl rounded-main border border-300 transform lg:-translate-y-1/2 translate-x-16',
		detailsCellWrapper: 'hidden xl:table-cell relative w-20 p-2',
		expandedViewMenuBottom: 'py-2',
		expandedViewMenuButton:
			'py-2 px-3 w-full text-left font-semibold text-purple-500 dark:text-purple-300 hover:bg-gray-100 dark:hover:bg-darkGray-100 hover:text-gray-800 transition-colors-main ring-gray ring-inset',
		expandedViewMenuButtonSvg: function () {
			return this.expandedViewMenuButton + ' flex items-center';
		},
		expandedViewMenuSvg: 'ml-2 svg-sm',
		expandedViewWrapper:
			'absolute right-0 z-20 w-48 mr-3 mt-1 py-2 cs-light-400 card-200',
		eyeIconWrapper:
			'relative p-2 rounded-l-lg border-r border-200 ring-gray ring-inset',
		likeCellActive: 'svg-base hover:text-purple-400 transition-colors-main',
		likeCellButton: 'p-1 rounded-md ring-purple align-middle',
		likeCellNull: 'p-2 px-4 svg-base',
		likeCellWrapper: 'pl-6 pr-2 w-9 text-center text-gray-400',
		linkIconWrapper: 'relative p-2 border-r border-200 ring-gray ring-inset',
		monthlySalesCellWrapper: 'p-2 w-24',
		profitCellWrapper: 'w-36 p-2 uppercase',
		quickViewCellWrapper: quickView
			? 'py-4 pl-5 pr-12 w-12'
			: 'py-2 pl-2 pr-10 w-12',
		quickViewExpandedWrapper:
			'absolute transform -translate-x-14 rounded-l-lg border-l border-t border-b border-300 cs-light-400 text-100',
		quickViewMenu: quickView
			? 'absolute z-10 p-2 cs-light-400 shadow-sm rounded-r-lg border-r border-t border-b border-300 ring-gray ring-inset'
			: 'rounded-main ring-gray',
		quickViewMenuHover:
			'w-24 mt-2 p-2 absolute top-0 left-1/2 z-20 bg-gray-900 rounded-main shadow-md text-white text-sm transform -translate-y-12 -translate-x-1/2',
		quickViewNull: 'p-2 svg-base',
		quickViewWrapper:
			'all-center rounded-r-lg text-100 hover:text-gray-700 dark:hover-text-gray-200',
		roiCellWrapper: 'p-2 w-24',
		rowWrapper:
			'relative px-1 border-b last:border-none border-100 dark:border-darkGray-200 hover:bg-gray-100 dark:hover:bg-darkGray-300 cursor-pointer',
		titleCellWrapper:
			'p-2 pr-12 w-32 md:w-48 lg:w-64 xl:w-112 font-semibold truncate',
		titleHover:
			'absolute z-10 left-0 p-2 transform -translate-y-10 lg:translate-x-12 rounded-md shadow-md bg-gray-900 text-white text-sm',
		valueIndicator: 'ml-1 text-100',
	};

	const [colorTheme] = useDarkMode();

	return (
		<tr
			className={classes.rowWrapper}
			onMouseEnter={() => setRowHover(true)}
			onMouseLeave={() => setRowHover(false)}
			onClick={(e) => {
				e.stopPropagation();
				viewDetailsHandler();
			}}
			id='lead-row'
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
							fill={`${
								like ? (colorTheme === 'dark' ? '#7069FA' : '#A2A5FC') : 'none'
							}`}
							viewBox='0 0 24 24'
							stroke={`${
								like
									? colorTheme === 'dark'
										? '#7069FA'
										: '#A2A5FC'
									: 'currentColor'
							}`}
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
			<td className={classes.titleCellWrapper}>
				<div>{truncate(data.title, 60)}</div>
			</td>
			{/* category */}
			<td className={classes.categoryCellWrapper}>
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
					<animated.div
						className={classes.detailsCellImageWrapper}
						style={imageAnimationStyle}
					>
						<img
							src={data.img}
							alt={data.title}
							className={classes.detailsCellImage}
						/>
					</animated.div>
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
				{data.netProfit.toFixed(2)}
				<span className={classes.valueIndicator}>USD</span>
			</td>
			{/* roi */}
			<td className={classes.roiCellWrapper}>
				{(
					(+data.netProfit?.toFixed(2) / +data.buyPrice?.toFixed(2)) *
					100
				).toFixed(0)}
				<span className={classes.valueIndicator}>%</span>
			</td>
			{/* bsr */}
			<td className={classes.bsrCellWrapper}>
				{numberWithCommas(data.bsrCurrent)}
				<span className={classes.valueIndicator}>
					({calculateBSR(data.bsrCurrent, data.category)})
					<span className={classes.valueIndicator}>%</span>
				</span>
			</td>
			{/* monthly sales */}
			<td className={classes.monthlySalesCellWrapper}>
				{numberWithCommas(data.monthlySales)}
			</td>
			{/* date */}
			<td className={classes.dateCellWrapper}>{datePosted}</td>
			{/* quick menu */}
			<td className={classes.quickViewCellWrapper}>
				<div ref={wrapperRef}>
					{rowHover || expandedView ? (
						<div
							onMouseEnter={() => setQuickView(true)}
							onMouseLeave={() => !expandedView && setQuickView(false)}
							className={classes.quickViewWrapper}
						>
							{/* horiztonal dots */}
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
								<animated.div
									className={classes.quickViewExpandedWrapper}
									style={quickViewAnimationStyle}
								>
									<div className='all-center'>
										{/* eye */}
										<button
											onClick={(e) => {
												e.stopPropagation();
												viewDetailsHandler();
												setRowHover(false);
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
								</animated.div>
							)}
						</div>
					) : (
						<div className={classes.quickViewNull} />
					)}
					{expandedView && (
						<animated.div
							className={classes.expandedViewWrapper}
							style={{
								transform: expandedViewAnimationStyle.x
									.to({
										range: [0, 0.35, 0.75, 1],
										output: [1, 0.98, 1.02, 1],
									})
									.to((x) => `scale(${x})`),
								translateY: '1.5rem',
								translateX: '-1.25rem',
							}}
						>
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
							<button
								onClick={() => openLinkHandler(data.retailerLink, data.amzLink)}
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
								onClick={(e) => {
									e.stopPropagation();
									viewDetailsHandler();
									setRowHover(false);
								}}
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
						</animated.div>
					)}
				</div>
			</td>
		</tr>
	);
};

// svg list for cells
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

export default LeadRow;
