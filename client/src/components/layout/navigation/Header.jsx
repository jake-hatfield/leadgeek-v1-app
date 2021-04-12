import React, { useState } from 'react';

import { connect } from 'react-redux';
import { getSearchResults } from '../../../redux/actions/leads';
import { useLocation } from 'react-router-dom';

import { Redirect } from 'react-router';

const Header = ({
	user: { _id, role },
	search: { page },
	title,
	searchActive,
	getSearchResults,
}) => {
	// search helpers
	const [searchValue, setSearchValue] = useState('');
	const onSearchChange = (e) => {
		setSearchValue(e.target.value);
	};

	const location = useLocation();
	const [redirect, setRedirect] = useState(false);
	const handleSearchSubmit = async (e) => {
		e.preventDefault();
		if (location.pathname !== '/search') {
			setRedirect(true);
		}
		getSearchResults(searchValue, _id, role, page);
	};

	if (redirect) {
		return (
			<Redirect to={{ pathname: '/search', search: `?q=${searchValue}` }} />
		);
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
					<div className='flex items-center justify-end text-gray-300'>
						<div className='w-72 relative z-0 text-gray-400'>
							<form
								action='/search'
								method='GET'
								onSubmit={(e) => handleSearchSubmit(e)}
							>
								<input
									type='text'
									name='q'
									placeholder='Search by title, source, brand, or ASIN...'
									onChange={onSearchChange}
									className='py-2 pl-10 w-full rounded-lg border-none text-sm text-gray-500 placeholder-gray-400 transition duration-100 ease-in-out focus:outline-none hover:shadow-outline focus:shadow-outline'
								/>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='mt-2 ml-4 absolute top-0 left-0 h-4 w-4'
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
				)}
			</div>
		</header>
	);
};

const mapStateToProps = (state, ownProps) => {
	const { user } = state.auth;
	const { search } = state.leads;
	const { title } = ownProps;
	return { user, search, title };
};

export default connect(mapStateToProps, { getSearchResults })(Header);
