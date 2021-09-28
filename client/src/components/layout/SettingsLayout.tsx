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
		<div className='flex flex-row container mt-12'>
			<SettingsNavbar />
			<section className='w-5/6 ml-12 text-300'>
				<div className='w-full cs-light-300 card-padding card-200'>
					<div className='md:flex md:items-center pb-4 border-b border-200'>
						<div className='p-3 h-10 w-10 all-center rounded-full cs-purple shadow-sm focus:outline-none focus:shadow-outline'>
							<span className='text-lg font-bold'>{initials}</span>
						</div>
						<div className='ml-6'>
							<div className='md:flex md:items-center text-lg font-semibold'>
								<h2 className='font-bold'>{user.name}</h2>
								{pill && pill.text && (
									<span
										className={`ml-2 py-1 px-2 ${
											pill.active
												? 'cs-teal'
												: 'bg-gray-100 dark:bg-gray-900 text-200'
										} rounded-main text-xs`}
									>
										{pill.text}
									</span>
								)}
							</div>
							<p className='text-100'>{description}</p>
						</div>
					</div>
					<div>{children}</div>
				</div>
			</section>
		</div>
	);
};

export default SettingsLayout;
