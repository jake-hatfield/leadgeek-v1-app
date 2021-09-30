import React from 'react';

import { NavLink } from 'react-router-dom';

interface NavbarLinkProps {
	link: {
		title: string;
		link: string;
		description: string;
		new: boolean;
	};
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ link }) => {
	return (
		<NavLink
			className='mb-2 -ml-0.5 pl-4 relative flex items-center group font-semibold text-gray-800 dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-300 border-l-2 border-gray-200 dark:border-darkGray-100 hover:border-purple-500 dark:hover:border-purple-200 transition-main'
			activeClassName='border-l-2 border-purple-500 dark:border-purple-300 text-purple-500 dark:text-purple-300'
			to={link.link}
		>
			<span>{link.title}</span>
			{link.new && (
				<span className='ml-6 py-0.5 px-1 rounded-main cs-purple text-xs'>
					New
				</span>
			)}
		</NavLink>
	);
};

const SettingsNavbar = () => {
	const primaryLinks = [
		{
			title: 'Security',
			link: '/settings/security/',
			description: 'Change your password & security preferences',
			new: false,
		},
		{
			title: 'Billing',
			link: '/settings/billing/',
			description: 'Manage your Leadgeek plans',
			new: false,
		},
		// {
		// 	title: 'Affiliates',
		// 	link: '/settings/affiliates/',
		// 	description:
		// 		'Generate your unique affiliate link and view earned commissions',
		// 	new: true,
		// },
	];

	return (
		<nav className='w-1/6 flex flex-col text-100 text-sm'>
			<h3 className='text-lg font-bold text-300'>Settings</h3>
			<ol className='mt-4 pb-1 border-l-2 border-200'>
				{primaryLinks.map((link, i) => (
					<li key={i} className='first:mt-0'>
						<NavbarLink link={link} />
					</li>
				))}
			</ol>
		</nav>
	);
};

export default SettingsNavbar;
