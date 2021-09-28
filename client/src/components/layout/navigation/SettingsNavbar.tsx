import React, { useState } from 'react';

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
		<div v-for='item in items'>
			<NavLink
				className='pt-3 pb-2 px-6 relative center-between group font-semibold text-200 rounded-main hover:bg-gray-200 dark:hover:bg-darkGray-100 transition-main ring-gray focus:ring-inset'
				activeClassName='bg-gray-200 dark:bg-darkGray-100'
				to={link.link}
			>
				<span>{link.title}</span>
				{link.new && (
					<span className='p-1 rounded-main cs-purple text-xs'>New</span>
				)}
			</NavLink>
		</div>
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
		{
			title: 'Affiliates',
			link: '/settings/affiliates/',
			description:
				'Generate your unique affiliate link and view earned commissions',
			new: true,
		},
	];

	return (
		<nav className='w-1/6 flex flex-col justify-between text-100'>
			<aside>
				<ol>
					{primaryLinks.map((link, i) => (
						<li key={i} className='first:mt-0'>
							<NavbarLink link={link} />
						</li>
					))}
				</ol>
			</aside>
		</nav>
	);
};

export default SettingsNavbar;
