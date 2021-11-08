import React, { useState, useEffect, useCallback } from 'react';

// packages
import axios from 'axios';
import { DateTime } from 'luxon';
import { Redirect } from 'react-router';
import { useStateIfMounted } from 'use-state-if-mounted';

// redux
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { setAlert } from '@features/alert/alertSlice';
import { surrogateUser } from '@features/auth/authSlice';

// components
import AuthLayout from '@components/layout/AuthLayout';
import LocalPaginationComponent from '@components/layout/navigation/LocalPagination';
import NullState from '@components/utils/NullState';
import Spinner from '@components/utils/Spinner';
import Toggle from '@components/utils/Toggle';
import { ReactComponent as Check } from '@assets/images/svgs/check.svg';
import { ReactComponent as X } from '@assets/images/svgs/x.svg';

// utils
import { capitalize } from '@utils/utils';
import { User } from '@utils/interfaces/User';
import { Pagination } from '@utils/interfaces/Pagination';

interface UsersState {
	status: 'loading' | 'idle' | 'failed';
	totalByIds: User[];
	pageByIds: User[];
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
	const [toolsActive, setToolsActive] = useState(false);
	const [usersState, setUsersState] = useStateIfMounted<UsersState>({
		status: 'loading',
		totalByIds: [],
		pageByIds: [],
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
	const handleExportLeads = async () => {
		try {
			// make GET request to API
			const { data } = await axios.post<{
				message:
					| 'No user found'
					| 'Access prohibited'
					| 'Error connecting to Google Sheets'
					| 'Leads were added to the database'
					| 'There was an error uploading the leads'
					| 'There were no rows to pull from Google Sheets';
			}>('/api/leads/export');

			if (data.message === 'Leads were added to the database') {
				// redeploy Netlify site webhook
				await axios.post(
					'https://api.netlify.com/build_hooks/60f1da8987d39d7d6bceae55'
				);
				// alert the admin
				return dispatch(
					setAlert({
						title: 'Upload success',
						message: data.message,
						alertType: 'success',
					})
				);
			} else {
				// alert the admin the upload failed
				return dispatch(
					setAlert({
						title: 'Error uploading leads',
						message: 'Check Google Sheets for missing attributes.',
						alertType: 'danger',
					})
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	// get all users
	const getAllUsers = useCallback(async () => {
		try {
			// make a POST request to the API
			const { data } = await axios.get<{
				users: User[];
				message: string;
			}>(`/api/users/`);

			// if there are users, set it in state
			if (data.users.length > 0) {
				const itemLimit = 20;

				return setUsersState({
					...usersState,
					status: 'idle',
					totalByIds: data.users,
					pageByIds: data.users.slice(0, itemLimit),
					pagination: {
						...usersState.pagination,
						page: 1,
						hasNextPage: data.users.length > itemLimit ? true : false,
						hasPreviousPage: false,
						nextPage: 2,
						previousPage: 0,
						lastPage: Math.ceil(data.users.length / itemLimit),
						totalItems: data.users.length,
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
	}, [usersState, setUsersState, dispatch]);

	// get new users on page load
	useEffect(() => {
		status === 'idle' &&
			user?._id &&
			usersState.totalByIds.length === 0 &&
			getAllUsers();
	}, [status, user?._id, usersState.totalByIds, getAllUsers]);

	const onToggle = () => {
		setToolsActive((prev) => !prev);
	};

	// options in admin panel
	const adminItems = [
		// export leads
		{
			title: 'Export leads',
			onClick: () => handleExportLeads(),
		},
	];

	// redirect if user doesn't have permissions to view admin page
	if (user && user?.role !== 'master' && user?.role !== 'admin') {
		return <Redirect to={{ pathname: '/' }} />;
	}

	return (
		<AuthLayout>
			{status !== 'loading' && user ? (
				<section className='my-6 container text-300'>
					<div className='flex mt-12'>
						<nav className='w-1/5 flex flex-col text-100 text-sm'>
							<header className='center-between'>
								<h3 className='text-lg font-bold text-300'>Tools</h3>
								<Toggle
									itemLeft={null}
									itemRight={null}
									onChange={onToggle}
									defaultChecked={false}
								/>
							</header>
							<ol className='mt-4 pb-1 border-l-2 border-200'>
								{adminItems.map((item, i) => (
									<li key={i}>
										<NavbarLink item={item} status={toolsActive} />
									</li>
								))}
							</ol>
						</nav>
						<div className='w-4/5 ml-12 text-300'>
							<header>
								<h2 className='text-2xl font-black text-300'>
									Admin resources
								</h2>
								<p className='mt-2 text-200'>
									Keep stuff from catching fire{' '}
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
								{user.role === 'master' ? (
									usersState.status === 'idle' ? (
										<table className='w-full table-auto'>
											<thead className='border-b border-200'>
												<tr className='cs-bg text-left font-semibold text-xs text-gray-600 uppercase tracking-widest whitespace-no-wrap'>
													<th className='p-3' />
													<th className='p-3'>Name</th>
													<th className='p-3'>Email</th>
													<th className='p-3'>Plan</th>
													<th className='p-3'>Created</th>
													<th className='p-3'>Last login</th>
												</tr>
											</thead>
											<tbody className='text-100'>
												{usersState.pageByIds.map((lgUser) => (
													<tr
														key={lgUser._id}
														className='text-sm border-b last:border-none border-100 dark:border-darkGray-200 hover:bg-gray-100 dark:hover:bg-darkGray-300'
													>
														<td className='p-3 all-center'>
															{lgUser.subscription.subIds[0] &&
															lgUser.subscription.subIds[0].active ? (
																<Check className='inline-block svg-sm text-teal-900 bg-teal-200 rounded-full' />
															) : (
																<X className='inline-block svg-sm text-red-500 dark:text-red-600 bg-red-200 dark:bg-red-100 rounded-full' />
															)}
														</td>
														<td className='p-3'>
															<button
																onClick={() =>
																	user?.role === 'master' &&
																	dispatch(
																		surrogateUser({
																			surrogateId: lgUser._id,
																		})
																	)
																}
																className='link'
															>
																{lgUser.name}
															</button>
														</td>
														<td className='p-3'>{lgUser.email}</td>
														<td className='p-3'>{capitalize(lgUser.role)}</td>
														<td className='p-3'>
															{lgUser.lastLoggedIn
																? DateTime.fromISO(
																		lgUser.dateCreated.toString()
																  ).toFormat('LLL dd')
																: '-'}
														</td>
														<td className='p-3'>
															{lgUser.lastLoggedIn
																? DateTime.fromISO(
																		lgUser.lastLoggedIn.toString()
																  ).toFormat('LLL dd @ t')
																: '-'}
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
									)
								) : (
									<div className='container pt-3'>
										<NullState
											header={'Access denied'}
											text={
												'You need special clearance to view Leadgeek clients'
											}
											path={
												<path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
											}
											link={''}
											linkText={''}
										/>
									</div>
								)}
							</article>
							{usersState.totalByIds.length > 0 && user.role === 'master' && (
								<LocalPaginationComponent
									items={usersState.totalByIds}
									pagination={usersState.pagination}
									setItems={setUsersState}
								/>
							)}
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

interface NavbarLinkProps {
	item: {
		title: string;
		onClick: any;
	};
	status: boolean;
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ item, status }) => {
	return (
		<button
			className={`mb-2 -ml-0.5 pl-4 relative flex items-center group ${
				status === false
					? 'opacity-25 cursor-default'
					: 'opacity-100 hover:text-purple-500 dark:hover:text-purple-300 hover:border-purple-500 dark:hover:border-purple-200'
			} font-semibold text-base text-gray-800 dark:text-gray-200 border-l-2 border-gray-200 dark:border-darkGray-100  transition-main`}
			disabled={!status}
			onClick={item.onClick}
		>
			{item.title}
		</button>
	);
};

export default Admin;
