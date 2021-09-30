import React from 'react';

// redux
import { useAppSelector } from '@hooks/hooks';

// components
import AuthLayout from '@components/layout/AuthLayout';
import Button from '@components/utils/Button';
import ResetPassword from '@components/auth/login/ResetPassword';
import SettingsLayout from '@components/layout/SettingsLayout';
import Spinner from '@components/utils/Spinner';

const Dashboard = () => {
	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const user = useAppSelector((state) => state.auth.user);
	return (
		isAuthenticated &&
		user && (
			<AuthLayout>
				<SettingsLayout
					title={'Security'}
					description={'Change your password'}
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
							<div className='mt-4 pt-2 md:pt-4 lg:pt-6 cs-light-300 card-200'>
								<div className='pb-4 border-b border-200'>
									<header className='card-padding-x'>
										<h2 className='font-bold text-lg text-300'>
											Update password
										</h2>
									</header>
								</div>
								<div className='card-padding-x'>
									<ResetPassword
										email={user && user.email}
										flex={true}
										fullWidthButton={false}
									/>
								</div>
								<div className='flex justify-end mt-4 py-2 card-padding-x cs-bg-light rounded-b-lg border-t border-300'>
									<Button
										text={'Save'}
										onClick={() => alert('hello')}
										width={null}
										margin={false}
										size={'sm'}
										cta={true}
										path={null}
										conditional={null}
										conditionalDisplay={null}
									/>
								</div>
							</div>
						)}
					</section>
				</SettingsLayout>
			</AuthLayout>
		)
	);
};

export default Dashboard;
