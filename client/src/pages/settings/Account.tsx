import React, { useState } from 'react';

// packages
import { DateTime } from 'luxon';

// redux
import { useAppSelector, useDarkMode } from '@hooks/hooks';

// components
import AuthLayout from '@components/layout/AuthLayout';
import Button from '@components/utils/Button';
import FormField from '@components/utils/FormField';
import ResetPassword from '@components/auth/login/ResetPassword';
import SettingsLayout from '@components/layout/SettingsLayout';
import Spinner from '@components/utils/Spinner';

const AccountPage = () => {
	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const user = useAppSelector((state) => state.auth.user);

	// color theme
	const [colorTheme, setTheme] = useDarkMode();

	// local state
	const [checked, setChecked] = useState(colorTheme === 'dark' ? false : true);

	return (
		user && (
			<AuthLayout>
				<SettingsLayout
					title={'Account'}
					description={'Change your account preferences'}
					pill={{
						active: true,
						text:
							status === 'idle' &&
							`Member since ${DateTime.fromISO(user.dateCreated).toFormat(
								'LLL dd, yyyy'
							)}`,
					}}
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
							<>
								<div className='mt-4 pt-2 md:pt-4 lg:pt-6 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='card-padding-x'>
											<h2 className='font-bold text-lg text-300'>Profile</h2>
										</header>
									</div>
									<div className='flex items-center card-padding-x'>
										<FormField
											label={'Name'}
											type={'text'}
											name={'name'}
											placeholder={user.name}
											value={user.name}
											required={true}
											styles={'w-1/2'}
										/>
										<FormField
											label={'Email'}
											type={'email'}
											name={'email'}
											placeholder={user.email}
											value={user.email}
											required={true}
											styles={'w-1/2 ml-16'}
										/>
									</div>
									<div className='flex justify-end mt-4 py-2 card-padding-x cs-bg rounded-b-lg border-t border-300'>
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
								<div className='mt-4 pt-2 md:pt-4 lg:pt-6 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='card-padding-x'>
											<h2 className='font-bold text-lg text-300'>Security</h2>
										</header>
									</div>
									<div className='card-padding-x'>
										<ResetPassword
											email={user && user.email}
											flex={true}
											fullWidthButton={false}
										/>
									</div>
									<div className='flex justify-end mt-4 py-2 card-padding-x cs-bg rounded-b-lg border-t border-300'>
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
								<div className='mt-4 py-2 md:py-4 lg:py-6 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='card-padding-x'>
											<h2 className='font-bold text-lg text-300'>Appearance</h2>
										</header>
									</div>
									<div className='mt-4 card-padding-x'>
										<div className='center-between text-200'>
											<div>Theme</div>

											<label
												htmlFor='colorTheme'
												className='flex items-center cursor-pointer text-sm font-semibold text-100'
											>
												<span aria-label='light'>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														className='svg-base'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
														/>
													</svg>
												</span>
												<div className='relative mx-2'>
													<input
														type='checkbox'
														defaultChecked={
															colorTheme === 'dark' ? true : false
														}
														onChange={() => {
															setChecked((prev) => !prev);
															localStorage.setItem('theme', colorTheme);
															setTheme(colorTheme);
														}}
														id='colorTheme'
														className='sr-only'
													/>
													<div className='block bg-gray-300 dark:bg-darkGray-200 w-12 h-6 rounded-full border border-300' />
													<div
														className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full transition transform ${
															!checked
																? 'bg-white'
																: 'bg-purple-300 translate-x-6'
														} shadow-md`}
													/>
												</div>
												<span aria-label='dark'>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														className='svg-base'
														viewBox='0 0 20 20'
														fill='currentColor'
													>
														<path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
													</svg>
												</span>
											</label>
										</div>
									</div>
								</div>
							</>
						)}
					</section>
				</SettingsLayout>
			</AuthLayout>
		)
	);
};

export default AccountPage;
