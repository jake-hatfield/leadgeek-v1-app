import React, { useEffect } from 'react';

// redux
import { useAppDispatch, useAppSelector } from '@utils/hooks';
import { getSearchResults } from '@features/leads/leadsSlice';

// components
import AuthLayout from '@components/layout/AuthLayout';
import Leads from '@components/features/leads/Leads';
import Spinner from '@components/layout/utils/Spinner';

const Search = () => {
	const dispatch = useAppDispatch();
	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const user = useAppSelector((state) => state.auth.user);
	// search state
	const search = useAppSelector((state) => state.leads.search);
	// filters state
	const itemLimit = useAppSelector(
		(state) => state.filters.itemLimits.searchLimit
	);
	// destructure necessary items
	const { page } = search.pagination;
	const { searchValue } = search;

	// call getSearchResults
	useEffect(() => {
		status === 'idle' &&
			isAuthenticated &&
			user &&
			searchValue &&
			dispatch(
				getSearchResults({
					query: searchValue,
					role: user.role,
					dateCreated: user.dateCreated,
					page,
					newSearch: false,
					itemLimit,
				})
			);
	}, [status, isAuthenticated, user, searchValue, itemLimit, page, dispatch]);

	return status === 'idle' && user ? (
		<AuthLayout>
			<Leads
				leads={search.pageByIds}
				pagination={search.pagination}
				type={'search'}
				itemLimit={itemLimit}
				user={user}
				status={status}
				headerTitle={'Search results'}
				search={true}
				currentSearchParam={searchValue}
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
