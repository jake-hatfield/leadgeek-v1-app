import React, {
	Fragment,
	useRef,
	useEffect,
	useCallback,
	useState,
} from 'react';

// packages
import { DateTime } from 'luxon';
import ReactImageMagnify from 'react-image-magnify';
import { animated } from 'react-spring';

// redux
import { useAppDispatch, useAppSelector } from '@utils/hooks';
import {
	clearCurrentLead,
	handleLikeLead,
	handleArchiveLead,
	addComment,
	setCurrentLead,
	getFeedLeads,
	setPage,
} from '@features/leads/leadsSlice';

// components
import Button from '@components/utils/Button';

// utils
import {
	calculateBSR,
	numberWithCommas,
	openLinkHandler,
	returnDomainFromUrl,
	truncate,
} from '@utils/utils';
import { Lead } from '@utils/interfaces/Lead';
import { User } from '@utils/interfaces/User';
import { setTimeout } from 'timers';

interface DetailsProps {
	currentLead: Lead;
	user: User;
	type: 'feed' | 'liked' | 'archived' | 'search';
	showDetails: boolean;
	setShowDetails: React.Dispatch<boolean>;
	animationStyle: any;
}

const Details: React.FC<DetailsProps> = ({
	currentLead,
	user,
	type,
	showDetails,
	setShowDetails,
	animationStyle,
}) => {
	const dispatch = useAppDispatch();

	// lead state
	const leads = useAppSelector((state) => state.leads[type].pageByIds);
	// filter state
	const itemLimit = useAppSelector((state) => state.filters.itemLimit);
	const unitFee = useAppSelector((state) => state.filters.prep.unit);
	const lbFee = useAppSelector((state) => state.filters.prep.lb);
	const page = useAppSelector((state) => state.leads[type].pagination.page);

	// local state
	const [newLead, setNewLead] = useState(false);
	const [comment, setComment] = useState('');
	const [fullTitle, toggleFullTitle] = useState(false);
	const [identifyingText, setIdentifyingText] = useState('');
	const [noteCount, setNoteCount] = useState(0);

	// descructure necessary items
	const { data } = currentLead;

	// prevent scroll while active
	// useEffect(() => {
	// 	document.body.style.overflow = 'hidden';
	// 	return () => {
	// 		document.body.style.overflow = 'unset';
	// 	};
	// }, []);

	// close modal on click outside
	const modalRef = useRef();
	const closeModal = (e: React.MouseEvent<HTMLElement>) => {
		if (modalRef.current === e.target) {
			setShowDetails(false);
		}
	};
	// close modal on esc key
	const keyPress = useCallback(
		(e) => {
			if (e.key === 'Escape' && showDetails) {
				setShowDetails(false);
			}
		},
		[setShowDetails, showDetails]
	);
	useEffect(() => {
		document.addEventListener('keydown', keyPress);
		return () => document.removeEventListener('keydown', keyPress);
	}, [keyPress]);

	// like/archive/comment handlers
	const [like, setLike] = useState(
		user.likedLeads.some((lead) => lead._id === currentLead._id) ? true : false
	);
	useEffect(() => {
		if (user.likedLeads.some((lead) => lead._id === currentLead._id)) {
			setLike(true);
		} else {
			setLike(false);
		}
	}, [user.likedLeads, currentLead._id]);
	const [archive, setArchive] = useState(
		user.archivedLeads.some((lead) => lead._id === currentLead._id)
			? true
			: false
	);
	useEffect(() => {
		if (user.archivedLeads.some((lead) => lead._id === currentLead._id)) {
			setArchive(true);
		} else {
			setArchive(false);
		}
	}, [user.archivedLeads, currentLead._id]);
	useEffect(() => {
		const hasComment = user.comments.filter(
			(comment) => comment.leadId === currentLead._id
		);
		if (hasComment.length > 0) {
			setComment(hasComment[0].comment);
		} else {
			setComment('');
		}
	}, [user.likedLeads]);

	// prev/next navigation
	const getLead = (val: number) => {
		const currentIndex = leads.indexOf(currentLead);
		const nextIndex = currentIndex + val;
		// beginning of the array
		if (nextIndex === -1) {
			return setShowDetails(false);
		}
		if (nextIndex === itemLimit) {
			console.log(page);
			dispatch(setPage({ page: page + 1, type }));
			return setTimeout(() => {
				setNewLead(true);
			}, 2500);
		}
		return dispatch(setCurrentLead(leads[nextIndex]));
	};

	useEffect(() => {
		if (newLead) {
			console.log(leads[0]);
			dispatch(setCurrentLead(leads[0]));
			return setNewLead(false);
		}
	}, [newLead]);

	const navigationButtons = [
		{
			activePath: (
				<path
					fillRule='evenodd'
					d='M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z'
					clipRule='evenodd'
				/>
			),
			disabledPath: null,
			onClick: () => getLead(-1),
			state: false,
			description: <span>View previous lead</span>,
			last: false,
		},
		{
			activePath: (
				<path
					fillRule='evenodd'
					d='M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z'
					clipRule='evenodd'
				/>
			),
			disabledPath: null,
			onClick: () => getLead(1),
			state: false,
			description: <span>View next lead</span>,
			last: false,
		},
	];

	// set date
	const date = DateTime.fromISO(data.date).toFormat('LLL dd @ H:mm');

	// buttons in details header
	const utilityButtons = [
		{
			activePath: (
				<path
					fillRule='evenodd'
					d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
					clipRule='evenodd'
				/>
			),
			disabledPath: (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					fillRule='evenodd'
					d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
					clipRule='evenodd'
				/>
			),
			onClick: () =>
				dispatch(handleLikeLead({ userId: user._id, leadId: currentLead._id })),
			state: like,
			description: <span>{like ? 'Unlike this lead' : 'Like this lead'}</span>,
			last: false,
		},
		{
			activePath: (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z'
				/>
			),
			disabledPath: (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z'
				/>
			),
			onClick: () =>
				dispatch(
					handleArchiveLead({ userId: user._id, leadId: currentLead._id })
				),
			state: archive,
			description: (
				<span>{archive ? 'Unarchive this lead' : 'Archive this lead'}</span>
			),
			last: false,
		},
		{
			activePath: (
				<path
					fillRule='evenodd'
					d='M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z'
					clipRule='evenodd'
				/>
			),
			disabledPath: null,
			onClick: () => openLinkHandler(data.retailerLink, data.amzLink),
			state: null,
			description: <span>Open both links</span>,
			last: false,
		},
		{
			activePath: (
				<path
					fillRule='evenodd'
					d='M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z'
					clipRule='evenodd'
				/>
			),
			disabledPath: null,
			onClick: () => {
				setShowDetails(false);
				dispatch(clearCurrentLead());
			},
			state: null,
			description: (
				<div>
					<span>Close details</span>
					<span className='ml-2 p-0.5 bg-gray-100 rounded-md font-semibold text-gray-600 text-xs'>
						Esc
					</span>
				</div>
			),
			last: true,
		},
	];

	// primary metrics on right side of details popup
	const primaryMetrics = [
		{
			title: 'Net profit',
			value: `$${(
				data.netProfit - (unitFee || (lbFee ? lbFee * data.weight : 0))
			).toFixed(2)}`,
		},
		{
			title: 'Return on investment',
			value: `${(
				((+data.netProfit.toFixed(2) -
					(unitFee || (lbFee ? lbFee * data.weight : 0))) /
					+data.buyPrice.toFixed(2)) *
				100
			).toFixed(0)}%`,
		},
		{
			title: 'Estimated sales / mo.',
			value: `${numberWithCommas(data.monthlySales)}`,
		},
	];

	// asin utilities
	const ASINUtilities = [
		{
			text: 'Copy text',
			path: (
				<g>
					<path d='M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z' />
					<path d='M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z' />
				</g>
			),
			link: null,
			handleClick: () => {
				navigator.clipboard.writeText(data.asin);
			},
			visible: true,
		},
		{
			text: 'Get cashback',
			path: (
				<path
					fillRule='evenodd'
					d='M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z'
					clipRule='evenodd'
				/>
			),
			link: `https://www.rakuten.com/${returnDomainFromUrl(data.retailerLink)}`,
			handleClick: null,
			visible: data.cashback ? true : false,
		},
		{
			text: 'Open Seller Central',
			path: (
				<g>
					<path d='M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z' />
					<path d='M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z' />
				</g>
			),
			link: `https://sellercentral.amazon.com/product-search/search?q=${data.asin}`,
			handleClick: null,
			visible: true,
		},
	];

	// set notes & handlers
	const notes: (string | null)[] = [
		data.promo,
		data.variations,
		data.notes,
		data.shipping,
	];
	const checkNotes = () => {
		setNoteCount(notes.filter((note) => note !== '').length);
	};
	useEffect(() => {
		if (currentLead) {
			checkNotes();
		}
	}, [currentLead]);

	// set ASIN/ISBN identifying text
	useEffect(() => {
		if (data.asin.startsWith('B', 0)) {
			setIdentifyingText('ASIN');
		} else {
			setIdentifyingText('ISBN');
		}
	}, [identifyingText, data.asin]);

	// change handler for comments
	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setComment(e.target.value);
	};

	const descriptorClasses = 'flex justify-between';
	const linkClasses = 'font-semibold text-purple-600 hover:text-gray-700';

	return (
		<Fragment>
			<animated.section
				style={animationStyle}
				// ref={modalRef}
				className='fixed top-0 right-0 z-20 w-full max-w-3xl'
			>
				<div className='relative z-40 min-h-screen shadow-2xl bg-gray-100 dark:bg-darkGray-100 border-l border-gray-400 dark:border-darkGray-200'>
					<header className='bg-white border-b border-gray-400 shadow-sm'>
						<div className='flex items-center justify-between py-3 px-6 text-gray-500'>
							{/* navigation buttons */}
							<div className='flex items-center '>
								{navigationButtons.map((button, i) => (
									<HeaderButton
										key={i}
										activePath={button.activePath}
										disabledPath={button.disabledPath}
										onClick={button.onClick}
										state={button.state}
										description={button.description}
										last={button.last}
									/>
								))}
							</div>
							{/* utility buttons */}
							<div className='flex items-center'>
								{utilityButtons.map((button, i) => (
									<HeaderButton
										key={i}
										activePath={button.activePath}
										disabledPath={button.disabledPath}
										onClick={button.onClick}
										state={button.state}
										description={button.description}
										last={button.last}
									/>
								))}
							</div>
						</div>
					</header>
					<section className='mt-4 px-6'>
						<article className='flex justify-between p-4 bg-white rounded-lg shadow-md border border-gray-400'>
							<div className='w-2/5 h-56 z-10'>
								<ReactImageMagnify
									{...{
										smallImage: {
											alt: data.title,
											isFluidWidth: false,
											src: data.img,
											width: 225,
											height: 225,
										},
										largeImage: {
											alt: data.title,
											src: data.img,
											width: 600,
											height: 600,
										},
										enlargedImageContainerDimensions: {
											width: '200%',
											height: '200%',
										},
										className: 'bg-white',
										enlargedImageContainerClassName:
											'bg-white rounded-lg shadow-xl border border-gray-200',
									}}
								/>
							</div>
							<header className='relative w-3/5 ml-8'>
								<h3
									onMouseEnter={() => toggleFullTitle(true)}
									onMouseLeave={() => toggleFullTitle(false)}
									className='inline-block font-bold text-lg text-gray-900'
								>
									{truncate(data.title, 40)}
								</h3>
								{fullTitle && (
									<div className='absolute top-0 mt-2 mr-6 p-2 transform translate-y-6 rounded-md shadow-md bg-gray-900 text-white text-xs'>
										{data.title}
									</div>
								)}
								<aside className='flex items-center mt-2 text-sm text-gray-800'>
									<div>{date}</div>
									<span className='h-1 w-1 ml-2 rounded-full bg-gray-400' />
									<div className='ml-2'>{data.category}</div>
								</aside>
								<article className='mt-6'>
									<header className='mt-4 pb-2 border-b border-gray-200'>
										<h4 className='font-semibold text-gray-900'>
											Primary metrics
										</h4>
									</header>
									{primaryMetrics.map((metric, i) => (
										<PrimaryMetric
											key={i}
											title={metric.title}
											value={metric.value}
										/>
									))}
								</article>
							</header>
						</article>
						<article className='mt-4 p-4 bg-white rounded-lg shadow-lg border border-gray-400'>
							<header className='pb-2 border-b border-gray-200'>
								<h4 className='font-semibold text-gray-900'>
									Detailed information
								</h4>
							</header>
							<div className='grid grid-cols-2 grid-rows-4 gap-y-2 gap-x-6 mt-4 text-sm text-gray-800'>
								<div className={descriptorClasses}>
									<div>Source</div>
									<div>
										<a
											href={data.retailerLink}
											target='_blank'
											rel='noopener noreferrer'
											className={linkClasses}
										>
											{data.source || '-'}
										</a>
									</div>
								</div>
								<div className={descriptorClasses}>
									<div>Buy price</div>
									<div>{`$${data.buyPrice.toFixed(2) || '-'}`}</div>
								</div>
								<div className={`${descriptorClasses} relative`}>
									<div>{identifyingText}</div>
									{data.asin ? (
										<div className='flex items-center'>
											{ASINUtilities.map((utility, i) => (
												<ASINUtility
													key={i}
													text={utility.text}
													path={utility.path}
													link={utility.link}
													handleClick={utility.handleClick}
													visible={utility.visible}
												/>
											))}
											<a
												href={data.retailerLink}
												target='_blank'
												rel='noopener noreferrer'
												className={`${data.asin && linkClasses} ml-2`}
											>
												{data.asin}
											</a>
										</div>
									) : (
										<span>-</span>
									)}
								</div>
								<div className={descriptorClasses}>
									<div>Sell price</div>
									<div>{`$${data.sellPrice.toFixed(2) || '-'}`}</div>
								</div>
								<div className={descriptorClasses}>
									<div>Competiton</div>
									<div>
										<span className='text-gray-500'>
											{data.competitorCount > 0 && `(${data.competitorCount})`}
										</span>
										<span className='ml-1'>{data.competitorType || '-'}</span>
									</div>
								</div>
								<div className={descriptorClasses}>
									<div>Current BSR</div>
									<div>{numberWithCommas(data.bsrCurrent) || '-'}</div>
								</div>
								<div className={descriptorClasses}>
									<div>Weight</div>
									<div>
										{data.weight ? (
											<span>
												{data.weight.toFixed(2)}
												<span className='ml-1 text-gray-500'>lb</span>
											</span>
										) : (
											<span>-</span>
										)}
									</div>
								</div>
								<div className={descriptorClasses}>
									<div>BSR %</div>
									<div className='flex items-center'>
										{data.bsrCurrent && data.category && (
											<span>
												{calculateBSR(data.bsrCurrent, data.category)}%
											</span>
										)}
									</div>
								</div>
							</div>
						</article>
						<article className='mt-4 p-4 bg-white border border-gray-400 rounded-lg shadow-lg'>
							{/* Notes section */}
							<article className='text-gray-900'>
								<header className='flex items-center pb-2 border-b border-gray-200'>
									<h4 className='font-semibold'>Notes</h4>
									<span
										className={`${'bg-gray-100 border border-gray-200 text-gray-600  ml-2 py-1 px-2 rounded-lg shadow-sm text-xs'}`}
									>
										{noteCount}
									</span>
								</header>
								<div className='grid grid-flow-row gap-x-4 mt-3 text-sm'>
									<Note
										description={data.promo}
										nullState={'No applicable promos'}
									/>
									<Note
										description={data.shipping}
										nullState={'No shipping notes'}
									/>
									<Note
										description={data.notes}
										nullState={'No seller notes'}
									/>
									<Note
										description={data.variations}
										nullState={'No variation notes'}
									/>
								</div>
							</article>
						</article>
					</section>
					{/* comment section */}
					<article className='fixed bottom-0 w-full max-w-3xl text-gray-900 bg-white border-t border-gray-400'>
						<div className='pt-1 pb-4 px-4'>
							<form className='mt-3 text-sm'>
								<textarea
									name='comment'
									placeholder='Add a comment to this lead...'
									onChange={onChange}
									value={comment}
									className='h-12 xl:h-16 w-full rounded-lg border border-gray-400 text-sm ring-purple resize-none'
								/>
								{/* <div className='flex items-center justify-end'>
									<Button
										text={'Comment'}
										onClick={(e) => {
											e.preventDefault();
											dispatch(
												addComment({
													comment,
													userId,
													leadId: currentLead._id,
												})
											);
										}}
										width={null}
										margin={false}
										size={null}
										cta={comment ? true : false}
										path={null}
										conditional={null}
										conditionalDisplay={null}
									/>
								</div> */}
							</form>
						</div>
					</article>
				</div>
			</animated.section>
		</Fragment>
	);
};

interface HeaderButtonProps {
	activePath: JSX.Element;
	disabledPath: JSX.Element | null;
	onClick: () => void;
	state: boolean | null;
	description: JSX.Element;
	last: boolean;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({
	activePath,
	disabledPath,
	onClick,
	state,
	description,
	last,
}) => {
	// local state
	const [hover, setHover] = useState(false);

	return (
		<button
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onClick={() => onClick()}
			className={`relative ${
				last ? 'mr-0' : 'mr-2'
			} p-1 hover:bg-gray-100 rounded-md ${
				state && 'text-purple-600'
			} hover:text-gray-700 ring-gray transition duration-100 ease-in-out`}
		>
			{state || !disabledPath ? (
				<div className='flex items-center justify-center'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'
						fill='currentColor'
						stroke={state ? 'currentColor' : ''}
						className='svg-base'
					>
						{activePath}
					</svg>
				</div>
			) : (
				<div className='flex items-center justify-center'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 20 20'
						stroke='currentColor'
						className='svg-base'
					>
						{disabledPath}
					</svg>
				</div>
			)}
			{hover && (
				<div
					className={`absolute top-0 ${
						last ? 'right-0 translate-x-6' : 'left-1/2 -translate-x-1/2'
					}  z-40 min-w-max mt-2 mr-6 p-2 transform translate-y-6 rounded-md shadow-md bg-gray-900 text-left text-white text-xs`}
				>
					{description}
				</div>
			)}
		</button>
	);
};

interface PrimaryMetricProps {
	title: string;
	value: string;
}

const PrimaryMetric: React.FC<PrimaryMetricProps> = ({ title, value }) => {
	return (
		<div className='first:mt-0 mt-2 flex items-end justify-between'>
			<div className='text-sm text-gray-800'>{title}</div>
			<div className='py-1 px-2 rounded-lg bg-gray-900 font-semibold text-xs text-white shadow-sm hover:shadow-md transition duration-100 ease-in-out'>
				{value}
			</div>
		</div>
	);
};

interface ASINUtilityProps {
	text: string;
	path: JSX.Element;
	link: any;
	handleClick: null | (() => void);
	visible: boolean;
}

const ASINUtility: React.FC<ASINUtilityProps> = ({
	text,
	path,
	link,
	handleClick,
	visible,
}) => {
	// local state
	const [popupText, setPopupText] = useState(false);

	// if (!visible) return;

	return (
		<div className='relative ml-0.5'>
			{link ? (
				<a
					href={link}
					target='_blank'
					rel='noopener noreferrer'
					onMouseEnter={() => setPopupText(true)}
					onMouseLeave={() => setPopupText(false)}
					className='inline-block ml-2 text-gray-400 hover:text-gray-500 rounded-sm transition-main ring-gray'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						{path}
					</svg>
				</a>
			) : (
				<button
					onMouseEnter={() => setPopupText(true)}
					onMouseLeave={() => setPopupText(false)}
					onClick={() => {
						handleClick && handleClick();
						setPopupText(false);
					}}
					className='ml-2 text-gray-400 hover:text-gray-500 rounded-sm transition-main ring-gray'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						{path}
					</svg>
				</button>
			)}
			{popupText && (
				<div className='absolute z-40 left-1/2 flex items-center p-2 transform -translate-y-16 -translate-x-1/2 rounded-lg shadow-md bg-gray-900 text-white text-xs whitespace-nowrap'>
					{text}
				</div>
			)}
		</div>
	);
};

interface NoteProps {
	description: string;
	nullState: string;
	link?: string;
}

const Note: React.FC<NoteProps> = ({ description, nullState, link }) => {
	return (
		<div className='py-1'>
			{description && link ? (
				<a
					href={`https://www.rakuten.com/${link}`}
					target='__blank'
					rel='noopener noreferrer'
					className='py-1 px-2 rounded-lg bg-purple-500 border border-purple-500 text-xs text-white shadow-sm hover:bg-purple-600 hover:shadow-md transition duration-100 ease-in-out'
				>
					{description}
				</a>
			) : description ? (
				<div className='inline-block py-1 px-2 rounded-lg bg-gray-900 border border-gray-900 text-xs text-white shadow-sm'>
					{description}
				</div>
			) : (
				<div className='inline-block py-1 px-2 rounded-lg bg-gray-100 border border-gray-200 text-xs text-gray-600'>
					{nullState}
				</div>
			)}
		</div>
	);
};

export default Details;
