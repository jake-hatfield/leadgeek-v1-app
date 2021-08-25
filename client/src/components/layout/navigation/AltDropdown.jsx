import React, { useEffect, useRef, useCallback } from 'react';

import { NavLink } from 'react-router-dom';

import { useOutsideMouseup } from '@utils/utils';

function AltDropdown({
	items,
	open,
	setOpen,
	logout,
	logoutUser,
	name,
	loading,
	activeSubscription,
}) {
	const toggle = () => setOpen(!open);
	const wrapperRef = useRef(null);

	useOutsideMouseup(wrapperRef, setOpen);

	// close modal on esc key
	const keyPress = useCallback(
		(e) => {
			if (e.key === 'Escape') {
				setOpen(false);
			}
		},
		[setOpen, open]
	);
	useEffect(() => {
		document.addEventListener('keydown', keyPress);
		return () => document.removeEventListener('keydown', keyPress);
	}, [keyPress]);

	return (
		<article
			ref={wrapperRef}
			className='absolute bottom-0 left-0 z-30 w-64 transform translate-x-16 pt-4 pb-2 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-900'
		>
			<div className='relative'>
				<header className='pb-2 px-4 flex items-center justify-between border-b border-gray-200'>
					<div>
						<h5 className='inline-block font-bold text-lg'>
							<span role='img' aria-label='Waving emoji' className='mr-1'>
								👋
							</span>
							Hi, {name.split(' ')[0] || 'Account'}
						</h5>
					</div>
				</header>
				<div>
					{items.map((item, i) => (
						<NavLink
							key={i}
							to={`/${item.link}`}
							className='w-full py-2 px-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-100 ease-in-out focus:outline-none'
						>
							<span className='font-semibold text-sm text-gray-800'>
								{item.title}
							</span>
							<span className='text-sm text-gray-600'>{item.dateString}</span>
						</NavLink>
					))}

					<button
						key={'logout'}
						onClick={() => logoutUser(logout)}
						className='w-full py-2 px-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-100 ease-in-out focus:outline-none'
					>
						<span className='font-semibold text-sm text-gray-800'>Logout</span>
					</button>
				</div>
			</div>
		</article>
	);
}

export default AltDropdown;
