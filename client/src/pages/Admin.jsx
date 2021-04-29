import React, { Fragment, useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { exportLeads } from 'redux/actions/leads';
import { getAllUsers, setPage } from 'redux/actions/users';
import { setItemLimit } from 'redux/actions/filters';
import { surrogateUser } from 'redux/actions/auth';

import { useOutsideMousedown, capitalize } from 'utils/utils';
import AuthLayout from 'components/layout/AuthLayout';
import Header from 'components/layout/navigation/Header';
import Button from 'components/layout/formField/Button';
import Pagination from 'components/layout/navigation/Pagination';
import Spinner from 'components/layout/Spinner';
import { ReactComponent as Check } from 'assets/images/svgs/check.svg';
import { ReactComponent as X } from 'assets/images/svgs/x.svg';

const AdminItem = ({
	width,
	title,
	desc,
	path,
	color,
	buttonText,
	additionalFunction,
	popupHeading,
	popupContent,
}) => {
	const [popup, showPopup] = useState(false);
	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, showPopup);
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
						<span className={color}>
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
					<p className='mt-2 text-sm text-gray-700'>{desc}</p>
					<div className='mt-4'>
						<button
							onClick={() => {
								showPopup((prev) => !prev);
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
					className={`absolute top-0 inset-x-0 z-20 max-h-screen ${
						width || 'max-w-lg'
					} mt-8 mx-auto p-6 rounded-lg bg-white shadow-lg`}
				>
					<div className='relative pb-1 border-b border-gray-200'>
						<div className='flex items-center'>
							<h2 className='text-xl font-bold text-gray-800'>
								{popupHeading}
							</h2>
						</div>
						<button
							onClick={() => showPopup((prev) => !prev)}
							className='absolute top-0 right-0 mt-2 hover:text-gray-600 rounded-md transition duration-100 ease-in-out ring-gray'
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

AdminItem.propTypes = {
	width: PropTypes.string,
	title: PropTypes.string.isRequired,
	desc: PropTypes.string.isRequired,
	path: PropTypes.object.isRequired,
	color: PropTypes.string.isRequired,
	buttonText: PropTypes.string.isRequired,
	additionalFunction: PropTypes.func,
	popupHeading: PropTypes.string.isRequired,
	popupContent: PropTypes.object.isRequired,
};

const UserTable = ({
	role,
	allUsers,
	pagination,
	usersLimit,
	loading,
	getAllUsers,
	surrogateUser,
	setPage,
	setItemLimit,
}) => {
	useEffect(() => {
		getAllUsers(pagination.page, usersLimit);
	}, [pagination.page, usersLimit]);
	const type = 'users';
	return (
		<Fragment>
			{!loading ? (
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
							{allUsers.map((user) => (
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
										{user.subscription.subIds[0].active ? (
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
												role === 'master' && surrogateUser(user._id)
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
					{allUsers && (
						<Pagination
							pagination={pagination}
							type={type}
							itemLimit={usersLimit}
							loading={loading}
							setPage={setPage}
							setItemLimit={setItemLimit}
							noPadding={true}
						/>
					)}
				</div>
			) : (
				<Spinner text='Loading users...' />
			)}
		</Fragment>
	);
};

const Admin = ({
	user,
	loading,
	users: { allUsers, pagination, loading: userLoading },
	usersLimit,
	exportLeads,
	getAllUsers,
	surrogateUser,
	setPage,
	setItemLimit,
}) => {
	const { _id: userId, role } = Object(user);
	const adminItems = [
		{
			title: 'Export leads',
			desc: 'Export leads from the master spreadsheet.',
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
			color: 'text-purple-500',
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
						text='Confirm and export'
						onClick={(e) => {
							e.stopPropagation();
							exportLeads();
						}}
						path={
							<path
								fillRule='evenodd'
								d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
								clipRule='evenodd'
							/>
						}
						cta={true}
					/>
				</Fragment>
			),
			search: false,
		},
		{
			width: 'w-full max-w-3xl',
			title: 'View members',
			desc: 'See a list of all past and present LeadGeek members.',
			path: (
				<path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' />
			),
			color: 'text-teal-500',
			buttonText: 'View all members',
			additionalFunction: () => getAllUsers(pagination.page, usersLimit),
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
			popupHeading: 'LeadGeek members',
			popupContent: (
				<UserTable
					role={role}
					allUsers={allUsers}
					pagination={pagination}
					usersLimit={usersLimit}
					loading={userLoading}
					getAllUsers={getAllUsers}
					surrogateUser={surrogateUser}
					setPage={setPage}
					setItemLimit={setItemLimit}
				/>
			),
		},
	];

	return (
		<AuthLayout>
			{!loading ? (
				role === 'admin' || role === 'master' ? (
					<section className='my-6'>
						<Header title={'Admin panel'} _id={userId} role={role} />
						<div className='mt-6 container'>
							<div>
								<h2 className='font-semibold text-xl text-gray-900'>
									Resources
								</h2>
								<p>Use these tools to prevent things from catching on fire.</p>
							</div>
							<div className='mt-6 grid grid-cols-3 border-t border-b border-gray-200'>
								{adminItems.map((item, i) => (
									<AdminItem
										key={i}
										width={item.width}
										title={item.title}
										desc={item.desc}
										path={item.path}
										color={item.color}
										buttonText={item.buttonText}
										additionalFunction={item.additionalFunction}
										buttonPath={item.buttonPath}
										cta={item.cta}
										popupHeading={item.popupHeading}
										popupContent={item.popupContent}
									/>
								))}
							</div>
						</div>
					</section>
				) : (
					<section className='container'>
						<div>You aren't allowed to access this page.</div>
					</section>
				)
			) : (
				<Spinner />
			)}
		</AuthLayout>
	);
};

Admin.propTypes = {
	user: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
	exportLeads: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
	const { user, loading } = state.auth;
	const { users } = state;
	const { usersLimit } = state.filters.itemLimits;
	return { user, loading, users, usersLimit };
};

export default connect(mapStateToProps, {
	exportLeads,
	getAllUsers,
	surrogateUser,
	setPage,
	setItemLimit,
})(Admin);
