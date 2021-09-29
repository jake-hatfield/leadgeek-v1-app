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
	return (
		<div className='flex flex-row container mt-12'>
			<SettingsNavbar />
			<section className='w-5/6 ml-12 text-300'>
				<div className='w-full'>
					<header>
						<h2 className='text-3xl font-black text-300'>{title}</h2>
						<p className='mt-2 text-200'>{description}</p>
					</header>
					<div>{children}</div>
				</div>
			</section>
		</div>
	);
};

export default SettingsLayout;
