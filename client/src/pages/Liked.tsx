import React, { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '@utils/hooks';
import { getLikedLeads } from '@features/leads/leadsSlice';

import AuthLayout from '@components/layout/AuthLayout';
import Leads from '@components/leads/Leads';
import Spinner from '@components/layout/utils/Spinner';

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
	const {
		itemLimits: { leadsLimit: itemLimit },
	} = filters;

	useEffect(() => {
		status === 'idle' &&
			isAuthenticated &&
			user &&
			dispatch(getLikedLeads({ leads: user.likedLeads, page, itemLimit }));
	}, [status, isAuthenticated, user, page, itemLimit, dispatch]);

	return status === 'idle' && user ? (
		<AuthLayout>
			<Leads
				leads={liked.pageByIds}
				pagination={liked.pagination}
				type={'liked'}
				itemLimit={itemLimit}
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
