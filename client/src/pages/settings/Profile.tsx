import React from 'react';

// packages
import { DateTime } from 'luxon';

// redux
import { useAppSelector } from '@hooks/hooks';

// components
import AuthLayout from '@components/layout/AuthLayout';
import SettingsLayout from '@components/layout/SettingsLayout';
import FormField from '@components/utils/FormField';
import Spinner from '@components/utils/Spinner';

const ProfilePage = () => {
	const status = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const user = useAppSelector((state) => state.auth.user);
	return (
		user && (
			<AuthLayout>
				<SettingsLayout
					title={'Profile'}
					description={'Edit your Leadgeek profile'}
					pill={{
						active: true,
						text:
							status === 'idle' &&
							`Member since ${DateTime.fromISO(user.dateCreated).toFormat(
								'LLL dd, yyyy'
							)}`,
					}}
					isAuthenticated={isAuthenticated}
					user={user}
				>
					<section>
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
								<article className='w-full max-w-md mt-6'>
									<header>
										<h2 className='font-bold text-lg text-gray-800'>
											Basic information
										</h2>
									</header>
									<div className='mt-4'>
										<FormField
											label={'Name'}
											type={'text'}
											name={'name'}
											placeholder={user.name}
											value={user.name}
											required={true}
											styles={null}
										/>
										<FormField
											label={'Email'}
											type={'email'}
											name={'email'}
											placeholder={user.email}
											value={user.email}
											required={true}
											styles={null}
										/>
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

export default ProfilePage;
