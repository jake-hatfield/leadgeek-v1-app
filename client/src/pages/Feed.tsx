import React, { useEffect } from 'react';

import { getFeedLeads } from '@features/leads/leadsSlice';

import AuthLayout from '@components/layout/AuthLayout';
import Leads from '@components/leads/Leads';
// import Spinner from '@components/layout/utils/Spinner';
import { useAppDispatch, useAppSelector } from '@utils/hooks';

const Feed = () => {
	const dispatch = useAppDispatch();
	// auth props
	const status = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const user = useAppSelector((state) => state.auth.user);
	// lead props
	const feed = useAppSelector((state) => state.leads.feed);
	const filters = useAppSelector((state) => state.filters);
	// destructure necessary items
	const { page } = feed.pagination;
	const {
		itemLimits: { leadsLimit: itemLimit },
	} = filters;

	// call getFeedLeads
	useEffect(() => {
		status === 'idle' &&
			isAuthenticated &&
			user &&
			dispatch(getFeedLeads({ user, page, filters }));
	}, [status, isAuthenticated, user, page, filters, dispatch]);

	return status === 'idle' ? (
		<AuthLayout>
			<Leads
				leads={feed.pageByIds}
				pagination={feed.pagination}
				type={'feed'}
				itemLimit={itemLimit}
				user={user}
				status={status}
			/>
		</AuthLayout>
	) : (
		<div>Hello</div>
		// <Spinner text={'Loading...'} />
	);
};

export default Feed;
