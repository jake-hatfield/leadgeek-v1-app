import React, { useEffect, useRef, useCallback } from 'react';

// packages
import { DateTime } from 'luxon-business-days';

// redux
import { useAppDispatch } from '@utils/hooks';
import { setDateLimit } from '@features/filters/filtersSlice';
import { setPage } from '@features/leads/leadsSlice';

// utils
import { useOutsideMousedown } from '@utils/utils';

interface DatePickerProps {
	type: string;
	date: boolean;
	setDate: React.Dispatch<React.SetStateAction<boolean>>;
	dateCreated: string;
	lastUpdated: string | null;
}

const DatePicker: React.FC<DatePickerProps> = ({
	date,
	setDate,
	dateCreated,
	lastUpdated,
	type,
}) => {
	const dispatch = useAppDispatch();
	// modal close handlers
	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, setDate, null);
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

	// set dates
	const mostRecentDay = DateTime.fromISO(lastUpdated || DateTime.now());
	const previousDay = mostRecentDay.minusBusiness({ days: 1 });
	const lastFiveStart = mostRecentDay.minusBusiness({ days: 5 });
	const last30Start = mostRecentDay.minusBusiness({ days: 30 });
	const lastDay = DateTime.fromISO(dateCreated);

	// date options in picker
	const dateOptions = [
		{
			title: 'Most recent day',
			dateString: mostRecentDay.toFormat('LLL dd'),
			onClick: () => {
				dispatch(
					setDateLimit({
						min: mostRecentDay.toISODate(),
						max: null,
						selected: mostRecentDay.toFormat('LLL dd, yyyy'),
					})
				);
			},
		},
		{
			title: 'Previous day',
			dateString: previousDay.toFormat('LLL dd'),
			onClick: () => {
				dispatch(
					setDateLimit({
						min: previousDay.startOf('day'),
						max: previousDay.endOf('day'),
						selected: previousDay.toFormat('LLL dd, yyyy'),
					})
				);
			},
		},
		{
			title: 'Last 5 days',
			dateString: `${lastFiveStart.toFormat(
				'LLL dd'
			)} - ${mostRecentDay.toFormat('LLL dd')}`,
			onClick: () => {
				dispatch(
					setDateLimit({
						min: lastFiveStart.toISODate(),
						max: null,
						selected: `${lastFiveStart.toFormat(
							'LLL dd, yyyy'
						)} - ${mostRecentDay.toFormat('LLL dd')}`,
					})
				);
			},
		},
		{
			title: 'Last 30 days',
			dateString: `${last30Start.toFormat('LLL dd')} - ${mostRecentDay.toFormat(
				'LLL dd'
			)}`,
			onClick: () => {
				dispatch(
					setDateLimit({
						min: last30Start.toISODate(),
						max: mostRecentDay.toISO(),
						selected: `${last30Start.toFormat(
							'LLL dd, yyyy'
						)} - ${mostRecentDay.toFormat('LLL dd')}`,
					})
				);
			},
		},
		{
			title: 'All time',
			dateString: `${lastDay.toFormat(
				'LLL dd, yyyy'
			)} - ${mostRecentDay.toFormat('LLL dd')}`,
			onClick: () => {
				dispatch(
					setDateLimit({
						min: lastDay.toISODate(),
						max: mostRecentDay.toISO(),
						selected: `${lastDay.toFormat(
							'LLL dd, yyyy'
						)} - ${mostRecentDay.toFormat('LLL dd')}`,
					})
				);
			},
		},
	];

	return (
		<article
			ref={wrapperRef}
			className='absolute top-0 right-0 z-10 w-64 transform translate-y-12 -translate-x-72 pt-4 pb-2 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-900'
		>
			<div className='relative'>
				<header className='pb-2 px-4 flex items-center justify-between border-b border-gray-200'>
					<div>
						<h5 className='inline-block font-bold text-lg'>Date picker</h5>
					</div>
				</header>
				<ul>
					{dateOptions.map((dateOption, i) => (
						<li key={i} className='list-none'>
							<button
								onClick={() => {
									dateOption.onClick();
									setPage({ page: 1, type });
									setDate(false);
								}}
								className='w-full py-2 px-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-100 ease-in-out focus:outline-none'
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
				</ul>
			</div>
		</article>
	);
};

export default DatePicker;
