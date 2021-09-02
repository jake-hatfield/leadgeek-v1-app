import React, { useState } from 'react';

import { Redirect, useLocation } from 'react-router-dom';

import { useAppDispatch } from '@utils/hooks';
import { getSearchResults } from '@features/leads/leadsSlice';
import { setAlert } from '@features/alert/alertSlice';

import SearchBar from '@components/layout/navigation/SearchBar';

interface HeaderProps {
	title: string | null;
	role: string;
	dateCreated: string;
	searchActive: boolean;
}

const Header: React.FC<HeaderProps> = ({
	title,
	role,
	dateCreated,
	searchActive,
}) => {
	const dispatch = useAppDispatch();
	const location = useLocation();

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
			return dispatch(
				getSearchResults({
					query,
					role,
					dateCreated,
					page: 1,
					newSearch: true,
					itemLimit: 15,
				})
			);
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
		<header className='border-b border-gray-200'>
			<div className='flex justify-between pb-2 container'>
				<div className='flex items-center'>
					<h1 className='text-3xl text-gray-900 font-bold'>
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
