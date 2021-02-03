import React from 'react';
import { NavLink } from 'react-router-dom';
// import { animated } from 'react-spring';

function MoreDropdown({
	items,
	animation,
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
				className='inline-flex space-x-1 text-gray-500 text-base leading-6 font-medium hover:text-gray-700 focus:outline-none focus:text-gray-700 transition ease-in-out duration-200 md:cursor-default'
			>
				<div
					className={`${
						open ? `block` : `hidden`
					} pt-8 px-2 sm:px-0 w-screen max-w-xs absolute right-0 z-40`}
					// style={animation}
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
											<p className='text-sm leading-5 font-normal text-gray-500'>
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
										<p className='text-sm leading-5 font-normal text-gray-500'>
											Securely log out of your LeadGeek account
										</p>
									</div>
								</div>
							</div>
							<div className='p-4 bg-gray-100 text-left'>
								<p>{!loading && activeSubscription} plan</p>
							</div>
						</div>
					</div>
				</div>
			</button>
		</div>
	);
}

export default MoreDropdown;
