import React, { useEffect } from 'react';

// redux
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import {
	getSearchResults,
	setLeadIdle,
} from '@components/features/leads/leadsSlice';

// components
import AuthLayout from '@components/layout/AuthLayout';
import Leads from '@components/features/leads/Leads';
import Spinner from '@components/utils/Spinner';

const Search = () => {
	const dispatch = useAppDispatch();
	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const user = useAppSelector((state) => state.auth.user);
	// lead state
	const search = useAppSelector((state) => state.leads.search);
	// filters state
	const filters = useAppSelector((state) => state.filters);

	// destructure necessary items
	const {
		pagination: { page },
		searchValue,
		newSearch,
	} = search;

	// set lead status to idle on load (empty search result)
	useEffect(() => {
		if (status === 'idle' && user?._id && searchValue) {
			dispatch(
				getSearchResults({
					userId: user._id,
					query: searchValue,
					page: newSearch ? 1 : page,
					filters,
				})
			);
		} else {
			status === 'idle' && dispatch(setLeadIdle());
		}
	}, [status, user?._id, searchValue, page, filters, dispatch]);

	return status === 'idle' && user ? (
		<AuthLayout>
			<Leads
				leads={search.pageByIds}
				allLeads={search.totalByIds}
				pagination={search.pagination}
				type={'search'}
				itemLimit={filters.itemLimit}
				user={user}
				status={status}
				headerTitle={'Search results'}
				search={true}
				currentSearchValue={searchValue}
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

export default Search;
