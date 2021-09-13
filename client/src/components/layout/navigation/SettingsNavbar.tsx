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
	const [hover, setHover] = useState(false);
	return (
		<div v-for='item in items'>
			<NavLink
				className='py-3 px-6 relative flex items-center justify-between group pb-2 font-semibold text-gray-700 hover:bg-gray-200 transition duration-100 ease-in-out ring-gray focus:ring-inset'
				activeClassName='bg-gray-200'
				onMouseEnter={() => setHover(!hover)}
				onMouseLeave={() => setHover(false)}
				to={link.link}
			>
				{hover && (
					<div className='w-auto max-w-md mt-2 ml-2 p-2 absolute left-0 z-40 transform -translate-y-1 translate-x-56 rounded-lg bg-gray-900 shadow-md text-white text-sm whitespace-nowrap'>
						{link.description}
					</div>
				)}
				<span>{link.title}</span>
				{link.new && (
					<span className='p-1 rounded-lg bg-purple-500 text-white text-xs'>
						New
					</span>
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
		<nav className='fixed top-0 left-15 z-10 h-full min-h-screen w-56 pt-8 pb-16 flex flex-col justify-between bg-gray-100 text-gray-600 border-r border-gray-400'>
			<aside>
				<h1 className='px-6 text-xl text-gray-900 font-bold'>Settings</h1>
				<ol className='pt-4'>
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
