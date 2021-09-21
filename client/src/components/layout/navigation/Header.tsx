import React, { useState } from 'react';

// packages
import { Redirect, useLocation } from 'react-router-dom';

// redux
import { useAppDispatch, useAppSelector } from '@utils/hooks';
import { removeAlert, setAlert } from '@features/alert/alertSlice';
import {
	setLeadLoading,
	setSearchValue,
} from '@components/features/leads/leadsSlice';

import SearchBar from '@components/layout/navigation/SearchBar';

interface HeaderProps {
	userId: string;
	title: string | null;
	searchActive: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, searchActive }) => {
	const dispatch = useAppDispatch();
	const location = useLocation();

	// leads state
	const currentSearchValue = useAppSelector(
		(state) => state.leads.search.searchValue
	);

	// local state
	const [redirectToSearch, setRedirectToSearch] = useState(false);
	const [query, setQuery] = useState('');

	// search helpers
	const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
	};

	// handle search submit
	const handleSearchSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (query) {
			if (location.pathname !== '/search') {
				setRedirectToSearch(true);
			}

			if (query === currentSearchValue) {
				return dispatch(
					setAlert({
						title: 'Already showing results',
						message: 'Results for this query are already showing.',
						alertType: 'danger',
					})
				);
			}
			dispatch(removeAlert());
			dispatch(setLeadLoading());
			return dispatch(setSearchValue(query));
		} else {
			dispatch(
				setAlert({
					title: 'No value was entered',
					message: 'Please enter a search value and try again.',
					alertType: 'danger',
				})
			);
		}
	};

	if (redirectToSearch) {
		return <Redirect to={{ pathname: '/search' }} />;
	}

	return (
		<header className='pt-4'>
			<div className='flex items-end justify-between container'>
				<div className='flex items-center'>
					<h1 className='text-3xl text-gray-900 dark:text-white font-bold'>
						{title || 'Leads'}
					</h1>
				</div>
				{searchActive && (
					<SearchBar
						placeholder={'Search by title, source, brand, or ASIN'}
						onSearchChange={onSearchChange}
						handleSearchSubmit={handleSearchSubmit}
					/>
				)}
			</div>
		</header>
	);
};

export default Header;
