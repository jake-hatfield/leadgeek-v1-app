import React, { useState, useEffect } from 'react';

// packages
import { animated, useSpring } from 'react-spring';

// redux
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { removeAlert } from '@features/alert/alertSlice';

const Alert: React.FC = () => {
	const dispatch = useAppDispatch();

	// alert state
	const alert = useAppSelector((state) => state.alert);
	// destructure necessary items
	const { id, title, message, alertType } = alert;
	// local state
	const [alertVisible, setAlertVisible] = useState(false);

	// set visible conditionally
	useEffect(() => {
		if (alert.id) {
			setAlertVisible(true);
		} else if (!alert.id) {
			setAlertVisible(false);
		}
	}, [alert.id]);

	// fn to set visiblity and remove from redux state
	const handleRemoveAlert = () => {
		if (!alertVisible) return;
		alertVisible && setAlertVisible(false);
		return dispatch(removeAlert());
	};

	const delay = 4000;

	// remove alert after specified times
	useEffect(() => {
		if (!alertVisible) return;

		const timeoutId = window.setTimeout(() => {
			handleRemoveAlert();
		}, delay);

		return () => {
			window.clearTimeout(timeoutId);
		};
	});

	// alert animation
	const animationStyle = useSpring({
		transform: alertVisible
			? 'translateY(-40%) translateX(-50%)'
			: 'translateY(200%) translateX(-50%)',
		config: { duration: 200 },
	});

	// set the alert icon conditionally
	const setIcon = (alertType: string) => {
		const foundIcon = alertIcons.find(
			(alertIcon) => alertIcon.title === alertType
		);
		if (foundIcon) {
			return foundIcon.path;
		} else {
			return (
				<path
					fillRule='evenodd'
					d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
					clipRule='evenodd'
				/>
			);
		}
	};

	return (
		<animated.div
			key={id}
			style={animationStyle}
			className={`fixed bottom-0 left-1/2 z-40 w-full max-w-3xl py-4 px-6 rounded-main shadow-lg bg-gray-900 dark:bg-darkGray-200 border border-gray-700 dark:border-darkGray-100`}
		>
			<div className='w-full flex items-center justify-between'>
				<div className='flex item-center'>
					<div
						className={`${
							alertType === 'success'
								? 'text-teal-300'
								: alertType === 'warning'
								? 'text-purple-300'
								: alertType === 'danger'
								? 'text-red-300'
								: 'text-gray-700'
						} flex items-center`}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5 mt-0.5'
							viewBox='0 0 20 20'
							fill='currentColor'
						>
							{alertType && setIcon(alertType)}
						</svg>
					</div>
					<div className='ml-2 flex items-center text-white'>
						<p className='font-semibold flex-none'>{title}</p>
						<p className='ml-2 pl-4 mr-8 text-gray-200 truncate'>{message}</p>
					</div>
				</div>
				<button
					onClick={() => handleRemoveAlert()}
					className={`ml-6 p-1 hover:bg-gray-800 rounded-md text-gray-300 ring-gray`}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='svg-base'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path
							fillRule='evenodd'
							d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
							clipRule='evenodd'
						/>
					</svg>
				</button>
			</div>
		</animated.div>
	);
};

const alertIcons = [
	{
		title: 'danger',
		path: (
			<path
				fillRule='evenodd'
				d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
				clipRule='evenodd'
			/>
		),
	},
	{
		title: 'warning',
		path: (
			<path
				fillRule='evenodd'
				d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
				clipRule='evenodd'
			/>
		),
	},
	{
		title: 'success',
		path: (
			<path
				fillRule='evenodd'
				d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
				clipRule='evenodd'
			/>
		),
	},
];

export default Alert;
