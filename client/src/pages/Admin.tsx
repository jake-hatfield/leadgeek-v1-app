import React, {
	Fragment,
	useState,
	useEffect,
	useRef,
	useCallback,
} from 'react';

// packages
import { Redirect } from 'react-router';
import axios from 'axios';

// redux
import { useAppDispatch, useAppSelector } from '@utils/hooks';
import { setAlert } from '@features/alert/alertSlice';
import { surrogateUser } from '@features/auth/authSlice';
import { setItemLimit } from '@features/filters/filtersSlice';

// components
import AuthLayout from '@components/layout/AuthLayout';
import Button from '@components/utils/Button';
import Header from '@components/layout/navigation/Header';
import PaginationComponent from '@components/layout/navigation/Pagination';
import Spinner from '@components/utils/Spinner';
import { ReactComponent as Check } from '@assets/images/svgs/check.svg';
import { ReactComponent as X } from '@assets/images/svgs/x.svg';

// utils
import { capitalize, config, useOutsideMousedown } from '@utils/utils';
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
	const handleExportLeads = async (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		try {
			const { data } = await axios.get('/api/leads/export');
			if (data === 'Leads were added to the database.') {
				// redeploy Netlify site webhook
				await axios.post(
					'https://api.netlify.com/build_hooks/60f1da8987d39d7d6bceae55'
				);
				return dispatch(
					setAlert({
						title: 'Upload success',
						message: data,
						alertType: 'success',
					})
				);
			} else {
				return dispatch(
					setAlert({
						title: 'Error uploading leads',
						message:
							'See error code in the console or check Google Sheets for duplicate/missing attributes.',
						alertType: 'danger',
					})
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	// get all users
	const getAllUsers = async (page: number, itemLimit: number) => {
		try {
			const body = JSON.stringify({ page, itemLimit });
			const { data } = await axios.post(
				'/api/users/get-all-users',
				body,
				config
			);
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
				setUsersState({ ...usersState, status: 'idle' });
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
	};

	// options in admin panel
	const adminItems = [
		// export leads
		{
			height: 'h-auto',
			width: null,
			title: 'Export leads',
			description: 'Export leads from the master spreadsheet.',
			additionalFunction: null,
			path: (
				<g>
					<path d='M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z' />
					<path
						stroke='#fff'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M8 11h4m-2-2v4'
					/>
				</g>
			),
			buttonText: 'Export all leads',
			buttonPath: (
				<path
					fillRule='evenodd'
					d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
					clipRule='evenodd'
				/>
			),
			cta: true,
			popupHeading: 'Upload confirmation required',
			popupContent: (
				<Fragment>
					<p className='pt-2 pb-6 text-gray-700'>
						Please confirm the leads you're adding aren't duplicates and that
						all required information is present.
					</p>
					<Button
						width={null}
						margin={false}
						size={null}
						text='Confirm and export'
						onClick={(e) => {
							handleExportLeads(e);
						}}
						path={
							<path
								fillRule='evenodd'
								d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
								clipRule='evenodd'
							/>
						}
						cta={true}
						conditional={null}
						conditionalDisplay={null}
					/>
				</Fragment>
			),
			search: false,
		},
		// view members
		{
			height: 'h-auto',
			width: 'w-full max-w-3xl',
			title: 'View members',
			additionalFunction: () => getAllUsers(usersState.pagination.page, 15),
			description: 'See a list of all past and present LeadGeek members.',
			path: (
				<path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' />
			),
			buttonText: 'View all members',
			buttonPath: (
				<g>
					<path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
					<path
						fillRule='evenodd'
						d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
						clipRule='evenodd'
					/>
				</g>
			),
			cta: false,
			popupHeading: 'Leadgeek members',
			popupContent: (
				<UserTable
					status={status}
					role={user?.role}
					usersState={usersState}
					usersLimit={15}
					setUsersState={setUsersState}
					getAllUsers={getAllUsers}
				/>
			),
		},
	];

	// redirect if user doesn't have permissions to view admin page
	if (user && user?.role !== 'master') {
		if (user && user?.role !== 'admin') {
			return <Redirect to={{ pathname: '/leads' }} />;
		}
	}

	return (
		<AuthLayout>
			{status === 'idle' && user ? (
				<section className='mb-6'>
					<Header
						userId={user._id}
						title={'Admin panel'}
						searchActive={false}
					/>
					<div className='mt-6 container'>
						<div>
							<h2 className='font-semibold text-xl text-gray-900'>Resources</h2>
							<p>Use these tools to prevent things from catching on fire.</p>
						</div>
						<div className='mt-6 grid grid-cols-3 border-t border-b border-gray-200'>
							{adminItems.map((item, i) => (
								<AdminItem
									key={i}
									height={item.height}
									width={item.width}
									title={item.title}
									description={item.description}
									additionalFunction={item.additionalFunction}
									path={item.path}
									buttonText={item.buttonText}
									popupHeading={item.popupHeading}
									popupContent={item.popupContent}
								/>
							))}
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

interface AdminItemProps {
	height: string | null;
	width: string | null;
	title: string;
	description: string;
	additionalFunction: null | (() => void);
	path: JSX.Element;
	buttonText: string;
	popupHeading: string;
	popupContent: JSX.Element;
}

const AdminItem: React.FC<AdminItemProps> = ({
	height,
	width,
	title,
	description,
	additionalFunction,
	path,
	buttonText,
	popupHeading,
	popupContent,
}) => {
	// local state
	const [popup, setPopup] = useState(false);

	// close popup on outside mousedown
	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, setPopup, null);

	// close modal on esc key
	const keyPress = useCallback(
		(e) => {
			if (e.key === 'Escape' && popup) {
				setPopup(false);
			}
		},
		[setPopup, popup]
	);
	useEffect(() => {
		document.addEventListener('keydown', keyPress);
		return () => document.removeEventListener('keydown', keyPress);
	}, [keyPress]);

	return (
		<Fragment>
			<article
				v-for='item in items'
				className='even:border-r even:border-l border-gray-200'
			>
				{popup && (
					<div className='absolute z-10 top-0 right-0 h-screen w-full bg-gray-900 opacity-25' />
				)}
				<div className='h-full flex flex-col justify-between p-4'>
					<div className='flex items-center'>
						<span className='text-purple-500'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								{path}
							</svg>
						</span>
						<h3 className='ml-2 font-semibold text-gray-900'>{title}</h3>
					</div>
					<p className='mt-2 text-sm text-gray-700'>{description}</p>
					<div className='mt-4'>
						<button
							onClick={() => {
								setPopup((prev) => !prev);
								additionalFunction && additionalFunction();
							}}
							className='link text-purple-500 hover:text-purple-600 rounded-lg transition duration-100 ease-in-out ring-purple'
						>
							{buttonText}
						</button>
					</div>
				</div>
			</article>
			{popup && (
				<div
					ref={wrapperRef}
					className={`absolute top-1/2 inset-x-0 z-20 ${
						height || 'h-1/2'
					} max-h-screen ${
						width || 'max-w-lg'
					} mx-auto p-6 rounded-lg bg-white shadow-lg transform -translate-y-1/2`}
				>
					<div className='relative pb-1 border-b border-gray-200'>
						<header className='flex items-center'>
							<h2 className='text-xl font-bold text-gray-800'>
								{popupHeading}
							</h2>
						</header>
						<button
							onClick={() => setPopup((prev) => !prev)}
							className='absolute top-0 right-0 p-1 hover:bg-gray-100 rounded-md hover:text-gray-700 ring-gray transition duration-100 ease-in-out'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5'
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

					{popupContent}
				</div>
			)}
		</Fragment>
	);
};

interface UserTableProps {
	status: 'idle' | 'loading' | 'failed';
	role?: 'user' | 'grow' | 'pro' | 'bundle' | 'affiliate' | 'admin' | 'master';
	usersState: UsersState;
	usersLimit: number;
	setUsersState: any;
	getAllUsers: (page: number, usersLimit: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
	status,
	role,
	usersState,
	usersLimit,
	setUsersState,
	getAllUsers,
}) => {
	const dispatch = useAppDispatch();

	// get new users on page change
	useEffect(() => {
		getAllUsers(usersState.pagination.page, usersLimit);
	}, [usersState.pagination.page, usersLimit, getAllUsers]);
	const type = 'users';

	// set page for pagination component
	const setPage = (page: number, type: string) => {
		setUsersState({
			...usersState,
			pagination: {
				...usersState.pagination,
				page: page,
			},
		});
	};

	return (
		<Fragment>
			{status === 'idle' ? (
				<div>
					<table className='w-full mt-4 table-auto'>
						<thead className='border-b border-gray-200'>
							<tr className='font-semibold text-left text-xs text-gray-600 uppercase tracking-widest whitespace-no-wrap'>
								<th className='p-2'>Name</th>
								<th className='p-2'>Email</th>
								<th className='p-2'>Plan</th>
								<th className='p-2'>Status</th>
								<th className='p-2'>Stripe</th>
								<th className='p-2'>Surrogate</th>
							</tr>
						</thead>
						<tbody className='mt-4 text-gray-700'>
							{usersState.allUsers.map((user) => (
								<tr
									key={user._id}
									className='text-sm border-b border-gray-200 hover:bg-gray-100'
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
									<td className='py-1 px-2'>{capitalize(user.role)}</td>
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
										{/* {user.lastLogin
                                            ? DateTime.fromISO(user.lastLogin).toFormat('LLL dd, t')
                                            : '-'} */}
										<button
											onClick={() =>
												role === 'master' &&
												dispatch(surrogateUser({ id: user._id }))
											}
											className='py-1 px-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white shadow-sm hover:shadow-md transition-colors duration-100 ease-in-out ring-purple'
										>
											<div>Login</div>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{/* {usersState.allUsers && (
						<PaginationComponent
							pagination={usersState.pagination}
							type={type}
							itemLimit={usersLimit}
							status={status}
							padding={false}
							setPage={setPage}
							setItemLimit={setItemLimit}
						/>
					)} */}
				</div>
			) : (
				<Spinner
					divWidth={null}
					center={false}
					spinnerWidth={null}
					margin={false}
					text={'Loading users...'}
				/>
			)}
		</Fragment>
	);
};

export default Admin;
