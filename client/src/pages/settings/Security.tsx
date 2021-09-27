import React from 'react';

// redux

// components
import AuthLayout from '@components/layout/AuthLayout';
import SettingsLayout from '@components/layout/SettingsLayout';
import ResetPassword from '@components/auth/login/password/ResetPassword';
import Spinner from '@components/utils/Spinner';
import { useAppSelector } from '@hooks/hooks';

const Dashboard = () => {
	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const user = useAppSelector((state) => state.auth.user);
	return (
		user && (
			<AuthLayout colorTheme={'light'}>
				<SettingsLayout
					user={user}
					title={'Security & password'}
					description={'Change your password & other security settings'}
					isAuthenticated={isAuthenticated}
					pill={null}
				>
					<section className='my-6'>
						{status === 'loading' ? (
							<Spinner
								divWidth={null}
								center={false}
								spinnerWidth={'sm'}
								margin={false}
								text={null}
							/>
						) : (
							<div className='w-full max-w-3xl'>
								<article>
									<h3 className='font-bold text-lg text-gray-800'>
										Reset Password
									</h3>
									<div className='max-w-md'>
										<ResetPassword email={user && user.email} />
									</div>
								</article>
							</div>
						)}
					</section>
				</SettingsLayout>
			</AuthLayout>
		)
	);
};

export default Dashboard;
