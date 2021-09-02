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

// redux
import { useAppDispatch, useAppSelector } from '@utils/hooks';
import {
	clearCurrentLead,
	handleLikeLead,
	handleArchiveLead,
	addComment,
} from '@features/leads/leadsSlice';

// components
import Button from '@components/layout/utils/Button';

// utils
import {
	calculateBSR,
	numberWithCommas,
	openLinkHandler,
	returnDomainFromUrl,
	truncate,
} from '@utils/utils';
import { Lead } from '@utils/interfaces/leads/Lead';

interface DetailsProps {
	currentLead: Lead;
	userId: string;
	liked: Lead[];
	archived: Lead[];
	comments: {
		date: string;
		leadId: string;
		comment: string;
	}[];
	showDetails: boolean;
	setShowDetails: React.Dispatch<boolean>;
}

const Details: React.FC<DetailsProps> = ({
	currentLead,
	userId,
	liked,
	archived,
	comments,
	showDetails,
	setShowDetails,
}) => {
	const dispatch = useAppDispatch();
	// redux selectors
	const unitFee = useAppSelector((state) => state.filters.prep.unit);
	const lbFee = useAppSelector((state) => state.filters.prep.lb);

	// local state
	const [comment, setComment] = useState('');
	const [copiedText, setCopiedText] = useState(false);
	const [copyText, setCopyText] = useState(false);
	const [fullTitle, toggleFullTitle] = useState(false);
	const [identifyingText, setIdentifyingText] = useState('');
	const [noteCount, setNoteCount] = useState(0);
	const [overviewActive, setOverviewActive] = useState(true);

	// descructure necessary items
	const { data } = currentLead;

	// prevent scroll while active
	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, []);

	// close modal on click outside
	const modalRef = useRef();
	const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
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
	const [like, setLike] = useState(
		liked.some((lead) => lead._id === currentLead._id) ? true : false
	);

	// like/archive/comment handlers
	useEffect(() => {
		if (liked.some((lead) => lead._id === currentLead._id)) {
			setLike(true);
		} else {
			setLike(false);
		}
	}, [liked, currentLead._id]);
	const [archive, setArchive] = useState(
		archived.some((lead) => lead._id === currentLead._id) ? true : false
	);
	useEffect(() => {
		if (archived.some((lead) => lead._id === currentLead._id)) {
			setArchive(true);
		} else {
			setArchive(false);
		}
	}, [archived, currentLead._id]);
	useEffect(() => {
		const hasComment = comments.filter(
			(comment) => comment.leadId === currentLead._id
		);
		if (hasComment.length > 0) {
			setComment(hasComment[0].comment);
		} else {
			setComment('');
		}
	}, [liked]);

	// primary links in details header
	const primaryLinks = [
		{ title: 'Overview', onClick: () => setOverviewActive(true) },
	];

	// buttons in details header
	const primaryButtons = [
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
				dispatch(handleLikeLead({ userId, leadId: currentLead._id })),
			state: like,
			description: <span>{like ? 'Unlike this lead' : 'Like this lead'}</span>,
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
				dispatch(handleArchiveLead({ userId, leadId: currentLead._id })),
			state: archive,
			description: (
				<span>{archive ? 'Unarchive this lead' : 'Archive this lead'}</span>
			),
		},
		{
			activePath: (
				<path
					fillRule='evenodd'
					d='M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z'
					clipRule='evenodd'
				/>
			),
			disabledPath: (
				<path
					fillRule='evenodd'
					d='M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z'
					clipRule='evenodd'
				/>
			),
			onClick: () => openLinkHandler(data.retailerLink, data.amzLink),
			state: null,
			description: <span>Open both links</span>,
		},
		{
			activePath: (
				<path
					fillRule='evenodd'
					d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
					clipRule='evenodd'
				/>
			),
			disabledPath: (
				<path
					fillRule='evenodd'
					d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
					clipRule='evenodd'
				/>
			),
			onClick: () => {
				dispatch(clearCurrentLead());
				setShowDetails(false);
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
			title: 'Estimated sales',
			value: `${numberWithCommas(data.monthlySales)} /mo.`,
		},
	];

	// set date
	const date = DateTime.fromISO(data.date).toFormat('LLL dd, H:mm');

	// set notes & handlers
	const notes: (string | null)[] = [
		data.promo,
		data.cashback,
		data.variations,
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
			<div
				// ref={modalRef}
				onClick={(e) => {
					closeModal(e);
					dispatch(clearCurrentLead());
					setShowDetails(false);
				}}
				className='absolute inset-0 z-10 h-full w-full bg-gray-900 opacity-25'
			/>
			<div className='fixed top-0 right-0 z-20 w-full max-w-2xl transform translate-y-16 -translate-x-32'>
				<div className='relative z-40 p-6 rounded-lg shadow-xl bg-white opacity-100'>
					<header className='flex items-center justify-between border-b border-gray-200'>
						<div>
							{primaryLinks.map((link, i) => (
								<button
									key={i}
									onClick={link.onClick}
									className={`${
										overviewActive &&
										'text-purple-500 hover:text-purple-500 border-b-2 border-purple-600'
									} pb-2 first:ml-0 ml-10 font-semibold text-lg text-gray-600 hover:text-gray-700 transition-colors duration-100 ease-in-out`}
								>
									{link.title}
								</button>
							))}
						</div>
						<div className='flex items-center justify-between'>
							<div className='flex items-center text-gray-400'>
								{primaryButtons.map((button, i) => (
									<HeaderButton
										key={i}
										activePath={button.activePath}
										disabledPath={button.disabledPath}
										onClick={button.onClick}
										state={button.state}
										description={button.description}
									/>
								))}
							</div>
						</div>
					</header>
					{/* overview page */}
					{overviewActive && (
						<div className='mt-4'>
							<div>
								<div className='flex justify-between'>
									<div className='w-1/3 z-40 bg-white'>
										<ReactImageMagnify
											{...{
												smallImage: {
													alt: data.title,
													isFluidWidth: true,
													src: data.img,
													width: 200,
													height: 200,
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
									<header className='relative w-2/3 ml-8'>
										<h3
											onMouseEnter={() => toggleFullTitle(true)}
											onMouseLeave={() => toggleFullTitle(false)}
											className='inline-block font-bold text-lg text-gray-900'
										>
											{truncate(data.title, 40)}
										</h3>
										{fullTitle && (
											<div className='absolute top-0 mt-2 mr-6 p-2 transform translate-y-6 rounded-md shadow-md bg-gray-900 text-white text-sm'>
												{data.title}
											</div>
										)}
										<div className='flex items-center mt-2 text-sm text-gray-800'>
											<div>{date}</div>
											<span className='h-1 w-1 ml-2 rounded-full bg-gray-400' />
											<div className='ml-2'>{data.brand}</div>
											<span className='h-1 w-1 ml-2 rounded-full bg-gray-400' />
											<div className='ml-2'>{truncate(data.category, 21)}</div>
										</div>
										<div className='mt-4'>
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
										</div>
									</header>
								</div>
								<article className='mt-4'>
									<header className='mt-4 pb-2 border-b border-gray-200'>
										<h4 className='font-semibold text-gray-900'>
											Detailed metrics
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
											<div className='flex items-center'>
												{data.asin ? (
													<a
														href={`https://sellercentral.amazon.com/product-search/search?q=${data.asin}`}
														target='_blank'
														rel='noopener noreferrer'
														className={`${data.asin && linkClasses}`}
													>
														{data.asin}
													</a>
												) : (
													<span>-</span>
												)}
												{data.asin && (
													<div className='relative'>
														<div className='flex items-center justify-center'>
															<button
																onMouseEnter={() => setCopyText(true)}
																onMouseLeave={() => setCopyText(false)}
																onClick={() => {
																	navigator.clipboard.writeText(data.asin);
																	setCopiedText(true);
																	setTimeout(function () {
																		setCopiedText(false);
																	}, 2000);
																}}
																className='ml-2 text-gray-400 hover:text-gray-600 rounded-sm transition duration-100 ease-in-out ring-gray'
															>
																<svg
																	xmlns='http://www.w3.org/2000/svg'
																	viewBox='0 0 20 20'
																	fill='currentColor'
																	className='h-4 w-4'
																>
																	<path d='M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z' />
																	<path d='M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z' />
																</svg>
															</button>
														</div>
													</div>
												)}
											</div>
											{(copyText || copiedText) && (
												<div className='absolute right-0 flex items-center p-2 transform -translate-y-2 -translate-x-6 rounded-lg shadow-md bg-gray-900 text-white text-xs'>
													{copiedText && (
														<svg
															xmlns='http://www.w3.org/2000/svg'
															viewBox='0 0 20 20'
															fill='currentColor'
															className='h-4 w-4 text-purple-300'
														>
															<path
																fillRule='evenodd'
																d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
																clipRule='evenodd'
															/>
														</svg>
													)}
													<span className={copiedText ? 'ml-1' : ''}>
														{copiedText
															? `${identifyingText} copied`
															: `Copy ${identifyingText}`}
													</span>
												</div>
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
													{data.competitorCount > 0 &&
														`(${data.competitorCount})`}
												</span>
												<span className='ml-1'>
													{data.competitorType || '-'}
												</span>
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
								<section className='flex justify-between mt-4'>
									{/* Notes section */}
									<article className='w-1/3 text-gray-900'>
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
												description={data.cashback}
												link={returnDomainFromUrl(data.retailerLink)}
												nullState={'No applicable cashback'}
											/>
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
									{/* comment section */}
									<article className='ml-8 w-2/3 text-gray-900'>
										<header className='flex items-center pb-2 border-b border-gray-200'>
											<h4 className='font-semibold border border-transparent'>
												Comments
											</h4>
										</header>
										<form className='mt-3 text-sm'>
											<textarea
												name='comment'
												placeholder='Add a comment to this lead...'
												onChange={onChange}
												value={comment}
												className='h-20 w-full rounded-lg border border-gray-200 text-sm ring-purple'
											/>
											<div className='flex items-center justify-end'>
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
											</div>
										</form>
									</article>
								</section>
							</div>
						</div>
					)}
				</div>
			</div>
		</Fragment>
	);
};

interface HeaderButtonProps {
	activePath: JSX.Element;
	disabledPath: JSX.Element;
	onClick: () => void;
	state: boolean | null;
	description: JSX.Element;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({
	activePath,
	disabledPath,
	onClick,
	state,
	description,
}) => {
	// local state
	const [hover, setHover] = useState(false);

	return (
		<button
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onClick={() => onClick()}
			className={`relative ml-2 p-1 hover:bg-gray-100 rounded-md ${
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
						className='h-5 w-5'
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
						className='h-5 w-5'
					>
						{disabledPath}
					</svg>
				</div>
			)}
			{hover && (
				<div className='absolute top-0 right-0 z-10 min-w-max mt-2 mr-6 p-2 transform translate-y-6 translate-x-8 rounded-md shadow-md bg-gray-900 text-left text-white text-sm'>
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
		<div className='first:mt-0 mt-1 flex items-end justify-between'>
			<div className='text-sm text-gray-800'>{title}</div>
			<div className='py-1 px-2 rounded-lg bg-gray-900 font-semibold text-xs text-white shadow-sm hover:shadow-md transition duration-100 ease-in-out'>
				{value}
			</div>
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
