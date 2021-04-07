import React, { Fragment, useState, useRef } from 'react';

import { connect } from 'react-redux';
import { exportLeads } from '../redux/actions/leads';
import { getAllUsers } from '../redux/actions/auth';

import { useOutsideMousedown } from '../utils/utils';
import AuthLayout from '../components/layout/AuthLayout';
import Header from '../components/layout/navigation/Header';
import Button from '../components/layout/formField/Button';
import Spinner from '../components/layout/Spinner';

const AdminItem = ({
	title,
	desc,
	path,
	color,
	buttonText,
	buttonPath,
	onClick,
	cta,
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
				<div className='h-full flex flex-col justify-between p-4 '>
					<div className='flex items-center'>
						<span className={color}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-4 w-4'
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
						<Button
							text={buttonText}
							onClick={() => {
								showPopup((prev) => !prev);
							}}
							cta={cta}
							path={buttonPath}
						/>
					</div>
				</div>
			</article>
			{popup && (
				<div
					ref={wrapperRef}
					className='absolute inset-x-0 z-20 max-w-lg mt-6 mx-auto p-4 rounded-lg bg-white shadow-lg'
				>
					<div className='relative'>
						<h2 className='text-xl font-bold text-gray-800'>{popupHeading}</h2>
						<button
							onClick={() => showPopup((prev) => !prev)}
							className='absolute top-0 right-0 mt-1'
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

const Admin = ({ user, loading, exportLeads, getAllUsers }) => {
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
		},
		{
			title: 'View members',
			desc: 'See a list of all past and present LeadGeek members.',
			path: (
				<path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' />
			),
			color: 'text-teal-500',
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
			popupHeading: 'LeadGeek members',
			popupContent: (
				<Fragment>
					<table className='mt-4 w-full table-auto'>
						<thead className='border-b border-gray-200'>
							<tr className='font-semibold text-left text-xs text-gray-600 uppercase tracking-widest whitespace-no-wrap'>
								<th className='p-2'>Name</th>
								<th className='p-2'>Email</th>
								<th className='p-2'>Plan</th>
								<th className='p-2'>Status</th>
							</tr>
						</thead>
					</table>
				</Fragment>
			),
		},
	];

	return (
		<AuthLayout>
			{!loading ? (
				user.role === 'admin' ? (
					<section className='my-6'>
						<Header title={'Admin panel'} />
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
										title={item.title}
										desc={item.desc}
										path={item.path}
										color={item.color}
										buttonText={item.buttonText}
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

const mapStateToProps = (state) => {
	const { user, loading } = state.auth;
	return { user, loading };
};

export default connect(mapStateToProps, { exportLeads, getAllUsers })(Admin);
