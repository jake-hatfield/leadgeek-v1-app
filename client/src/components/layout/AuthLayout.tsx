import React, { Fragment } from 'react';

// redux
import { useAppSelector } from '@hooks/hooks';
import Alert from '@components/features/alert/Alert';

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
			{status === 'idle' && isAuthenticated && user ? (
				<div className='min-h-screen w-full relative cs-bg overflow-hidden'>
					<Navbar />
					<main className='h-full w-full '>{children}</main>
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
			<Alert />
		</Fragment>
	);
};

export default AuthLayout;
