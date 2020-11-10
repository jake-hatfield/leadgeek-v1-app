import React, { useState } from 'react';

const PrimaryLinks = ({ link, setActiveLeadNav, showMenu }) => {
	const handleLeadNav = (link) => {
		setActiveLeadNav(link);
	};
	const [hover, setHover] = useState(false);
	return (
		<div v-for='item in items' className='first:mt-2 mt-1'>
			<button
				className='p-2 relative w-full flex items-center justify-between rounded-md hover:bg-gray-100 hover:shadow-inner transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline'
				onMouseEnter={() => setHover(!hover)}
				onMouseLeave={() => setHover(false)}
				onClick={() => handleLeadNav(link.title)}
			>
				{!showMenu && hover && (
					<div className='p-2 absolute left-0 z-10 transform -translate-y-1 translate-x-12 rounded-md bg-gray-800 shadow-md text-white text-sm whitespace-no-wrap'>
						{link.title}
					</div>
				)}
				<span className='flex items-center'>
					<span
						className={`${showMenu && 'relative'} text-center text-gray-300`}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='currentColor'
							className='h-6 w-6'
						>
							{link.path}
						</svg>
						{!showMenu &&
							link.notifications !== 0 &&
							link.notifications !== undefined && (
								<span className='absolute top-0 '>
									<span
										className={`px-1 h-5 w-5 flex items-center justify-center rounded-full ${
											link.title === 'Feed'
												? `bg-purple-600 text-white`
												: link.title === 'Liked'
												? `bg-teal-200 text-teal-600`
												: `bg-gray-100 text-gray-500`
										} text-white text-xs font-semibold`}
									>
										{link.notifications}
									</span>
								</span>
							)}
					</span>
					{showMenu && <span className='ml-2'>{link.title}</span>}
				</span>
				{showMenu && (
					<span
						className={`px-2 ${
							link.title === 'Feed'
								? `bg-purple-600 text-white`
								: link.title === 'Liked'
								? `bg-teal-200 text-teal-600`
								: `bg-gray-100 text-gray-500`
						}  rounded-full text-xs font-semibold`}
					>
						{link.notifications
							? link.title === 'Feed'
								? `${link.notifications} new`
								: link.notifications
							: ''}
					</span>
				)}
			</button>
		</div>
	);
};

export default PrimaryLinks;
