import React from 'react';

import { NavLink } from 'react-router-dom';

function MoreDropdown({
	items,
	open,
	setOpen,
	logout,
	logoutUser,
	loading,
	activeSubscription,
}) {
	const toggle = () => setOpen(!open);
	return (
		<div>
			<button
				tabIndex={0}
				onKeyPress={() => toggle(!open)}
				onMouseEnter={() => open === false && toggle(!open)}
				onMouseLeave={() => open === true && toggle(!open)}
				className='inline-flex space-x-1 text-gray-600 text-base leading-6 font-medium hover:text-gray-700 focus:outline-none focus:text-gray-700 transition ease-in-out duration-200 md:cursor-default'
			>
				<div
					className={`${
						open ? `block` : `hidden`
					} pt-8 px-2 sm:px-0 w-screen max-w-xs absolute right-0 z-40`}
				>
					<div className='rounded-md shadow-md'>
						<div className='rounded-md shadow-xs overflow-hidden'>
							<div className='px-5 py-6 relative z-20 grid gap-6 sm:gap-8 sm:p-8 bg-white'>
								{items.map((item) => (
									<NavLink
										key={item.linkID}
										to={`/${item.link}`}
										className='-m-3 p-2 flex items-start space-x-4 rounded-md hover:bg-gray-100 text-left transition ease-in-out duration-200'
									>
										{item.path}
										<div className='space-y-1'>
											<p className='text-sm leading-6 font-semibold text-gray-700'>
												{item.title}
											</p>
											<p className='text-sm leading-5 font-normal text-gray-600'>
												{item.description}
											</p>
										</div>
									</NavLink>
								))}
								<div
									onClick={() => logoutUser(logout)}
									className='-m-3 p-2 flex items-start space-x-4 rounded-md hover:bg-gray-100 text-left transition ease-in-out duration-200 cursor-pointer'
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
										className='p-2 h-10 w-10 flex-shrink-0 rounded-md bg-purple-100 text-purple-600'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
										/>
									</svg>
									<div className='space-y-1'>
										<p className='text-sm leading-6 font-semibold text-gray-700'>
											Log Out
										</p>
										<p className='text-sm leading-5 font-normal text-gray-600'>
											Securely log out of your LeadGeek account
										</p>
									</div>
								</div>
							</div>
							{!loading && activeSubscription && (
								<div className='py-4 px-5 bg-gray-100 text-left'>
									<div className='md:flex md:items-center'>
										<div className='text-teal-400'>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												viewBox='0 0 20 20'
												fill='currentColor'
												className='h-6 w-6'
											>
												<path
													fillRule='evenodd'
													d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
													clipRule='evenodd'
												/>
											</svg>
										</div>
										<p className='ml-2 text-gray-600'>{`${activeSubscription} plan subscriber`}</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</button>
		</div>
	);
}

export default MoreDropdown;
