import React, {
	Fragment,
	useRef,
	useEffect,
	useCallback,
	useState,
} from 'react';

import { connect } from 'react-redux';
import { handleArchiveLead } from '../../../redux/actions/leads';

import { truncate, numberWithCommas } from '../../../utils/utils';

const PrimaryMetric = ({ title, value, subvalue }) => {
	return (
		<div className='first:ml-0 ml-12'>
			<h5 className='font-semibold'>{title}</h5>
			<div className='mt-4'>
				<span className='font-semibold text-lg text-gray-900'>{value}</span>
				<span className='ml-2'>{subvalue}</span>
			</div>
		</div>
	);
};

const Details = ({
	clearDetailedLead,
	showDetails,
	setShowDetails,
	currentLead,
	user,
	handleArchiveLead,
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
			value: `$${data.netProfit}`,
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

	const buttonClasses =
		'py-2 px-3 flex items-center rounded-lg shadow-sm hover:shadow-md font-semibold text-sm hover:text-gray-500 transition-all duration-100 ease-in-out focus:outline-none focus:shadow-outline';

	return (
		<Fragment>
			<div
				ref={modalRef}
				onClick={closeModal}
				className='absolute top-0 right-0 h-screen w-full bg-gray-900 opacity-25'
			></div>
			<div className='container'>
				<div className='absolute top-0 right-0 w-full max-w-3xl transform translate-y-8 -translate-x-12'>
					<div className='relative z-10 py-8 px-6 rounded-lg bg-white opacity-100'>
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
									onClick={() => setShowDetails(false)}
									className='py-2 px-1 rounded-lg transition-all duration-100 ease-in-out focus:outline-none focus:shadow-outline'
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
								<div className='w-1/4'>img</div>
								<div className='w-3/4'>
									<header className='pb-2 border-b border-gray-200'>
										<h3
											onMouseEnter={() => toggleFullTitle(true)}
											onMouseLeave={() => toggleFullTitle(false)}
											className='font-bold text-lg text-gray-900'
										>
											{truncate(data.title, 61)}
										</h3>
										{fullTitle && (
											<div className='absolute top-0 mt-2 mr-6 p-2 transform translate-y-28 rounded-md shadow-md bg-gray-800 text-white text-sm'>
												{data.title}
											</div>
										)}
										<div className='flex items-center mt-4 text-gray-800'>
											<h5>{data.date}</h5>
											<span className='h-1 w-1 ml-4 rounded-full bg-gray-400' />
											<h5 className='ml-4'>{data.brand}</h5>{' '}
											<span className='h-1 w-1 ml-4 rounded-full bg-gray-400' />
											<h5 className='ml-4'>{data.category}</h5>
										</div>
										<div className='flex items-center justify-between mt-4 pb-3 border-b border-gray-200'>
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
										<div className='flex mt-6'>
											{primaryMetrics.map((metric) => (
												<PrimaryMetric
													title={metric.title}
													value={metric.value}
													subvalue={metric.subvalue}
												/>
											))}
										</div>
									</header>
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
	const { clearDetailedLead, setShowDetails, currentLead } = ownProps;
	const { user } = state.auth;
	return { clearDetailedLead, setShowDetails, currentLead, user };
};

export default connect(mapStateToProps, { handleArchiveLead })(Details);
