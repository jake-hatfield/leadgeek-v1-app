import React, { useState } from 'react';

// packages
import { Redirect, useLocation } from 'react-router-dom';

// redux
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { removeAlert, setAlert } from '@features/alert/alertSlice';
import {
	setLeadLoading,
	setSearchValue,
} from '@components/features/leads/leadsSlice';

interface SearchBarProps {
	placeholder: string | null;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
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
	const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!query) {
			return dispatch(
				setAlert({
					title: 'No value was entered',
					message: 'Please enter a search value and try again.',
					alertType: 'danger',
				})
			);
		}

		if (location.pathname !== '/search/') {
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
	};

	if (redirectToSearch) {
		return <Redirect to={{ pathname: '/search/' }} />;
	}

	return (
		<div className='flex items-center justify-end'>
			<div className='w-72 relative z-0'>
				<form
					action='/search/'
					method='POST'
					onSubmit={(e) => handleSearchSubmit(e)}
				>
					<input
						type='text'
						name='q'
						placeholder={placeholder || 'Enter a search...'}
						onChange={(e) => onSearchChange(e)}
						value={query}
						className='py-2 pl-10 w-full rounded-main border border-300 input text-sm placeholder-gray-700 text-300 ring-purple'
					/>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='mt-2.5 ml-4 absolute top-0 left-0 svg-sm text-gray-700'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
						/>
					</svg>
				</form>
			</div>
		</div>
	);
};

export default SearchBar;
