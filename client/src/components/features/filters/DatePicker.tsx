import React, { useRef } from 'react';

// packages
import { DateTime } from 'luxon-business-days';
import { useHotkeys } from 'react-hotkeys-hook';

// redux
import { useAppDispatch } from '@hooks/hooks';
import { setAlert } from '@features/alert/alertSlice';
import { setDateLimit } from '@features/filters/filtersSlice';
import { setPage } from '@features/leads/leadsSlice';

// utils
import { useOutsideMousedown } from '@utils/utils';

interface DatePickerProps {
	type: 'feed' | 'liked' | 'archived' | 'search';
	date: boolean;
	setDate: React.Dispatch<React.SetStateAction<boolean>>;
	dateCreated: string;
	lastUpdated: string | null;
}

const DatePicker: React.FC<DatePickerProps> = ({
	type,
	date,
	setDate,
	dateCreated,
	lastUpdated,
}) => {
	const dispatch = useAppDispatch();

	// modal close handlers
	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, setDate, null);
	// hotkeys
	// close details on escape key
	useHotkeys(
		'Escape',
		() => {
			date && setDate(false);
		},
		{ keyup: true }
	);

	// set dates
	const mostRecentDay = DateTime.fromISO(lastUpdated || DateTime.now());
	const previousDay = mostRecentDay.minusBusiness({ days: 1 });
	const lastFiveStart = mostRecentDay.minusBusiness({ days: 5 });
	const lastFourteenStart = mostRecentDay.minusBusiness({ days: 10 });
	const last30Start = mostRecentDay.minusBusiness({ days: 30 });
	const lastDay = DateTime.fromISO(dateCreated);

	// date options in picker
	const dateOptions = [
		{
			title:
				mostRecentDay.startOf('day') >= DateTime.now().startOf('day')
					? 'Today'
					: 'Most recent day',
			dateString: mostRecentDay.toFormat('LLL dd'),
			min: mostRecentDay,
			onClick: () => {
				dispatch(
					setDateLimit({
						min: mostRecentDay.startOf('day'),
						max: mostRecentDay.endOf('day'),
						selected: mostRecentDay.toFormat('LLL dd, yyyy'),
					})
				);
			},
		},
		{
			title:
				previousDay.startOf('day') <=
				DateTime.now().minusBusiness({ days: 1 }).startOf('day')
					? 'Previous day'
					: 'Yesterday',
			dateString: previousDay.toFormat('LLL dd'),
			min: previousDay,
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
			title: 'Last 7 days',
			dateString: `${lastFiveStart.toFormat(
				'LLL dd'
			)} - ${mostRecentDay.toFormat('LLL dd')}`,
			min: lastFiveStart,
			onClick: () => {
				dispatch(
					setDateLimit({
						min: lastFiveStart.startOf('day'),
						max: mostRecentDay.endOf('day'),
						selected: `${lastFiveStart.toFormat(
							'LLL dd, yyyy'
						)} - ${mostRecentDay.toFormat('LLL dd')}`,
					})
				);
			},
		},
		{
			title: 'Last 14 days',
			dateString: `${lastFourteenStart.toFormat(
				'LLL dd'
			)} - ${mostRecentDay.toFormat('LLL dd')}`,
			min: lastFourteenStart,
			onClick: () => {
				dispatch(
					setDateLimit({
						min: lastFourteenStart.startOf('day'),
						max: mostRecentDay.endOf('day'),
						selected: `${lastFourteenStart.toFormat(
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
			min: last30Start,
			onClick: () => {
				dispatch(
					setDateLimit({
						min: last30Start.startOf('day'),
						max: mostRecentDay.endOf('day'),
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
			min: lastDay,
			onClick: () => {
				dispatch(
					setDateLimit({
						min: lastDay.startOf('day'),
						max: mostRecentDay.endOf('day'),
						selected: `${lastDay.toFormat(
							'LLL dd, yyyy'
						)} - ${mostRecentDay.toFormat('LLL dd')}`,
					})
				);
			},
		},
	];

	const validateDateRange = (dateCreated: string, minDate: string) => {
		if (
			DateTime.fromISO(dateCreated).startOf('day') <=
			DateTime.fromISO(minDate).startOf('day')
		) {
			return true;
		} else {
			return false;
		}
	};

	const handleSetDate = (
		dateCreated: string,
		minDate: string,
		cb: () => void
	) => {
		let validDate = validateDateRange(dateCreated, minDate);
		if (validDate) {
			cb();
			dispatch(setPage({ page: 1, type }));
			return setDate(false);
		} else {
			dispatch(
				setAlert({
					title: 'Invalid date range',
					message:
						'This date range is older than your Leadgeek account. Please select a valid date range.',
					alertType: 'danger',
				})
			);
		}
	};

	return (
		<article
			ref={wrapperRef}
			className='absolute top-0 right-0 z-10 w-64 pt-4 pb-2 cs-light-400 card-200 text-300 transform translate-y-12 -translate-x-56'
		>
			<div className='relative'>
				<header className='pb-2 px-4 center-between border-b border-200'>
					<div>
						<h5 className='inline-block font-bold text-lg'>Date picker</h5>
					</div>
				</header>
				<ul>
					{dateOptions.map((dateOption, i) => (
						<li
							key={i}
							className='list-none border-b border-100 last:border-none'
						>
							<button
								onClick={() => {
									handleSetDate(
										dateCreated,
										dateOption.min,
										dateOption.onClick
									);
								}}
								className={`${
									validateDateRange(dateCreated, dateOption.min)
										? 'hover:bg-gray-100 dark:hover:bg-darkGray-100'
										: 'opacity-25 cursor-default'
								} w-full py-2 px-4 center-between transition-colors-main focus:outline-none`}
							>
								<span className='font-semibold text-sm text-200'>
									{dateOption.title}
								</span>
								<span className='text-sm text-100'>
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
