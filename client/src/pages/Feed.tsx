import React, { useEffect } from 'react';

// redux
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { getFeedLeads } from '@features/leads/leadsSlice';

// components
import AuthLayout from '@components/layout/AuthLayout';
import Leads from '@components/features/leads/Leads';
import Spinner from '@components/utils/Spinner';

const Feed = () => {
	const dispatch = useAppDispatch();
	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const user = useAppSelector((state) => state.auth.user);
	// lead state
	const feed = useAppSelector((state) => state.leads.feed);
	// filter state
	const filters = useAppSelector((state) => state.filters);
	// destructure necessary items
	const { page } = feed.pagination;
	const { itemLimit } = filters;

	// call getFeedLeads
	useEffect(() => {
		status === 'idle' &&
			isAuthenticated &&
			user?._id &&
			dispatch(
				getFeedLeads({ user: { id: user._id, role: user.role }, page, filters })
			);
	}, [status, isAuthenticated, user?._id, user?.role, page, filters, dispatch]);

	return status === 'idle' && user ? (
		<AuthLayout>
			<Leads
				leads={feed.pageByIds}
				allLeads={feed.totalByIds}
				pagination={feed.pagination}
				type={'feed'}
				itemLimit={itemLimit}
				headerTitle={null}
				user={user}
				status={status}
				search={false}
				currentSearchValue={null}
			/>
		</AuthLayout>
	) : (
		<div className='h-screen dark:bg-darkGray-400'>
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

export default Feed;
