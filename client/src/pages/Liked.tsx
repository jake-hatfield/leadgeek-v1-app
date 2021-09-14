import React, { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '@utils/hooks';
import { getLikedLeads } from '@features/leads/leadsSlice';

import AuthLayout from '@components/layout/AuthLayout';
import Leads from '@components/features/leads/Leads';
import Spinner from '@components/utils/Spinner';

const LikedPage = () => {
	const dispatch = useAppDispatch();
	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const user = useAppSelector((state) => state.auth.user);
	// lead state
	const liked = useAppSelector((state) => state.leads.liked);
	const filters = useAppSelector((state) => state.filters);
	// destructure necessary items
	const { page } = liked.pagination;

	useEffect(() => {
		status === 'idle' &&
			isAuthenticated &&
			user &&
			dispatch(getLikedLeads({ leads: user.likedLeads, page, filters }));
	}, [status, isAuthenticated, user, page, filters, dispatch]);

	return status === 'idle' && user ? (
		<AuthLayout>
			<Leads
				leads={liked.pageByIds}
				pagination={liked.pagination}
				type={'liked'}
				itemLimit={filters.itemLimit}
				headerTitle={null}
				user={user}
				status={status}
				search={false}
				currentSearchParam={null}
			/>
		</AuthLayout>
	) : (
		<div className='h-screen'>
			<Spinner
				divWidth={null}
				center={true}
				spinnerWidth={null}
				margin={false}
				text={'Loading your Leadgeek profile...'}
			/>
		</div>
	);
};

export default LikedPage;
