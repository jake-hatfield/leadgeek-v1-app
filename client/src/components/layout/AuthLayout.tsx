import React, { Fragment, useState, useEffect } from 'react';

// packages
import { useSpring } from 'react-spring';

// redux
import { useAppSelector } from '@utils/hooks';
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

	// alert state
	const alert = useAppSelector((state) => state.alert);

	// local state
	const [alertVisible, setAlertVisible] = useState(alert.visible);

	const animationStyle = useSpring({
		// transform: visible ? 'translateY(0)' : 'translateY(-200%)',
		opacity: alertVisible ? 1 : 0,
	});

	useEffect(() => {
		setAlertVisible(alert.visible);
	}, [alert.visible]);

	return (
		<Fragment>
			{alertVisible && (
				<Alert
					id={alert.id}
					title={alert.title}
					message={alert.message}
					alertType={alert.alertType}
					animationStyle={animationStyle}
				/>
			)}
			{status === 'idle' && isAuthenticated && user ? (
				<div className='min-h-screen relative flex bg-gray-100 dark:bg-darkGray-500'>
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
