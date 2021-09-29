import React, { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '@hooks/hooks';
import { getArchivedLeads } from '@features/leads/leadsSlice';

import AuthLayout from '@components/layout/AuthLayout';
import Leads from '@components/features/leads/Leads';
import Spinner from '@components/utils/Spinner';

const Archived = () => {
	const dispatch = useAppDispatch();
	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const user = useAppSelector((state) => state.auth.user);
	// lead state
	const archived = useAppSelector((state) => state.leads.archived);
	const filters = useAppSelector((state) => state.filters);
	// destructure necessary items
	const { page } = archived.pagination;

	useEffect(() => {
		status === 'idle' &&
			isAuthenticated &&
			user &&
			dispatch(getArchivedLeads({ leads: user.archivedLeads, page, filters }));
	}, [status, isAuthenticated, user, page, filters, dispatch]);

	return status === 'idle' && user ? (
		<AuthLayout>
			<Leads
				leads={archived.pageByIds}
				allLeads={archived.totalByIds}
				pagination={archived.pagination}
				type={'archived'}
				itemLimit={filters.itemLimit}
				headerTitle={null}
				user={user}
				status={status}
				search={false}
				currentSearchValue={null}
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

export default Archived;
