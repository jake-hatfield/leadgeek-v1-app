import React, {
	Fragment,
	useState,
	useEffect,
	useRef,
	useCallback,
} from 'react';

// packages
import axios from 'axios';
import { DateTime } from 'luxon';
import ReactImageMagnify from 'react-image-magnify';
import { animated, useSpring } from 'react-spring';
import { useHotkeys } from 'react-hotkeys-hook';

// redux
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { setAlert } from '@features/alert/alertSlice';
import {
	addComment,
	clearCurrentLead,
	handleLikeLead,
	handleArchiveLead,
	setCurrentLead,
	setPage,
	showDetails,
	hideDetails,
} from '@features/leads/leadsSlice';

// components
import Badge from '@components/utils/Badge';
import Button from '@components/utils/Button';
import DescriptionList from '@components/utils/DescriptionList';

// utils
import {
	calculateBSR,
	config,
	numberWithCommas,
	openLinkHandler,
	returnDomainFromUrl,
	truncate,
} from '@utils/utils';
import { Lead } from '@utils/interfaces/Lead';
import { User } from '@utils/interfaces/User';

const feedbackReasons = [
	`-- Select an option --`,
	`Buy price not as stated`,
	`Sell price not as stated`,
	`Promo expired/invalid`,
	`Source is out of stock`,
	`Items do not match`,
	`Low profit margin`,
	`Low ROI`,
	`Low monthly sales`,
	`Too many competitors`,
	`# of competitors not as stated`,
	`Shipping costs too high`,
	`Other`,
] as const;

type FeedbackReasons = typeof feedbackReasons[number];
interface FeedbackState {
	modalActive: boolean;
	optionsActive: boolean;
	reason: FeedbackReasons;
	comment: string;
}

interface DetailsProps {
	user: User;
	type: 'feed' | 'liked' | 'archived' | 'search';
	currentLead: Lead;
	animationStyle: any;
}

const Details: React.FC<DetailsProps> = ({
	user,
	type,
	currentLead,
	animationStyle,
}) => {
	const dispatch = useAppDispatch();

	// lead state
	const leads = useAppSelector((state) => state.leads[type].pageByIds);
	const currentLeadStatus = useAppSelector(
		(state) => state.leads.currentLeadStatus
	);
	const details = useAppSelector((state) => state.leads.details);
	// filter state
	const itemLimit = useAppSelector((state) => state.filters.itemLimit);
	const unitFee = useAppSelector((state) => state.filters.prep.unit);
	const lbFee = useAppSelector((state) => state.filters.prep.lb);
	const page = useAppSelector((state) => state.leads[type].pagination.page);
	const lastPage = useAppSelector(
		(state) => state.leads[type].pagination.lastPage
	);

	// local state
	const [comment, setComment] = useState('');
	const [feedbackState, setFeedbackState] = useState<FeedbackState>({
		modalActive: false,
		optionsActive: false,
		reason: feedbackReasons[0],
		comment: '',
	});
	const [firstItemFirstPage, setFirstItemFirstPage] = useState(false);
	const [fullTitle, toggleFullTitle] = useState(false);
	const [identifyingText, setIdentifyingText] = useState('');
	const [lastItemLastPage, setLastItemLastPage] = useState(false);
	const [newComment, setNewComment] = useState('');
	const [noteCount, setNoteCount] = useState(0);
	const [showComment, setShowComment] = useState(false);

	useEffect(() => {
		if (currentLead) {
			dispatch(showDetails());
			setFeedbackState((prevState) => ({
				...prevState,
				comment: '',
			}));
		} else {
			dispatch(hideDetails());
		}
	}, [currentLead, dispatch]);

	// destructure necessary items
	const {
		data: {
			amzLink,
			asin,
			bsr30,
			bsr90,
			bsrCurrent,
			buyPrice,
			cashback,
			category,
			competitorCount,
			competitorType,
			date,
			img,
			monthlySales,
			netProfit,
			notes,
			price30,
			price90,
			promo,
			retailerLink,
			roi,
			sellPrice,
			shipping,
			source,
			title,
			variations,
			weight,
		},
	} = currentLead;

	// set date
	const formattedDate = DateTime.fromISO(date).toFormat('LLL dd @ H:mm');

	// close comment box on click outside
	const commentRef = useRef<any>(null);

	useEffect(() => {
		const handleClickOutside = (e: any) => {
			setShowComment(false);

			if (newComment === comment) {
				return;
			}

			if (!commentRef.current.contains(e.target as Node)) {
				dispatch(
					addComment({
						comment: newComment,
						leadId: currentLead._id,
					})
				);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [
		commentRef,
		setShowComment,
		dispatch,
		newComment,
		comment,
		currentLead._id,
	]);

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
			const comment = hasComment[0].comment;
			setNewComment(comment);
			setComment(comment);
		} else {
			setNewComment('');
			setComment('');
		}
	}, [user?.comments, currentLead, comment]);

	// prev/next navigation
	const getLead = (val: number) => {
		const currentIndex = leads.indexOf(currentLead);
		const nextIndex = currentIndex + val;

		if (nextIndex === itemLimit || nextIndex === -1) {
			return dispatch(setPage({ page: page + val, type }));
		}
		setFeedbackState((prevState) => ({
			...prevState,
			modalActive: false,
			optionsActive: false,
			reason: feedbackReasons[0],
			comment: '',
		}));
		return dispatch(setCurrentLead(leads[nextIndex]));
	};

	// disable previous when the first item of the first page is in view
	useEffect(() => {
		if (leads.indexOf(currentLead) === 0 && page === 1) {
			return setFirstItemFirstPage(true);
		} else if (
			leads.indexOf(currentLead) === leads.length - 1 &&
			page === lastPage
		) {
			return setLastItemLastPage(true);
		}
		setFirstItemFirstPage(false);
		return setLastItemLastPage(false);
	}, [leads, currentLead, page, lastPage]);

	// hotkeys
	// close details on escape key
	useHotkeys(
		'Escape',
		() => {
			details && removeDetails();
		},
		{ keyup: true },
		[currentLead, details]
	);
	// open both links on o key
	useHotkeys(
		'v',
		() =>
			setFeedbackState((prevState) => ({
				...prevState,
				modalActive: !prevState.modalActive,
				optionsActive: false,
			})),
		{ keyup: true },
		[currentLead]
	);
	// open both links on o key
	useHotkeys(
		't',
		() => {
			openLinkHandler(retailerLink, amzLink);
		},
		{ keyup: true },
		[currentLead]
	);
	// like on l key
	useHotkeys(
		's',
		() => {
			dispatch(handleLikeLead({ leadId: currentLead._id }));
		},
		{ keyup: true },
		[currentLead]
	);
	// archive on a key
	useHotkeys(
		'a',
		() => {
			dispatch(handleArchiveLead({ leadId: currentLead._id }));
		},
		{ keyup: true },
		[currentLead]
	);
	// get prev lead on d key
	useHotkeys(
		'd',
		() => {
			currentLeadStatus === 'idle' && !firstItemFirstPage && getLead(-1);
		},
		{ keyup: true },
		[currentLead, currentLeadStatus, firstItemFirstPage]
	);
	// get next lead on f key
	useHotkeys(
		'f',
		() => {
			currentLeadStatus === 'idle' && !lastItemLastPage && getLead(1);
		},
		{ keyup: true },
		[currentLead, currentLeadStatus, lastItemLastPage]
	);

	const animationTimeout = 250;

	// close details handler
	const removeDetails = () => {
		dispatch(hideDetails());
		return setTimeout(() => {
			dispatch(clearCurrentLead());
		}, animationTimeout + 1);
	};

	const feedbackModalRef = useRef<any>(null);

	useEffect(() => {
		function handleClickOutside(e: any) {
			if (!feedbackModalRef.current?.contains(e.target)) {
				setFeedbackState((prevState) => ({
					...prevState,
					modalActive: false,
					optionsActive: false,
				}));
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [feedbackModalRef, setFeedbackState]);

	// close modal handlers
	const dropdownRef = useRef<any>(null);

	const handleClick = (e: any) => {
		if (!dropdownRef.current?.contains(e.target)) {
			return setFeedbackState((prevState) => ({
				...prevState,
				optionsActive: false,
			}));
		}

		setFeedbackState((prevState) => ({
			...prevState,
			optionsActive: !prevState.optionsActive,
		}));
	};

	useEffect(() => {
		const handleClick = (e: any) => {
			if (!dropdownRef.current?.contains(e.target)) {
				return setFeedbackState((prevState) => ({
					...prevState,
					optionsActive: false,
				}));
			}
		};
		document.addEventListener('click', handleClick);
		return () => {
			document.removeEventListener('click', handleClick);
		};
	}, [dropdownRef, setFeedbackState]);

	const handleEmptyComment = (reason: FeedbackReasons, comment: string) => {
		if (reason === 'Other' && !comment)
			return dispatch(
				setAlert({
					title: 'Comment required',
					message: 'Please share a quick comment for your feedback reason',
					alertType: 'warning',
				})
			);
	};

	const handleFeedback = (reason: FeedbackReasons, comment: string) => {
		if (reason === '-- Select an option --') {
			return dispatch(
				setAlert({
					title: 'Feedback required',
					message: 'Please select a feedback option from the dropdown',
					alertType: 'warning',
				})
			);
		}

		if (reason === 'Other' && !comment) {
			handleEmptyComment(feedbackState.reason, feedbackState.comment);
		} else {
			handleSlackFeedback();
			setFeedbackState((prevState) => ({
				...prevState,
				modalActive: false,
				optionsActive: false,
				reason: feedbackReasons[0],
				comment: '',
			}));
			dispatch(
				setAlert({
					title: 'Feedback submitted',
					message: 'We really value your input, thank you!',
					alertType: 'success',
				})
			);
		}
	};

	const handleSlackFeedback = async () => {
		const body = JSON.stringify({
			event: {
				type: 'feedback',
				data: {
					name: user?.name,
					email: user?.email,
					asin,
					message: {
						reason: feedbackState.reason ? feedbackState.reason : 'UNKNOWN',
						comment: feedbackState.comment
							? feedbackState.comment
							: 'No comment provided...',
					},
				},
			},
		});

		await axios.post('/api/users/slack-webhook', body, config);
	};

	// header buttons

	// navigation
	const navigationButtons = [
		{
			type: 'navLeft',
			disabled:
				(page === 1 && leads.indexOf(currentLead) === 0) ||
				currentLeadStatus === 'loading'
					? true
					: false,
			onClick: () => getLead(-1),
			state: false,
			title: 'Previous lead',
			description: 'D',
			edge: 'left',
		},
		{
			type: 'navRight',
			disabled:
				(page === lastPage &&
					leads.indexOf(currentLead) === leads.length - 1) ||
				currentLeadStatus === 'loading'
					? true
					: false,
			onClick: () => getLead(1),
			state: false,
			title: 'Next lead',
			description: 'F',
			edge: null,
		},
	];

	// utility
	const utilityButtons = [
		{
			type: 'like',
			disabled: false,
			onClick: () => dispatch(handleLikeLead({ leadId: currentLead._id })),
			state: like,
			title: like ? 'Unlike lead' : 'Like lead',
			description: 'S',
			edge: null,
		},
		{
			type: 'archive',
			disabled: false,
			onClick: () => dispatch(handleArchiveLead({ leadId: currentLead._id })),
			state: archive,
			title: archive ? 'Unarchive lead' : 'Archive lead',
			description: 'A',
			edge: null,
		},
		{
			type: 'links',
			disabled: false,
			onClick: () => openLinkHandler(retailerLink, amzLink),
			state: null,
			title: 'Open links',
			description: 'T',
			edge: null,
		},
		{
			type: 'feedback',
			disabled: false,
			onClick: () => {
				setFeedbackState((prevState) => ({
					...prevState,
					modalActive: !prevState.modalActive,
				}));
			},
			state: null,
			title: 'Submit feedback',
			description: 'V',
			edge: 'right',
		},
		{
			type: 'close',
			disabled: false,
			onClick: () => {
				removeDetails();
			},
			state: null,
			title: 'Close details',
			description: 'Esc',
			edge: 'right',
		},
	];

	// primary metrics on right side of details popup
	const primaryMetrics = [
		{
			title: 'Net profit',
			value: `$${(
				netProfit - (unitFee || (lbFee ? lbFee * weight : 0))
			).toFixed(2)}`,
		},
		{
			title: 'Return on investment',
			value: `${(
				((+netProfit.toFixed(2) - (unitFee || (lbFee ? lbFee * weight : 0))) /
					+buyPrice.toFixed(2)) *
				100
			).toFixed(0)}%`,
		},
		{
			title: 'Estimated sales / mo.',
			value: `${numberWithCommas(monthlySales)}`,
		},
	];

	// source utilities
	const sourceUtilities = [
		{
			text: cashback,
			path: (
				<path
					fillRule='evenodd'
					d='M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z'
					clipRule='evenodd'
				/>
			),
			link: `https://www.rakuten.com/${returnDomainFromUrl(retailerLink)}`,
			handleClick: null,
			disabled: cashback ? false : true,
		},
		{
			text: `Copy promo code: ${promo}`,
			path: (
				<path
					fillRule='evenodd'
					d='M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z'
					clipRule='evenodd'
				/>
			),
			link: null,
			handleClick: () => {
				navigator.clipboard.writeText(promo);
				dispatch(
					setAlert({
						title: 'Success',
						message: 'Promo code copied to your clipboard',
						alertType: 'success',
					})
				);
			},
			disabled: promo ? false : true,
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
				navigator.clipboard.writeText(asin);
				dispatch(
					setAlert({
						title: 'Success',
						message: `${identifyingText} copied to your clipboard`,
						alertType: 'success',
					})
				);
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
			link: `https://sellercentral.amazon.com/product-search/search?q=${asin}`,
			handleClick: null,
			disabled: false,
		},
	];

	// detailed information items
	const detailedInformation = [
		{
			title: 'Source',
			value: (
				<a
					href={retailerLink}
					target='_blank'
					rel='noopener noreferrer'
					className='link'
				>
					{source || '-'}
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
					href={`https://amazon.com/gp/product/${asin}`}
					target='_blank'
					rel='noopener noreferrer'
					className='link'
				>
					{asin}
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
			value: <div>{`$${buyPrice.toFixed(2) || '-'}`}</div>,
		},
		{
			title: 'Sell price',
			value: <div>{`$${sellPrice.toFixed(2) || '-'}`}</div>,
			utility: (
				<Trends
					currentValue={sellPrice}
					compareData={[
						{ value: price30, scale: '30' },
						{ value: price90, scale: '90' },
					]}
					lowerIsBetter={false}
					type={'recommended'}
					value={'sell price'}
				/>
			),
		},
		{
			title: 'Current BSR',
			value: <div>{numberWithCommas(bsrCurrent) || '-'}</div>,
			utility: (
				<Trends
					currentValue={bsrCurrent}
					compareData={[
						{ value: bsr30, scale: '30' },
						{ value: bsr90, scale: '90' },
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
					{bsrCurrent && category && (
						<span>{calculateBSR(bsrCurrent, category)}%</span>
					)}
				</div>
			),
		},
		{
			title: 'Competition',
			value: (
				<div>
					{competitorCount > 0 && (
						<span className='text-100'>{`(${competitorCount})`}</span>
					)}
					<span className={competitorCount > 0 ? 'ml-1' : ''}>
						{competitorType || '-'}
					</span>
				</div>
			),
		},
		{
			title: 'Weight',
			value: (
				<div>
					{weight ? (
						<span>
							{weight.toFixed(2)}
							<span className='ml-1 text-100'>lb</span>
						</span>
					) : (
						<span>-</span>
					)}
				</div>
			),
		},
	];

	// notes items
	const notesInformation = [
		{
			title: 'Shipping notes',
			value: <div>{shipping ? shipping : 'None'}</div>,
		},
		{
			title: 'Seller notes',
			value: <div>{notes ? notes : 'None'}</div>,
		},
		{
			title: 'Variation notes',
			value: <div>{variations ? variations : 'None'}</div>,
		},
	];

	// set notes & handlers
	const checkNotes = useCallback(() => {
		const formattedNotes: (string | null)[] = [variations, notes, shipping];
		setNoteCount(formattedNotes.filter((note) => note !== '').length);
	}, [variations, notes, shipping]);
	useEffect(() => {
		if (currentLead) {
			checkNotes();
		}
	}, [currentLead, checkNotes]);

	// set ASIN/ISBN identifying text
	useEffect(() => {
		if (asin.startsWith('B', 0)) {
			setIdentifyingText('ASIN');
		} else {
			setIdentifyingText('ISBN');
		}
	}, [asin]);

	// change handler for comments
	const onCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewComment(e.target.value);
	};

	const commentAnimationStyle = useSpring({
		height: showComment ? '8rem' : '4rem',
	});

	return (
		<Fragment>
			<animated.section
				style={animationStyle}
				className='fixed top-0 bottom-0 right-0 z-20 w-full max-w-3xl'
			>
				<div className='relative cs-bg border-l border-300 shadow-2xl'>
					<header className='pr-2 cs-light-400 border-b border-300 shadow-sm'>
						<div className='center-between py-3 px-6 text-100'>
							{/* navigation buttons */}
							<div className='flex items-center'>
								{navigationButtons.map((button, i) => (
									<HeaderButton
										key={i}
										disabled={button.disabled}
										onClick={button.onClick}
										state={button.state}
										type={button.type}
										title={button.title}
										description={button.description}
										edge={button.edge}
									/>
								))}
							</div>
							{/* utility buttons */}
							<div className='flex items-center'>
								{utilityButtons.map((button, i) => (
									<HeaderButton
										key={i}
										disabled={button.disabled}
										onClick={button.onClick}
										state={button.state}
										type={button.type}
										title={button.title}
										description={button.description}
										edge={button.edge}
									/>
								))}
							</div>
						</div>
					</header>
					{/* feedback modal */}
					{feedbackState.modalActive && (
						<div
							ref={feedbackModalRef}
							className='absolute top-0 right-0 z-30 pt-4 w-full max-w-sm mt-16 mr-16 card-300 cs-light-100 text-sm'
						>
							<div ref={dropdownRef} className='relative mx-4'>
								<button
									type='button'
									className='overflow-x-hidden relative w-full pl-2 pr-10 py-2 input border border-300 rounded-lg text-left cursor-default ring-purple ring-inset'
									aria-haspopup='listbox'
									aria-expanded='true'
									aria-labelledby='listbox-label'
									onClick={(e) => {
										handleClick(e);
									}}
								>
									<span className='flex items-center'>
										<span className='ml-2 block truncate'>
											{feedbackState.reason}
										</span>
									</span>
									<span className='ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none border-l border-300 pl-2'>
										<svg
											className='h-4 w-4 text-gray-400'
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 20 20'
											fill='currentColor'
											aria-hidden='true'
										>
											<path
												fillRule='evenodd'
												d='M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
												clipRule='evenodd'
											/>
										</svg>
									</span>
								</button>
								{feedbackState.optionsActive && (
									<ul
										className='absolute top-0 right-0 z-10 w-full mt-1 py-1.5 cs-light-300 card-200 text-sm overflow-auto focus:outline-none transform translate-y-10 minimal-scrollbar'
										tabIndex={-1}
										role='listbox'
										aria-labelledby='listbox-label'
										aria-activedescendant='listbox-option-3'
									>
										{feedbackReasons.map((feedbackReason, i) => (
											<li
												key={i}
												className={`py-2 pl-3 pr-9 cursor-default select-none relative ${
													feedbackState.reason === feedbackReason
														? 'cs-purple'
														: 'hover:bg-gray-100 dark:hover:bg-darkGray-100 text-300'
												}`}
												id={`listbox-option-${i}`}
												role='option'
												aria-selected='true'
												onClick={() => {
													setFeedbackState((prevState) => ({
														...prevState,
														reason: feedbackReason,
														optionsActive: false,
													}));
												}}
											>
												{feedbackReason}
											</li>
										))}
									</ul>
								)}
								<textarea
									name='feedback'
									placeholder={`Have some input on this lead? Share your thoughts, and our team will review your feedback... 🔍`}
									onChange={(e) => {
										const { value } = e.target;
										setFeedbackState((prevState) => ({
											...prevState,
											comment: value,
										}));
									}}
									value={feedbackState.comment}
									maxLength={1800}
									className='h-20 w-full input mt-4 rounded-main border border-300 text-sm placeholder-gray-700 ring-purple resize-none'
								/>
							</div>
							<div className='flex justify-end mt-2 py-2 px-4 cs-bg rounded-b-lg border-t border-300'>
								<div className='flex items-center'>
									<Button
										text={'Submit'}
										onClick={() => {
											handleFeedback(
												feedbackState.reason,
												feedbackState.comment
											);
										}}
										width={null}
										margin={true}
										size={'sm'}
										cta={true}
										path={null}
										conditional={null}
										conditionalDisplay={null}
									/>
								</div>
							</div>
						</div>
					)}
					<div className='h-screen overflow-x-hidden overflow-y-scroll minimal-scrollbar'>
						<section className='mb-80 pl-6 pr-8'>
							<article className='flex justify-between mt-4 py-4 card-padding-x cs-light-300 card-200'>
								<div className='w-2/5 h-56 z-10'>
									<ReactImageMagnify
										{...{
											smallImage: {
												alt: title,
												isFluidWidth: false,
												src: img,
												width: 225,
												height: 225,
											},
											largeImage: {
												alt: title,
												src: img,
												width: 600,
												height: 600,
											},
											enlargedImageContainerDimensions: {
												width: '200%',
												height: '200%',
											},
											className: 'bg-white bg-contain',
											enlargedImageContainerClassName: 'bg-white card-400',
										}}
									/>
								</div>
								<header className='relative w-3/5 ml-8'>
									<h3
										onMouseEnter={() => toggleFullTitle(true)}
										onMouseLeave={() => toggleFullTitle(false)}
										className='inline-block font-bold text-lg text-gray-900 dark:text-white'
									>
										{truncate(title, 35)}
									</h3>
									{fullTitle && (
										<div className='absolute top-0 mt-2 mr-6 p-2 rounded-md shadow-md cs-darkGray text-xs transform translate-y-6'>
											{title}
										</div>
									)}
									<aside className='flex items-center mt-2 text-sm text-200'>
										<div>{formattedDate}</div>
										<span className='h-1 w-1 ml-2 rounded-full bg-gray-400 dark:bg-gray-700' />
										<div className='ml-2'>{category}</div>
									</aside>
									<article className='mt-6'>
										<header className='mt-4 pb-2 border-b border-200'>
											<h4 className='font-semibold text-300'>
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
							<article className='mt-4 py-4 cs-light-300 card-200'>
								<header className='card-padding-x pb-4 border-b border-200'>
									<h4 className='font-semibold text-gray-900 dark:text-white'>
										Detailed information
									</h4>
								</header>
								<dl className='grid grid-cols-1 grid-rows-4 gap-y-2 gap-x-6 mt-4 text-sm text-gray-800'>
									{detailedInformation.map((item, i) => (
										<DescriptionList
											key={i}
											title={item.title}
											value={item.value}
											utility={item.utility && item.utility}
										/>
									))}
								</dl>
							</article>
							<article className='my-4 py-4 cs-light-300 card-200'>
								<header className='flex items-center pb-4 card-padding-x border-b border-200'>
									<h4 className='font-semibold text-300'>Notes</h4>{' '}
									<span className='ml-2 py-1 px-2 bg-gray-100 dark:bg-gray-900 text-300 rounded-main text-xs font-semibold'>
										{noteCount}
									</span>
								</header>
								<dl className='grid grid-cols-1 grid-rows-3 gap-y-2 gap-x-6 mt-4 text-sm text-200'>
									{notesInformation.map((note, i) => (
										<DescriptionList
											key={i}
											title={note.title}
											value={note.value}
										/>
									))}
								</dl>
							</article>
						</section>
						{/* comment section */}
						<article className='fixed bottom-0 w-full max-w-3xl text-300 cs-light-400 border-t border-300'>
							<div className='pt-1 pb-4 pl-4 pr-12'>
								<form ref={commentRef} className='relative mt-3 text-sm'>
									<animated.textarea
										name='comment'
										placeholder='Add a comment to this lead...'
										onChange={onCommentChange}
										onClick={() =>
											!showComment && setShowComment((prev) => !prev)
										}
										value={newComment}
										className='w-full input rounded-main border border-300 text-sm placeholder-gray-700 ring-purple resize-none'
										style={commentAnimationStyle}
									/>
								</form>
							</div>
						</article>
					</div>
				</div>
			</animated.section>
		</Fragment>
	);
};

interface HeaderButtonProps {
	disabled: boolean;
	onClick: () => void;
	state: boolean | null;
	type: string;
	title: string;
	description: string;
	edge: any;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({
	disabled,
	onClick,
	state,
	type,
	title,
	description,
	edge,
}) => {
	// local state
	const [hover, setHover] = useState(false);

	const svgs = [
		{
			type: 'navLeft',
			active: (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					stroke={state ? 'currentColor' : ''}
					className='svg-base'
				>
					<path
						fillRule='evenodd'
						d='M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z'
						clipRule='evenodd'
					/>
				</svg>
			),
			inactive: null,
		},
		{
			type: 'navRight',
			active: (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					stroke={state ? 'currentColor' : ''}
					className='svg-base'
				>
					<path
						fillRule='evenodd'
						d='M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z'
						clipRule='evenodd'
					/>
				</svg>
			),
			inactive: null,
		},
		{
			type: 'like',
			active: (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					stroke={state ? 'currentColor' : ''}
					className='svg-base'
				>
					<path
						fillRule='evenodd'
						d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
						clipRule='evenodd'
					/>
				</svg>
			),
			inactive: (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 20 20'
					stroke='currentColor'
					className='svg-base'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						fillRule='evenodd'
						d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
						clipRule='evenodd'
					/>
				</svg>
			),
		},
		{
			type: 'archive',
			active: (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 -1 20 20'
					fill='currentColor'
					stroke={state ? 'currentColor' : ''}
					className='svg-base'
				>
					<path
						fillRule='evenodd'
						d='M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z'
						clipRule='evenodd'
					/>
				</svg>
			),
			inactive: (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='-1 -2 22 22'
					stroke='currentColor'
					className='h-4 w-4'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z'
						clipRule='evenodd'
					/>
				</svg>
			),
		},
		{
			type: 'links',
			active: (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='-1 -1 22 22'
					fill='currentColor'
					className='svg-base'
				>
					<path
						fillRule='evenodd'
						d='M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z'
						clipRule='evenodd'
					/>
				</svg>
			),
			inactive: null,
		},
		{
			type: 'feedback',
			active: (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='svg-base'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
					/>
				</svg>
			),
			inactive: null,
		},
		{
			type: 'close',
			active: (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='svg-base'
					viewBox='0 0 20 20'
					fill='currentColor'
				>
					<path
						fillRule='evenodd'
						d='M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z'
						clipRule='evenodd'
					/>
				</svg>
			),
			inactive: null,
		},
	];

	const getData = (type: string) => {
		return svgs.find((svg) => svg.type === type);
	};

	const data = getData(type)!;

	return (
		<button
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onClick={() => !disabled && onClick()}
			disabled={disabled ? true : false}
			className={`relative ml-2 first:ml-0 p-1 hover:bg-gray-100 dark:hover:bg-darkGray-100 rounded-main ${
				state && 'text-purple-500'
			} ${
				disabled
					? 'pointer-events-none bg-gray-200 dark:bg-gray-900 opacity-50'
					: ''
			} text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 ring-gray transition-main`}
		>
			{state || !data.inactive ? (
				<div className='flex items-center justify-center'>{data.active}</div>
			) : (
				<div className='flex items-center justify-center'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 20 20'
						stroke='currentColor'
						className='svg-base'
					>
						{data.inactive}
					</svg>
				</div>
			)}
			{hover && (
				<Badge
					title={title}
					description={description}
					alignment={'bottom'}
					edge={edge}
				/>
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
			<dt className='text-sm text-100'>{title}</dt>
			<dd className='py-1 px-2 cs-darkGray rounded-main font-semibold text-xs transition-main'>
				{value}
			</dd>
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
					className='inline-block ml-2 button-gray-100 rounded-sm transition-main ring-gray'
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
					className='ml-2 button-gray-100 rounded-sm transition-main ring-gray'
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
			{popupText && <Badge title={text} alignment={'bottom'} edge={null} />}
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
	}, [currentValue, compareValue, currentValueGreater, lowerIsBetter]);

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
			className={`relative flex items-center min-w-min ml-2 py-0.5 pl-2 pr-1 ${
				isGood ? 'cs-teal' : 'bg-gray-100 dark:bg-gray-900 text-200'
			} text-xs font-semibold rounded-main`}
		>
			<span className='whitespace-nowrap'>{scale} day</span>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				className='h-4 w-4 ml-0.5 flex-none'
				viewBox='0 0 20 20'
				fill='currentColor'
			>
				{trend !== null && svgList[trend]}
			</svg>
			<span className='ml-1'>{percentDifference}%</span>
			{showPopup && (
				<div className='absolute z-40 left-1/2 flex items-center p-2 shadow-md cs-darkGray rounded-main text-xs whitespace-nowrap transform -translate-y-8 -translate-x-1/2'>
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

export default Details;
