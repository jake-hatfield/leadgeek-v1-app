import React, { useState, useCallback } from 'react';

// packages
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// redux
import { useAppDispatch, useAppSelector, useDarkMode } from '@hooks/hooks';
import { removeAlert, setAlert } from '@features/alert/alertSlice';
import {
	getUserData,
	updatePassword,
} from '@components/features/auth/authSlice';
import {
	defaultHeaders,
	setExportHeaders,
} from '@components/features/leads/leadsSlice';

// components
import AuthLayout from '@components/layout/AuthLayout';
import Button from '@components/utils/Button';
import FormField from '@components/utils/FormField';
import PasswordFormField from '@components/utils/PasswordFormField';
import SettingsLayout from '@components/layout/SettingsLayout';
import Spinner from '@components/utils/Spinner';
import Toggle from '@components/utils/Toggle';

// utils
import { config, passwordList } from '@utils/utils';

const AccountPage = () => {
	const dispatch = useAppDispatch();

	const { status, user, exportHeaders } = useAppSelector((state) => ({
		status: state.auth.status,
		user: state.auth.user,
		exportHeaders: state.leads.settings.exportHeaders,
	}));

	// color theme
	const [colorTheme, setTheme] = useDarkMode();

	// local state
	const [formData, setFormData] = useState({
		name: user?.name || '',
		password_1: '',
		password_2: '',
	});
	const [modal, setModal] = useState(false);
	const [headers, setHeaders] = useState(exportHeaders);

	// destructure necessary items
	const { password_1, password_2 } = formData;

	// handle form input change
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleUpdateProfile = async () => {
		if (!formData.name) {
			return dispatch(
				setAlert({
					title: 'Required field missing',
					message: "Name field can't be empty",
					alertType: 'danger',
				})
			);
		}

		if (formData.name === user?.name) {
			return dispatch(
				setAlert({
					title: 'Error updating name',
					message: 'The current and updated name are the same',
					alertType: 'warning',
				})
			);
		}

		const body = JSON.stringify({ name: formData.name });

		const { data } = await axios.put<{
			message:
				| 'Profile was successfully updated'
				| 'No user exists in the database to update';
		}>('/api/auth/profile', body, config);

		if (data.message === 'Profile was successfully updated') {
			dispatch(
				setAlert({
					title: 'Update success',
					message: 'Your profile was successfully updated',
					alertType: 'success',
				})
			);
			return dispatch(getUserData());
		} else {
			return dispatch(
				setAlert({
					title: 'Error updating profile',
					message: 'Please contact support',
					alertType: 'danger',
				})
			);
		}
	};

	const handleUpdatePassword = (
		email: string,
		password_1: string,
		password_2: string
	) => {
		if (!email) {
			return;
		}

		// error for empty password
		if (!password_1 || !password_2) {
			return dispatch(
				setAlert({
					title: 'Required field missing',
					message: "Password field can't be empty",
					alertType: 'danger',
				})
			);
		}

		// error for password not matching
		if (password_1 !== password_2) {
			return dispatch(
				setAlert({
					title: "Passwords don't match",
					message: 'Check spelling or case sensitivity',
					alertType: 'danger',
				})
			);
		}

		// error for password too short
		if (password_1.length < 7 && password_2.length < 7) {
			return dispatch(
				setAlert({
					title: 'Password is too short',
					message: 'Password must be at least 7 characters',
					alertType: 'danger',
				})
			);
		}

		// error for if password contains email string
		const stringBeforeAt = (string: string) => {
			let splitString = string.split('@');
			return splitString[0];
		};
		let emailBeforeAt = stringBeforeAt(email);
		if (
			password_1.includes(emailBeforeAt) ||
			password_2.includes(emailBeforeAt)
		) {
			return dispatch(
				setAlert({
					title: 'Password is too similar to your email',
					message: 'Please choose another password',
					alertType: 'danger',
				})
			);
		}

		// error for if password is from a list of common passwords
		if (
			passwordList.includes(password_1) ||
			passwordList.includes(password_2)
		) {
			return dispatch(
				setAlert({
					title: 'Password is too common',
					message: 'Please pick a more unique password',
					alertType: 'danger',
				})
			);
		} else {
			dispatch(removeAlert());
			// password passes, update in DB
			const password = password_1;
			return dispatch(updatePassword({ email, password, redirect: false }));
		}
	};

	const onToggle = () => {
		localStorage.setItem('theme', colorTheme);
		setTheme(colorTheme);
	};

	const reorder = (
		list: { label: string; key: string }[],
		startIndex: number,
		endIndex: number
	) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	};

	const onDragEnd = (result: any) => {
		const { destination, source } = result;

		// dragging outside the droppable area
		if (!destination) {
			return;
		}

		// dropping in the same spot
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const items = reorder(headers, source.index, destination.index);
		setHeaders(items);
	};

	const onModalClose = () => {
		return dispatch(setExportHeaders(headers));
	};

	return (
		user && (
			<AuthLayout>
				<SettingsLayout
					title={'Account'}
					description={'Change your account preferences'}
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
							<>
								<div className='pt-2 md:pt-4 lg:pt-6 cs-light-300 card-200'>
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
											value={formData.name || user.name}
											onChange={(e) => onChange(e)}
											required={true}
											styles={'w-1/2'}
										/>
										<div className='w-1/2 ml-16' />
									</div>
									<div className='flex justify-end mt-4 py-2 card-padding-x cs-bg rounded-b-lg border-t border-300'>
										<Button
											text={'Save'}
											onClick={() => handleUpdateProfile()}
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
								<article className='mt-4 pt-2 md:pt-4 lg:pt-6 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='card-padding-x'>
											<h2 className='font-bold text-lg text-300'>Security</h2>
										</header>
									</div>
									<form className='flex items-center card-padding-x'>
										<PasswordFormField
											label='New Password'
											placeholder='Create a new password'
											name='password_1'
											value={password_1}
											onChange={(e) => onChange(e)}
											required={true}
											styles={'w-1/2'}
										/>
										<PasswordFormField
											label='Confirm Password'
											placeholder='Enter the password again'
											name='password_2'
											value={password_2}
											onChange={(e) => onChange(e)}
											required={true}
											styles={'w-1/2 ml-16'}
										/>
									</form>
									<div className='flex justify-end mt-4 py-2 card-padding-x cs-bg rounded-b-lg border-t border-300'>
										<Button
											text={'Save'}
											onClick={() =>
												user?.email &&
												handleUpdatePassword(
													user?.email,
													password_1,
													password_2
												)
											}
											width={null}
											margin={false}
											size={'sm'}
											cta={true}
											path={null}
											conditional={null}
											conditionalDisplay={null}
										/>
									</div>
								</article>
								<article className='mt-4 py-2 md:py-4 lg:py-6 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='card-padding-x'>
											<h2 className='font-bold text-lg text-300'>Appearance</h2>
										</header>
									</div>
									<div className='mt-4 card-padding-x'>
										<div className='center-between text-200'>
											<div>Theme</div>
											<Toggle
												itemLeft={
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
												}
												itemRight={
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
												}
												onChange={onToggle}
												defaultChecked={colorTheme === 'dark' ? false : true}
											/>
										</div>
									</div>
								</article>
								<article className='mt-4 py-2 md:py-4 lg:py-6 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='card-padding-x'>
											<h2 className='font-bold text-lg text-300'>Leads</h2>
										</header>
									</div>
									<div className='mt-4 card-padding-x'>
										<div className='center-between text-200'>
											<div>Export preferences</div>
											<Button
												text={'Edit'}
												onClick={() => setModal((prev) => !prev)}
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
								</article>
								{modal && (
									<>
										<div
											onClick={() => {
												onModalClose();
												setModal((prev) => !prev);
											}}
											className='absolute inset-0 z-10 h-full w-full bg-gray-900 opacity-25'
										/>
										<div
											className={`absolute inset-0 z-20 h-1/2 max-w-2xl m-auto pt-2 md:pt-4 lg:pt-6 pb-8 cs-light-200 card-200`}
										>
											<div className='relative pb-1 border-b border-200'>
												<header className='flex items-end justify-between card-padding-x'>
													<h3 className='text-xl font-bold text-300'>
														Column order
													</h3>
													{/* <button
														onClick={() =>
															dispatch(setExportHeaders(defaultHeaders))
														}
														className='ml-4 link'
													>
														Reset
													</button> */}
												</header>

												<button
													onClick={() => {
														onModalClose();
														setModal((prev) => !prev);
													}}
													className='absolute top-0 right-3 md:right-5 lg:right-7 ml-2 p-1 text-100 hover:bg-gray-100 dark:hover:bg-darkGray-100 rounded-md hover:text-gray-700 dark:hover:text-gray-400 ring-gray transition-main'
												>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														className='svg-base'
														viewBox='0 0 20 20'
														fill='currentColor'
													>
														<path
															fillRule='evenodd'
															d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
															clipRule='evenodd'
														/>
													</svg>
												</button>
											</div>
											<div className='card-padding-x h-full py-6 minimal-scrollbar transform-0 -translate-y-0'>
												<DragDropContext onDragEnd={onDragEnd}>
													<Droppable droppableId={'export-headers'}>
														{(provided: any) => (
															<ul
																{...provided.droppableProps}
																ref={provided.innerRef}
															>
																{headers.map(({ key, label }, i: number) => (
																	<Draggable
																		key={key}
																		draggableId={key}
																		index={i}
																	>
																		{(provided, snapshot) => (
																			<li
																				{...provided.draggableProps}
																				{...provided.dragHandleProps}
																				ref={provided.innerRef}
																				className={`flex justify-between items-center first:mt-0 mt-2 py-2 px-4 text-200 ${
																					snapshot.isDragging
																						? 'bg-gray-200 dark:bg-darkGray-200 card-200'
																						: 'bg-gray-100 dark:bg-darkGray-100 card-100'
																				}`}
																			>
																				<span>{label}</span>
																				<span className='text-100'>
																					<svg
																						xmlns='http://www.w3.org/2000/svg'
																						className='h-5 w-5'
																						viewBox='0 0 20 20'
																						fill='currentColor'
																					>
																						<path
																							fillRule='evenodd'
																							d='M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
																							clipRule='evenodd'
																						/>
																					</svg>
																				</span>
																			</li>
																		)}
																	</Draggable>
																))}
																{provided.placeholder}
															</ul>
														)}
													</Droppable>
												</DragDropContext>
											</div>
										</div>
									</>
								)}
							</>
						)}
					</section>
				</SettingsLayout>
			</AuthLayout>
		)
	);
};

export default AccountPage;
