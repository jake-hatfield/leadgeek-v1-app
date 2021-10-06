import React, { useState, useEffect, useCallback } from 'react';

// packages
import axios from 'axios';
import { DateTime } from 'luxon';
import { Redirect } from 'react-router';

// redux
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { setAlert } from '@features/alert/alertSlice';
import { surrogateUser } from '@features/auth/authSlice';

// components
import AuthLayout from '@components/layout/AuthLayout';
import Button from '@components/utils/Button';
import Spinner from '@components/utils/Spinner';
import { ReactComponent as Check } from '@assets/images/svgs/check.svg';
import { ReactComponent as X } from '@assets/images/svgs/x.svg';

// utils
import { capitalize, config } from '@utils/utils';
import { User } from '@utils/interfaces/User';
import { Pagination } from '@utils/interfaces/Pagination';

interface UsersState {
	status: 'loading' | 'idle';
	allUsers: User[];
	pagination: Pagination;
}

// TODO!!
// setPage crashes app in pagination component

const Admin = () => {
	const dispatch = useAppDispatch();

	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const user = useAppSelector((state) => state.auth.user);

	// local state
	const [usersState, setUsersState] = useState<UsersState>({
		allUsers: [],
		status: 'loading',
		pagination: {
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
			lastPage: null,
			totalItems: null,
			filteredItems: null,
		},
	});

	// upload leads from Google sheet to MongoDB
	// const handleExportLeads = async (e: React.MouseEvent<HTMLElement>) => {
	// 	e.stopPropagation();

	// 	try {
	// 		// make GET request to API
	// 		const { data } = await axios.get('/api/leads/export');

	// 		if (data === 'Leads were added to the database.') {
	// 			// redeploy Netlify site webhook
	// 			await axios.post(
	// 				'https://api.netlify.com/build_hooks/60f1da8987d39d7d6bceae55'
	// 			);
	// 			// alert the admin
	// 			return dispatch(
	// 				setAlert({
	// 					title: 'Upload success',
	// 					message: data,
	// 					alertType: 'success',
	// 				})
	// 			);
	// 		} else {
	// 			// alert the admin the upload failed
	// 			return dispatch(
	// 				setAlert({
	// 					title: 'Error uploading leads',
	// 					message: 'Check Google Sheets for missing attributes.',
	// 					alertType: 'danger',
	// 				})
	// 			);
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	// get all users
	const getAllUsers = useCallback(
		async (page: number, itemLimit: number) => {
			try {
				// prepare the JSON object
				const body = JSON.stringify({ page, itemLimit });

				// make a POST request to the API
				const { data } = await axios.post(
					'/api/users/get-all-users',
					body,
					config
				);

				// if there are users, set it in state
				if (data.users.length > 0) {
					const {
						users,
						page,
						hasNextPage,
						hasPreviousPage,
						nextPage,
						previousPage,
						totalItems,
					} = data;
					return setUsersState({
						...usersState,
						status: 'idle',
						allUsers: users,
						pagination: {
							...usersState.pagination,
							page,
							hasNextPage,
							hasPreviousPage,
							nextPage,
							previousPage,
							totalItems,
						},
					});
				} else {
					// set status to idle
					setUsersState({ ...usersState, status: 'idle' });

					// alert the admin that something went wrong
					return dispatch(
						setAlert({
							title: 'Something went wrong',
							message: 'There was an error retreiving users.',
							alertType: 'danger',
						})
					);
				}
			} catch (error) {
				console.log(error);
			}
		},
		[usersState, dispatch]
	);

	// get new users on page change
	useEffect(() => {
		status === 'idle' && getAllUsers(usersState.pagination.page, 20);
	}, [status, usersState.pagination.page, getAllUsers]);

	// options in admin panel
	// const adminItems = [
	// 	// export leads
	// 	{
	// 		title: 'Export leads',
	// 		misc: (
	// 			<Button
	// 				width={null}
	// 				margin={false}
	// 				size={null}
	// 				text='Confirm and export'
	// 				onClick={(e) => {
	// 					handleExportLeads(e);
	// 				}}
	// 				path={
	// 					<path
	// 						fillRule='evenodd'
	// 						d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
	// 						clipRule='evenodd'
	// 					/>
	// 				}
	// 				cta={true}
	// 				conditional={null}
	// 				conditionalDisplay={null}
	// 			/>
	// 		),
	// 	},
	// ];

	// redirect if user doesn't have permissions to view admin page
	if (user && user?.role !== 'master' && user?.role !== 'admin') {
		return <Redirect to={{ pathname: '/leads/' }} />;
	}

	return (
		<AuthLayout>
			{status === 'idle' && user ? (
				<section className='my-6 container text-300'>
					<div className='mt-12 flex items-center'>
						<div className='w-1/5'></div>
						<div className='w-4/5 ml-12 text-300'>
							<header>
								<h2 className='text-2xl font-black text-300'>
									Admin resources
								</h2>
								<p className='mt-2 text-200'>
									Keep stuff from catching fire, bruh{' '}
									<span role='img' aria-label='Fire emoji'>
										🔥
									</span>
								</p>
							</header>
							<article className='mt-4 py-2 md:py-4 lg:py-6 cs-light-300 card-200'>
								<div className='pb-4 border-b border-200'>
									<header className='card-padding-x'>
										<h2 className='font-bold text-lg text-300'>Users</h2>
									</header>
								</div>
								<div className='mt-4'>
									{status === 'idle' ? (
										<table className='w-full mt-4 table-auto'>
											<thead className='border-b border-200'>
												<tr className='text-left font-semibold text-xs text-gray-600 uppercase tracking-widest whitespace-no-wrap'>
													<th className='p-2'>Name</th>
													<th className='p-2'>Email</th>
													<th className='p-2'>Plan</th>
													<th className='p-2'>Status</th>
													<th className='p-2'>Stripe</th>
													<th className='p-2'>Surrogate</th>
												</tr>
											</thead>
											<tbody className='mt-4 text-100'>
												{usersState.allUsers.map((user) => (
													<tr
														key={user._id}
														className='text-sm border-b last:border-none border-100 dark:border-darkGray-200 hover:bg-gray-100 dark:hover:bg-darkGray-300'
													>
														<td className='py-1 px-2'>{user.name}</td>
														<td className='py-1 px-2'>
															<a
																href={`mailto:${user.email}`}
																target='_blank'
																rel='noopener noreferrer'
																className='link text-purple-500 hover:text-purple-600'
															>
																{user.email}
															</a>
														</td>
														<td className='py-1 px-2'>
															{capitalize(user.role)}
														</td>
														<td className='py-1 px-2'>
															{user.subscription.subIds[0] &&
															user.subscription.subIds[0].active ? (
																<Check className='inline-block h-4 w-4 text-teal-500 bg-teal-200 rounded-full' />
															) : (
																<X className='inline-block h-4 w-4 text-red-500 bg-red-200 rounded-full' />
															)}
														</td>
														<td className='py-1 px-2'>
															<a
																href={`https://dashboard.stripe.com/customers/${user.subscription.cusId}`}
																target='_blank'
																rel='noopener noreferrer'
																className='text-gray-500 hover:text-gray-600 transition-colors duration-100 ease-in-out'
															>
																<svg
																	xmlns='http://www.w3.org/2000/svg'
																	className='h-5 w-5'
																	viewBox='0 0 20 20'
																	fill='currentColor'
																>
																	<path d='M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z' />
																	<path
																		fillRule='evenodd'
																		d='M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z'
																		clipRule='evenodd'
																	/>
																</svg>
															</a>
														</td>
														<td className='py-1 px-2'>
															{user.lastLoggedIn
																? DateTime.fromISO(user.lastLoggedIn).toFormat(
																		'LLL dd, t'
																  )
																: '-'}
															<Button
																width={null}
																margin={false}
																size={null}
																text='Login'
																onClick={() =>
																	user?.role === 'master' &&
																	dispatch(surrogateUser({ id: user._id }))
																}
																path={null}
																cta={true}
																conditional={null}
																conditionalDisplay={null}
															/>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									) : (
										<Spinner
											divWidth={null}
											center={false}
											spinnerWidth={null}
											margin={false}
											text={'Loading users...'}
										/>
									)}
								</div>
							</article>
						</div>
					</div>
				</section>
			) : (
				<div className='h-screen'>
					<Spinner
						divWidth={null}
						center={true}
						spinnerWidth={null}
						margin={false}
						text={'Loading admin settings...'}
					/>
				</div>
			)}
		</AuthLayout>
	);
};

export default Admin;
