import React, { Fragment } from 'react';

// redux
import { useAppSelector } from '@utils/hooks';
import Alert from '@components/features/alert/Alerts';

// components
import Navbar from '@components/layout/navigation/Navbar';
import Spinner from '@components/utils/Spinner';

interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const user = useAppSelector((state) => state.auth.user);

	return (
		<Fragment>
			<Alert />
			{status === 'idle' && isAuthenticated && user ? (
				<div className='min-h-screen relative flex bg-gray-100 dark:bg-red-500'>
					<Navbar />
					<main className='h-full w-full content'>{children}</main>
				</div>
			) : (
				<Spinner
					divWidth={null}
					center={true}
					spinnerWidth={null}
					margin={false}
					text={'Loading account...'}
				/>
			)}
		</Fragment>
	);
};

export default AuthLayout;
