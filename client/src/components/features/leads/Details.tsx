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

	// global classes
	const descriptorClasses = 'flex justify-between';
	const linkClasses = 'font-semibold text-purple-600 hover:text-gray-700';

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
			inactivePath: null,
			disabled: leads.indexOf(currentLead) === 0 ? true : false,
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
			inactivePath: null,
			disabled: false,
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
			inactivePath: (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					fillRule='evenodd'
					d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
					clipRule='evenodd'
				/>
			),
			disabled: false,
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
			inactivePath: (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z'
				/>
			),
			disabled: false,
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
			disabled: false,
			inactivePath: null,
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
			inactivePath: null,
			onClick: () => {
				setShowDetails(false);
				dispatch(clearCurrentLead());
			},
			disabled: false,
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

	// source utilities
	const sourceUtilities = [
		{
			text: data.cashback,
			path: (
				<path
					fillRule='evenodd'
					d='M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z'
					clipRule='evenodd'
				/>
			),
			link: `https://www.rakuten.com/${returnDomainFromUrl(data.retailerLink)}`,
			handleClick: null,
			disabled: data.cashback ? false : true,
		},
		{
			text: `Copy promo code: ${data.promo}`,
			path: (
				<path
					fillRule='evenodd'
					d='M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z'
					clipRule='evenodd'
				/>
			),
			link: null,
			handleClick: () => {
				navigator.clipboard.writeText(data.promo);
			},
			disabled: data.promo ? false : true,
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
			disabled: false,
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
			disabled: false,
		},
	];

	const detailedInformation = [
		{
			title: 'Source',
			value: (
				<a
					href={data.retailerLink}
					target='_blank'
					rel='noopener noreferrer'
					className={linkClasses}
				>
					{data.source || '-'}
				</a>
			),
			utility: (
				<div className='flex items-center'>
					{sourceUtilities.map((utility, i) => (
						<UtilityButton
							key={i}
							text={utility.text}
							path={utility.path}
							link={utility.link}
							handleClick={utility.handleClick}
							disabled={utility.disabled}
						/>
					))}
				</div>
			),
		},
		{
			title: identifyingText,
			value: (
				<a
					href={`https://amazon.com/gp/product/${data.asin}`}
					target='_blank'
					rel='noopener noreferrer'
					className={linkClasses}
				>
					{data.asin}
				</a>
			),
			utility: (
				<div className='flex items-center'>
					{ASINUtilities.map((utility, i) => (
						<UtilityButton
							key={i}
							text={utility.text}
							path={utility.path}
							link={utility.link}
							handleClick={utility.handleClick}
							disabled={utility.disabled}
						/>
					))}
				</div>
			),
		},
		{
			title: 'Buy price',
			value: <div>{`$${data.buyPrice.toFixed(2) || '-'}`}</div>,
			utility: null,
		},
		{
			title: 'Sell price',
			value: <div>{`$${data.sellPrice.toFixed(2) || '-'}`}</div>,
			utility: (
				<Trends
					currentValue={data.sellPrice}
					compareData={[
						{ value: data.price30, scale: '30' },
						{ value: data.price90, scale: '90' },
					]}
					lowerIsBetter={false}
					type={'recommended'}
					value={'sell price'}
				/>
			),
		},
		{
			title: 'Current BSR',
			value: <div>{numberWithCommas(data.bsrCurrent) || '-'}</div>,
			utility: (
				<Trends
					currentValue={data.bsrCurrent}
					compareData={[
						{ value: data.bsr30, scale: '30' },
						{ value: data.bsr90, scale: '90' },
					]}
					lowerIsBetter={true}
					type={'current'}
					value={'BSR'}
				/>
			),
		},
		{
			title: 'BSR %',
			value: (
				<div>
					{data.bsrCurrent && data.category && (
						<span>{calculateBSR(data.bsrCurrent, data.category)}%</span>
					)}
				</div>
			),
			utility: null,
		},
		{
			title: 'Competition',
			value: (
				<div>
					<span className='text-gray-500'>
						{data.competitorCount > 0 && `(${data.competitorCount})`}
					</span>
					<span className='ml-1'>{data.competitorType || '-'}</span>
				</div>
			),
			utility: null,
		},
		{
			title: 'Weight',
			value: (
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
			),
			utility: null,
		},
	];

	const notesInformation = [
		{
			title: 'Shipping notes',
			value: <div>{data.shipping ? data.shipping : 'None'}</div>,
			utility: null,
		},
		{
			title: 'Seller notes',
			value: <div>{data.notes ? data.notes : 'None'}</div>,
			utility: null,
		},
		{
			title: 'Variation notes',
			value: <div>{data.variations ? data.variations : 'None'}</div>,
			utility: null,
		},
	];

	// set notes & handlers
	const notes: (string | null)[] = [data.variations, data.notes, data.shipping];
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

	return (
		<Fragment>
			<animated.section
				style={animationStyle}
				// ref={modalRef}
				className='fixed top-0 right-0 z-20 w-full max-w-3xl'
			>
				<div className='relative z-40 min-h-screen shadow-2xl bg-gray-100 dark:bg-darkGray-400 border-l border-gray-300 dark:border-darkGray-200'>
					<header className='bg-white dark:bg-darkGray-300 border-b border-gray-300 dark:border-gray-900 shadow-sm'>
						<div className='flex items-center justify-between py-3 px-6 text-gray-500'>
							{/* navigation buttons */}
							<div className='flex items-center '>
								{navigationButtons.map((button, i) => (
									<HeaderButton
										key={i}
										activePath={button.activePath}
										inactivePath={button.inactivePath}
										disabled={button.disabled}
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
										inactivePath={button.inactivePath}
										disabled={button.disabled}
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
						<article className='flex justify-between p-4 bg-white dark:bg-darkGray-200 rounded-lg shadow-md border border-gray-300 dark:border-gray-900'>
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
									className='inline-block font-bold text-lg text-gray-900 dark:text-white'
								>
									{truncate(data.title, 40)}
								</h3>
								{fullTitle && (
									<div className='absolute top-0 mt-2 mr-6 p-2 transform translate-y-6 rounded-md shadow-md bg-gray-900 text-white text-xs'>
										{data.title}
									</div>
								)}
								<aside className='flex items-center mt-2 text-sm text-gray-800 dark:text-gray-200'>
									<div>{date}</div>
									<span className='h-1 w-1 ml-2 rounded-full bg-gray-400' />
									<div className='ml-2'>{data.category}</div>
								</aside>
								<article className='mt-6'>
									<header className='mt-4 pb-2 border-b border-gray-200'>
										<h4 className='font-semibold text-gray-900 dark:text-white'>
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
						<article className='mt-4 pt-4 pb-3 bg-white dark:bg-darkGray-200 rounded-lg shadow-md border border-gray-300 dark:border-gray-900'>
							<header className='pb-2 border-b border-gray-200'>
								<h4 className='px-4 font-semibold text-gray-900'>
									Detailed information
								</h4>
							</header>
							<dl className='grid grid-cols-1 grid-rows-4 gap-y-2 gap-x-6 mt-4 text-sm text-gray-800'>
								{detailedInformation.map((item, i) => (
									<DetailedItem
										key={i}
										title={item.title}
										value={item.value}
										utility={item.utility}
									/>
								))}
							</dl>
						</article>
						<article className='mt-4 pt-4 pb-3 bg-white dark:bg-darkGray-200 rounded-lg shadow-md border border-gray-300 dark:border-gray-900'>
							<header className='flex items-center pb-2 border-b border-gray-200'>
								<h4 className='pl-4 font-semibold text-gray-900'>Notes</h4>{' '}
								<span className='ml-2 py-1 px-2 bg-gray-100 border border-gray-200 text-gray-600 rounded-lg shadow-sm text-xs'>
									{noteCount}
								</span>
							</header>
							<dl className='grid grid-cols-1 grid-rows-3 gap-y-2 gap-x-6 mt-4 text-sm text-gray-800'>
								{notesInformation.map((note, i) => (
									<DetailedItem
										key={i}
										title={note.title}
										value={note.value}
										utility={note.utility}
									/>
								))}
							</dl>
						</article>
					</section>
					{/* comment section */}
					<article className='fixed bottom-0 w-full max-w-3xl text-gray-900 bg-white dark:bg-darkGray-300 border-t border-gray-300 dark:border-gray-900'>
						<div className='pt-1 pb-4 px-4'>
							<form className='mt-3 text-sm'>
								<textarea
									name='comment'
									placeholder='Add a comment to this lead...'
									onChange={onChange}
									value={comment}
									className='h-12 xl:h-16 w-full dark:bg-darkGray-200 rounded-lg border border-gray-300 dark:border-gray-900 text-sm ring-purple resize-none'
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
	inactivePath: JSX.Element | null;
	disabled: boolean;
	onClick: () => void;
	state: boolean | null;
	description: JSX.Element;
	last: boolean;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({
	activePath,
	inactivePath,
	disabled,
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
			onClick={() => !disabled && onClick()}
			className={`relative ${
				last ? 'mr-0' : 'mr-2'
			} p-1 hover:bg-gray-100 rounded-md ${state && 'text-purple-600'} ${
				disabled ? 'text-red-200' : ''
			} hover:text-gray-700 ring-gray transition-main`}
		>
			{state || !inactivePath ? (
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
						{inactivePath}
					</svg>
				</div>
			)}
			{hover && (
				<div
					className={`absolute top-0 ${
						last ? 'right-0 translate-x-6' : 'left-1/2 -translate-x-1/2'
					}  z-40 min-w-max mt-2 mr-6 p-2 transform translate-y-8 rounded-md shadow-md bg-gray-900 text-left text-white text-xs`}
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
			<dt className='text-sm text-gray-600'>{title}</dt>
			<dd className='py-1 px-2 rounded-lg bg-gray-900 font-semibold text-xs text-white shadow-sm hover:shadow-md transition duration-100 ease-in-out'>
				{value}
			</dd>
		</div>
	);
};

interface DetailedItemProps {
	title: string;
	value: JSX.Element;
	utility: JSX.Element | null;
}

const DetailedItem: React.FC<DetailedItemProps> = ({
	title,
	value,
	utility,
}) => {
	return (
		<div className='relative flex items-center pb-2 last:pb-0 border-b border-gray-100 last:border-none'>
			<dt className='w-2/5 text-gray-600 pl-4'>{title}</dt>
			<div className='flex items-center w-3/5 pr-4 text-gray-800'>
				<dd>{value}</dd>
				{utility && utility}
			</div>
		</div>
	);
};

interface UtilityButtonProps {
	text: string;
	path: JSX.Element;
	link: any;
	handleClick: null | (() => void);
	disabled: boolean;
}

const UtilityButton: React.FC<UtilityButtonProps> = ({
	text,
	path,
	link,
	handleClick,
	disabled,
}) => {
	// local state
	const [popupText, setPopupText] = useState(false);

	if (disabled) return null;

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

interface TrendProps {
	currentValue: number;
	compareValue: number | undefined;
	scale: string;
	lowerIsBetter: boolean;
	type: string;
	value: string;
}

const Trend: React.FC<TrendProps> = ({
	currentValue,
	compareValue,
	scale,
	lowerIsBetter,
	type,
	value,
}) => {
	// local state
	const [showPopup, setShowPopup] = useState(false);
	const [isGood, setIsGood] = useState(false);
	const [trend, setTrend] = useState<'up' | 'down' | 'same' | null>(null);

	const currentValueGreater =
		compareValue && currentValue > compareValue ? true : false;

	useEffect(() => {
		if (currentValue === compareValue) {
			setTrend('same');
		} else if (currentValueGreater) {
			setTrend('up');
			if (lowerIsBetter) {
				setIsGood(false);
			} else {
				setIsGood(true);
			}
		} else {
			setTrend('down');
			if (lowerIsBetter) {
				setIsGood(true);
			} else {
				setIsGood(false);
			}
		}
	});

	const svgList = {
		up: (
			<path
				fillRule='evenodd'
				d='M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z'
				clipRule='evenodd'
			/>
		),
		down: (
			<path
				fillRule='evenodd'
				d='M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z'
				clipRule='evenodd'
			/>
		),
		same: (
			<path
				fillRule='evenodd'
				d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
				clipRule='evenodd'
			/>
		),
	};

	if (!compareValue) return null;

	const percentDifference = (
		100 * +Math.abs(1 - currentValue / compareValue)
	).toFixed(0);

	return (
		<div
			onMouseEnter={() => setShowPopup(true)}
			onMouseLeave={() => setShowPopup(false)}
			className={`relative flex items-center ml-2 py-0.5 pl-2 pr-1 ${
				isGood ? 'bg-teal-200 text-teal-600' : 'bg-gray-100 text-gray-600'
			} text-xs font-semibold rounded-lg`}
		>
			<span>{scale} day</span>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				className='h-4 w-4 ml-0.5'
				viewBox='0 0 20 20'
				fill='currentColor'
			>
				{trend !== null && svgList[trend]}
			</svg>
			<span>{percentDifference}%</span>
			{showPopup && (
				<div className='absolute z-40 left-1/2 flex items-center p-2 transform -translate-y-8  -translate-x-1/2 rounded-lg shadow-md bg-gray-900 text-white text-xs whitespace-nowrap'>
					{`The ${type} ${value} is ${percentDifference}% ${
						currentValueGreater ? 'higher' : 'lower'
					} than the ${scale} day average`}
				</div>
			)}
		</div>
	);
};

interface TrendsProps {
	currentValue: number;
	compareData: { value: number | undefined; scale: string }[];
	lowerIsBetter: boolean;
	type: string;
	value: string;
}

const Trends: React.FC<TrendsProps> = ({
	currentValue,
	compareData,
	lowerIsBetter,
	type,
	value,
}) => {
	return (
		<div className='ml-2 flex items-center'>
			{compareData.map((c, i) => (
				<Trend
					key={i}
					currentValue={currentValue}
					compareValue={c.value}
					scale={c.scale}
					lowerIsBetter={lowerIsBetter}
					type={type}
					value={value}
				/>
			))}
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
