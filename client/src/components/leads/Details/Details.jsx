import React, {
	Fragment,
	useRef,
	useEffect,
	useCallback,
	useState,
} from 'react';

import { connect } from 'react-redux';
import {
	handleArchiveLead,
	clearCurrentLead,
} from '../../../redux/actions/leads';
import { DateTime } from 'luxon';

import {
	truncate,
	numberWithCommas,
	calculateBSR,
	openLinkHandler,
} from '../../../utils/utils';

const PrimaryMetric = ({ title, value, subvalue }) => {
	return (
		<div className='first:ml-0 ml-12'>
			<h5 className='font-semibold'>{title}</h5>
			<div className='mt-2'>
				<span className='font-semibold text-gray-900'>{value}</span>
				<span className='ml-2'>{subvalue}</span>
			</div>
		</div>
	);
};

const Note = ({ title, desc, nullState }) => {
	return (
		<div className='flex items-end justify-between mt-2 pb-2 border-b border-gray-200'>
			<div>{title}</div>
			{desc ? (
				<div className='py-1 px-2 rounded-lg bg-teal-200 text-xs text-teal-600'>
					{desc}
				</div>
			) : (
				<div className='py-1 px-2 rounded-lg bg-gray-100 text-xs text-gray-500'>
					{nullState}
				</div>
			)}
		</div>
	);
};

const Details = ({
	currentLead,
	clearCurrentLead,
	showDetails,
	setShowDetails,
}) => {
	const [fullTitle, toggleFullTitle] = useState(false);
	const [overviewActive, setOverviewActive] = useState(true);
	const { data } = currentLead;
	// close modal on click outside
	const modalRef = useRef();
	const closeModal = (e) => {
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

	const primaryLinks = [
		{ title: 'Overview', onClick: () => setOverviewActive(true) },
	];
	const primaryMetrics = [
		{
			title: 'Profit',
			value: `$${data.netProfit.toFixed(2)}`,
			subvalue: 'USD',
		},
		{
			title: 'ROI',
			value: (data.roi.toFixed(2) * 100).toFixed(0),
			subvalue: '%',
		},
		{
			title: 'Estimated sales',
			value: numberWithCommas(data.monthlySales),
			subvalue: '/ month',
		},
	];
	const date = DateTime.fromISO(data.date).toFormat('LLL dd, t');
	const [copyText, setCopyText] = useState(false);
	const [copiedText, setCopiedText] = useState(false);
	const notes = [data.promo, data.cashback, data.variations, data.shipping];
	const [noteCount, setNoteCount] = useState(0);
	const checkNotes = () => {
		setNoteCount(notes.filter((note) => note !== ''));
	};
	useEffect(() => {
		checkNotes();
	}, []);

	const buttonClasses =
		'py-2 px-3 flex items-center rounded-lg shadow-sm hover:shadow-md font-semibold text-sm hover:text-gray-500 transition-all duration-100 ease-in-out focus:outline-none focus:shadow-outline';

	const descriptorClasses = 'flex justify-between';
	const linkClasses = 'font-semibold text-purple-600 hover:text-gray-700';

	return (
		<Fragment>
			<div
				ref={modalRef}
				onClick={closeModal}
				className='absolute top-0 right-0 h-screen w-full bg-gray-900 opacity-25'
			/>
			<div className='container'>
				<div className='absolute top-0 right-0 w-full max-w-3xl transform translate-y-4 -translate-x-12'>
					<div className='relative z-10 pt-6 pb-10 px-6 rounded-lg shadow-xl bg-white opacity-100'>
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
							<div>
								<button
									onClick={() => {
										clearCurrentLead();
										setShowDetails(false);
									}}
									className='py-2 px-1 rounded-lg hover:text-gray-700 transition-all duration-100 ease-in-out focus:outline-none focus:shadow-outline'
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 20 20'
										fill='currentColor'
										className='h-5 w-5'
									>
										<path
											fillRule='evenodd'
											d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
											clipRule='evenodd'
										/>
									</svg>
								</button>
							</div>
						</header>
						{/* overview page */}
						{overviewActive && (
							<div className='flex mt-4'>
								<div className='w-1/4'>
									<a
										href={data.amzLink}
										target='_blank'
										rel='noopener noreferrer'
									>
										<img
											src={data.img}
											alt={data.title}
											className='rounded-lg transition-all duration-100 ease-in-out focus:outline-none hover:shadow-outline focus:shadow-outline'
										></img>
									</a>
								</div>
								<div className='ml-12 w-3/4'>
									<header>
										<h3
											onMouseEnter={() => toggleFullTitle(true)}
											onMouseLeave={() => toggleFullTitle(false)}
											className='inline-block font-bold text-lg text-gray-900'
										>
											{truncate(data.title, 57)}
										</h3>
										{fullTitle && (
											<div className='absolute top-0 mt-2 mr-6 p-2 transform translate-y-28 rounded-md shadow-md bg-gray-800 text-white text-sm'>
												{data.title}
											</div>
										)}
										<div className='flex items-center mt-2 text-sm text-gray-800'>
											<div>{date}</div>
											<span className='h-1 w-1 ml-4 rounded-full bg-gray-400' />
											<div className='ml-4'>{data.brand}</div>
											<span className='h-1 w-1 ml-4 rounded-full bg-gray-400' />
											<div className='ml-4'>{data.category}</div>
										</div>
										<div className='flex items-center justify-between mt-2 pb-3 border-b border-gray-200'>
											<div className='flex items-center'>
												<button
													className={`${buttonClasses} hover:text-gray-700`}
												>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'
														className='h-4 w-4'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
														/>
													</svg>
													<span className='ml-2'>Like</span>
												</button>
												<button
													className={`${buttonClasses} ml-4 hover:text-gray-700`}
												>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'
														className='h-4 w-4'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
														/>
													</svg>
													<span className='ml-2'>Archive</span>
												</button>
											</div>
											<button
												onClick={(e) =>
													openLinkHandler(e, data.retailerLink, data.amzLink)
												}
												className={`${buttonClasses} text-purple-600 hover:text-gray-700`}
											>
												<span>Open links</span>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													viewBox='0 0 20 20'
													fill='currentColor'
													className='h-4 w-4 ml-2'
												>
													<path
														fillRule='evenodd'
														d='M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z'
														clipRule='evenodd'
													/>
												</svg>
											</button>
										</div>
									</header>
									<article className='mt-4'>
										<div className='flex'>
											{primaryMetrics.map((metric, i) => (
												<PrimaryMetric
													key={i}
													title={metric.title}
													value={metric.value}
													subvalue={metric.subvalue}
												/>
											))}
										</div>
										<header className='mt-4 pb-2 border-b border-gray-200'>
											<h4 className='font-semibold text-gray-900'>
												Detailed metrics
											</h4>
										</header>
										<div className='grid grid-cols-2 grid-rows-4 gap-y-4 gap-x-6 mt-4 text-sm text-gray-800'>
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
												<div>ASIN</div>
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
																	className='ml-2 text-gray-400 hover:text-gray-700 rounded-sm transition-all duration-100 ease-in-out focus:outline-none focus:shadow-outline'
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
													<div className='absolute right-0 flex items-center p-2 transform -translate-y-2 -translate-x-6 rounded-lg shadow-md bg-gray-800 text-white text-xs'>
														{copiedText && (
															<svg
																xmlns='http://www.w3.org/2000/svg'
																viewBox='0 0 20 20'
																fill='currentColor'
																className='h-4 w-4 text-teal-200'
															>
																<path
																	fillRule='evenodd'
																	d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
																	clipRule='evenodd'
																/>
															</svg>
														)}
														<span className={copiedText && 'ml-1'}>
															{copiedText ? 'ASIN copied' : 'Copy ASIN'}
														</span>
													</div>
												)}
											</div>
											<div className={descriptorClasses}>
												<div>Sell price</div>
												<div>{`$${data.sellPrice.toFixed(2) || '-'}`}</div>
											</div>
											<div className={descriptorClasses}>
												<div>Competitor type</div>
												<div>{data.competitorType || '-'}</div>
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
															<span className='ml-1 text-gray-400'>lb</span>
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
															<span>
																{calculateBSR(data.bsrCurrent, data.category)}
															</span>
															<span className='ml-1 text-gray-400'>%</span>
														</span>
													)}
												</div>
											</div>
										</div>
									</article>
									{/* Notes section */}
									<article className='mt-4 text-gray-900'>
										<header className='flex items-center pb-2 border-b border-gray-200'>
											<h4 className='font-semibold'>Notes</h4>
											<span
												className={`${
													noteCount.length > 0
														? 'bg-teal-200 text-teal-600'
														: 'bg-gray-100 text-gray-500'
												} ml-2 py-1 px-2 rounded-lg shadow-sm text-sm`}
											>
												{noteCount.length}
											</span>
										</header>
										<div className='mt-3 text-sm'>
											<Note
												title={'Promos'}
												desc={data.promo}
												nullState={'No applicable promos'}
											/>
											<Note
												title={'Cashback'}
												desc={data.cashback}
												nullState={'No applicable cashback'}
											/>
											<Note
												title={'Variations'}
												desc={data.variations}
												nullState={'No variation suggestions'}
											/>
											<Note
												title={'Shipping'}
												desc={data.shipping}
												nullState={'No shipping notes'}
											/>
										</div>
									</article>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</Fragment>
	);
};

const mapStateToProps = (state, ownProps) => {
	const { setShowDetails, currentLead } = ownProps;
	const { user } = state.auth;
	return { setShowDetails, currentLead, user };
};

export default connect(mapStateToProps, {
	handleArchiveLead,
	clearCurrentLead,
})(Details);
