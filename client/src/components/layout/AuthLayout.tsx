import React, { Fragment } from 'react';

import { useAppSelector } from '@utils/hooks';
import { removeAlert } from '@redux/actions/alert';

import Alert from './utils/Alert';
import Navbar from './navigation/Navbar';

import { User } from '@utils/interfaces/User';

interface AuthLayoutProps {
	user: User;
	isAuthenticated: boolean;
	loading: boolean;
	removeAlert: () => void;
	children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
	isAuthenticated,
	loading,
	removeAlert,
	children,
}) => {
	const user = useAppSelector((state) => state.auth.user);

	return (
		<Fragment>
			<Alert removeAlert={removeAlert} />
			{!loading && user && isAuthenticated && (
				<div className='min-h-screen relative flex'>
					<Navbar />
					<main className='h-full w-full content'>{children}</main>
				</div>
			)}
		</Fragment>
	);
};

export default AuthLayout;
