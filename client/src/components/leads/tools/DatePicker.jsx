import React, { useEffect, useRef, useCallback } from 'react';

import { DateTime } from 'luxon';

import { useOutsideMousedown } from 'utils/utils';

const DatePicker = ({
	date,
	setDate,
	dateCreated,
	lastUpdated,
	setDateLimit,
}) => {
	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, setDate);
	// close modal on esc key
	const keyPress = useCallback(
		(e) => {
			if (e.key === 'Escape' && date) {
				setDate(false);
			}
		},
		[setDate, date]
	);
	useEffect(() => {
		document.addEventListener('keydown', keyPress);
		return () => document.removeEventListener('keydown', keyPress);
	}, [keyPress]);
	const nowISO = DateTime.now().toISO();
	const mostRecentDay = DateTime.fromISO(lastUpdated || DateTime.now());
	const previousDay = mostRecentDay.minus({ days: 1 });
	const lastFiveStart = mostRecentDay.minus({ days: 5 });
	const last30Start = mostRecentDay.minus({ days: 30 });
	const lastDay = DateTime.fromISO(dateCreated);
	const dateOptions = [
		{
			title: 'Most recent day',
			dateString: mostRecentDay.toFormat('LLL dd'),
			setDateLimit: () => setDateLimit(mostRecentDay.toISO(), null),
		},
		{ title: 'Previous day', dateString: previousDay.toFormat('LLL dd') },
		{
			title: 'Last 5 days',
			dateString: `${lastFiveStart.toFormat(
				'LLL dd'
			)} - ${mostRecentDay.toFormat('LLL dd')}`,
		},
		{
			title: 'Last 30 days',
			dateString: `${last30Start.toFormat('LLL dd')} - ${mostRecentDay.toFormat(
				'LLL dd'
			)}`,
		},
		{
			title: 'All time',
			dateString: `${lastDay.toFormat(
				'LLL dd, yyyy'
			)} - ${mostRecentDay.toFormat('LLL dd')}`,
		},
	];
	return (
		<article
			ref={wrapperRef}
			className='absolute top-0 right-0 z-10 w-64 transform translate-y-10 -translate-x-72 pt-4 pb-2 rounded-lg bg-white shadow-lg text-gray-900'
		>
			<div className='relative'>
				<header className='pb-2 px-4 flex items-center justify-between'>
					<div>
						<h5 className='inline-block font-bold text-lg'>Date picker</h5>
					</div>
				</header>
				{dateOptions.map((dateOption, i) => (
					<li key={i} className='list-none'>
						<button
							onClick={dateOption.setDateLimit}
							className='w-full py-2 px-4 flex items-center justify-between border-t border-gray-200 hover:bg-gray-100 transition-colors duration-100 ease-in-out focus:outline-none'
						>
							<span className='font-semibold text-sm text-gray-700'>
								{dateOption.title}
							</span>
							<span className='text-sm text-gray-600'>
								{dateOption.dateString}
							</span>
						</button>
					</li>
				))}
			</div>
		</article>
	);
};

export default DatePicker;
