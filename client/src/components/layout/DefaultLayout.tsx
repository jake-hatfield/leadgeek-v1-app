import React, { Fragment } from 'react';

// import { removeAlert } from '@redux/actions/alert';

// import {Alert} from '@features/alert/Alert'

interface DefaultLayoutProps {
	// removeAlert: () => void;
	children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
	return (
		<Fragment>
			{/* <Alert removeAlert={removeAlert} /> */}
			<main className='relative flex flex-col h-screen'>{children}</main>
		</Fragment>
	);
};

export default DefaultLayout;
