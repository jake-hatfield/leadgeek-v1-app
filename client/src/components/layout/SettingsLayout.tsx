import React, { useState, useEffect } from 'react';

// components
import SettingsNavbar from '@components/layout/navigation/SettingsNavbar';

// utils
import { User } from '@utils/interfaces/User';

interface SettingsLayoutProps {
	children: React.ReactNode;
	isAuthenticated: boolean;
	user: User;
	title: string;
	description: string;
	pill: any;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
	children,
	isAuthenticated,
	user,
	title,
	description,
	pill,
}) => {
	const [initials, setInitials] = useState<string[]>([]);
	useEffect(() => {
		if (isAuthenticated) {
			let userInitials = user.name.split(' ').map((n) => n[0]);
			setInitials(userInitials);
		}
	}, [isAuthenticated, user.name]);

	return (
		<div className='flex flex-row'>
			<SettingsNavbar />
			<section className='mb-6 w-full'>
				<header className='py-6 bg-gray-100 border-b border-gray-300'>
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
								<h2 className='font-bold'>{user.name}</h2>
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
							<p className='text-gray-800'>{description}</p>
						</div>
					</div>
					<div>{children}</div>
				</div>
			</section>
		</div>
	);
};

export default SettingsLayout;
