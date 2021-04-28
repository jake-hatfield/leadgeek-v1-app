import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Redirect, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSearchResults } from 'redux/actions/leads';
import { setAlert } from 'redux/actions/alert';

const Header = ({
	role,
	dateCreated,
	page,
	title,
	searchActive,
	getSearchResults,
	setAlert,
}) => {
	// search helpers
	const [searchValue, setSearchValue] = useState('');
	const onSearchChange = (e) => {
		setSearchValue(e.target.value);
	};
	const [redirect, setRedirect] = useState(false);
	const location = useLocation();
	const handleSearchSubmit = async (e) => {
		e.preventDefault();

		if (searchValue) {
			if (location.pathname !== '/search') {
				setRedirect(true);
			}
			return getSearchResults(searchValue, role, dateCreated, page);
		} else {
			setAlert('Please enter a search value', 'danger');
		}
	};

	if (redirect) {
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
									className='py-2 pl-10 w-full rounded-lg border-none text-sm text-gray-500 placeholder-gray-400 transition duration-100 ease-in-out ring-purple'
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

Header.propTypes = {
	_id: PropTypes.string.isRequired,
	role: PropTypes.string.isRequired,
	page: PropTypes.number,
	title: PropTypes.string,
	searchActive: PropTypes.bool,
	getSearchResults: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
	const { _id, role, dateCreated, page, currentSearchParam, title } = ownProps;
	return { _id, role, dateCreated, page, currentSearchParam, title };
};

export default connect(mapStateToProps, { getSearchResults, setAlert })(Header);
