import React from 'react';

// components
import SettingsNavbar from '@components/layout/navigation/SettingsNavbar';

interface SettingsLayoutProps {
	children: React.ReactNode;
	title: string;
	description: string;
	pill: any;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
	children,
	title,
	description,
	pill,
}) => {
	return (
		<div className='flex flex-row container mt-12'>
			<SettingsNavbar />
			<section className='w-4/5 max-w-4xl ml-12 text-300'>
				<header>
					<h2 className='text-2xl font-black text-300'>{title}</h2>
					<p className='mt-2 text-200'>{description}</p>
				</header>
				<div>{children}</div>
			</section>
		</div>
	);
};

export default SettingsLayout;
