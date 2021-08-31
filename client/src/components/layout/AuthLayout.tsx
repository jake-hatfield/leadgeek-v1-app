import React, { Fragment } from 'react';

import { useAppSelector } from '@utils/hooks';
// import { removeAlert } from '@features/alert/alertSlice';

// import Alert from "@features/alert/Alert"
import Navbar from './navigation/Navbar';

import { User } from '@utils/interfaces/User';

interface AuthLayoutProps {
	// removeAlert: () => void;
	children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
	const status = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const user = useAppSelector((state) => state.auth.user);

	return (
		<Fragment>
			{/* <Alert removeAlert={removeAlert} /> */}
			{status === 'idle' && user && isAuthenticated && (
				<div className='min-h-screen relative flex'>
					<Navbar />
					<main className='h-full w-full content'>{children}</main>
				</div>
			)}
		</Fragment>
	);
};

export default AuthLayout;
