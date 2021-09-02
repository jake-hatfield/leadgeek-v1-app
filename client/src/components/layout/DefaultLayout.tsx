import React, { Fragment } from 'react';

// redux
import Alert from '@components/features/alert/Alerts';

interface DefaultLayoutProps {
	children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
	return (
		<Fragment>
			<Alert />
			<main className='relative flex flex-col h-screen'>{children}</main>
		</Fragment>
	);
};

export default DefaultLayout;
