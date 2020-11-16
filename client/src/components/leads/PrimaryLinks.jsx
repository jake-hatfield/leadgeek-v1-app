import React, { useState } from 'react';

const PrimaryLinks = ({ link, setActiveLeadNav, showMenu }) => {
	const handleLeadNav = (link) => {
		setActiveLeadNav(link);
	};
	const [hover, setHover] = useState(false);
	return (
		<div v-for='item in items'>
			<button
				className='p-2 relative w-full flex items-center justify-between rounded-md group hover:bg-gray-100 transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline'
				onMouseEnter={() => setHover(!hover)}
				onMouseLeave={() => setHover(false)}
				onClick={() => handleLeadNav(link.title)}
			>
				{!showMenu && hover && (
					<div className='p-2 absolute left-0 z-10 transform -translate-y-1 translate-x-12 rounded-md bg-gray-800 shadow-md text-white text-sm whitespace-no-wrap'>
						{link.title}
					</div>
				)}
				<div className='flex items-center'>
					<span
						className={`${showMenu && 'relative'} text-center text-gray-300`}
					>
						{link.svg}
						{!showMenu &&
							link.notifications !== 0 &&
							link.notifications !== undefined && (
								<span className='absolute top-0 '>
									<span
										className={`px-1 h-5 w-5 flex items-center justify-center rounded-full border-2 border-white group-hover:border-gray-100 ${
											link.title === 'Feed'
												? `bg-purple-600 text-white`
												: link.title === 'Liked'
												? `bg-teal-200 text-teal-600`
												: `bg-gray-100 text-gray-500`
										} text-white text-xs font-semibold transition-colors duration-100 ease-in-out`}
									>
										{link.notifications}
									</span>
								</span>
							)}
					</span>
					{showMenu && <span className='ml-2'>{link.title}</span>}
				</div>
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
