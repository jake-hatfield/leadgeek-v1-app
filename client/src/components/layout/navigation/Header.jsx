import React, { useState } from 'react';

import { connect } from 'react-redux';
import { getSearchResults } from '../../../redux/actions/leads';
import { useLocation } from 'react-router-dom';

import { Redirect } from 'react-router';

const Header = ({ title, getSearchResults }) => {
	// search helpers
	const [search, setSearch] = useState('');
	const onSearchChange = (e) => {
		setSearch(e.target.value);
	};

	const location = useLocation();
	const [redirect, setRedirect] = useState(false);
	const handleSearchSubmit = async (e) => {
		e.preventDefault();
		if (location.pathname !== '/search') {
			setRedirect(true);
		}
		getSearchResults(search);
	};

	if (redirect) {
		return <Redirect to={{ pathname: '/search', search: `?q=${search}` }} />;
	}

	return (
		<header className='border-b border-gray-200'>
			<div className='flex justify-between pb-2 container'>
				<div className='flex items-center'>
					<h1 className='text-3xl text-gray-900 font-bold'>
						{title || 'Leads'}
					</h1>
				</div>
				<div className='ml-32 w-full flex items-center justify-end text-gray-300'>
					<div className='w-64 relative z-0 text-gray-400'>
						<form
							action='/search'
							method='GET'
							onSubmit={(e) => handleSearchSubmit(e)}
						>
							<input
								type='text'
								name='q'
								placeholder='Search by title, brand, or ASIN...'
								onChange={onSearchChange}
								className='py-2 pl-10 w-full rounded-lg text-sm text-gray-500 placeholder-gray-400 transition-all duration-100 ease-in-out focus:outline-none hover:shadow-outline focus:shadow-outline'
							/>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='mt-2 ml-3 absolute top-0 left-0 h-4 w-4'
							>
								<path
									fillRule='evenodd'
									d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
									clipRule='evenodd'
								/>
							</svg>
						</form>
					</div>
				</div>
			</div>
		</header>
	);
};

const mapStateToProps = (state, ownProps) => {
	const { loading, exporting } = state.leads;
	const { title } = ownProps;
	return { loading, exporting, title };
};

export default connect(mapStateToProps, { getSearchResults })(Header);
