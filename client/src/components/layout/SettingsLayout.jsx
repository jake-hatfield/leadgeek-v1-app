import React, { useState, useEffect } from 'react';

import SettingsNavbar from 'components/layout/navigation/SettingsNavbar';

const SettingsLayout = ({
	children,
	title,
	desc,
	pill,
	loading,
	isAuthenticated,
	user,
}) => {
	const [initials, setInitials] = useState('');
	useEffect(() => {
		if (!loading && isAuthenticated) {
			let userInitials = user.name.split(' ').map((n) => n[0]);
			setInitials(userInitials);
		}
	}, [loading, isAuthenticated, user]);
	return (
		<div className='flex flex-row'>
			<SettingsNavbar />
			<section className='my-6 w-full'>
				<header className='pb-2 border-b border-gray-200'>
					<h1 className='ml-72 text-3xl font-bold text-gray-900'>
						{title || 'Settings'}
					</h1>
				</header>
				<div className='ml-72 max-w-screen-2xl'>
					<div className='md:flex md:items-center mt-6 pb-2 mr-16 border-b border-gray-200'>
						<div className='p-3 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 shadow-sm focus:outline-none focus:shadow-outline'>
							<span className='text-gray-600 text-lg font-bold'>
								{initials}
							</span>
						</div>
						<div className='ml-6'>
							<div className='md:flex md:items-center text-lg font-semibold'>
								<h2 className='text-purple-500'>{user.name}</h2>
								{pill && pill.text && (
									<span
										className={`ml-2 py-1 px-2 ${
											pill.active
												? 'bg-teal-200 text-teal-600 border border-teal-400'
												: 'bg-gray-100 text-gray-800 border border-gray-400'
										} rounded-lg text-xs`}
									>
										{pill.text}
									</span>
								)}
							</div>
							<p className='text-gray-800'>{desc}</p>
						</div>
					</div>
					<div>{children}</div>
				</div>
			</section>
		</div>
	);
};

export default SettingsLayout;
