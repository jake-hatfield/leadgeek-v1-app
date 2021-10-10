import React, { Fragment } from 'react';

// packages
import { NavLink } from 'react-router-dom';

// redux
import Alert from '@components/features/alert/Alert';

// components
import DefaultFooter from '@components/layout/navigation/DefaultFooter';
import { ReactComponent as LeadGeekLogo } from '@assets/images/svgs/logo-app.svg';

interface DefaultLayoutProps {
	children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
	return (
		<Fragment>
			<div className='flex flex-col justify-between h-screen bg-splatter'>
				<div className='fixed z-10 inset-x-0 top-0 h-3 bg-gray-900' />
				<header className='mt-8 hidden md:block container'>
					<NavLink to={'/'}>
						<LeadGeekLogo className='default-logo-lg text-purple-500' />
					</NavLink>
				</header>
				<main className='relative h-full'>{children}</main>
				<DefaultFooter />
			</div>
			<Alert />
		</Fragment>
	);
};

export default DefaultLayout;
