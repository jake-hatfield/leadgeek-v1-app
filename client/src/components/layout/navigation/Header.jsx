import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Redirect, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSearchResults } from '@redux/actions/leads';
import { setAlert } from '@redux/actions/alert';

import SearchBar from '@components/layout/navigation/SearchBar';

const Header = ({
	role,
	dateCreated,
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
			return getSearchResults(searchValue, role, dateCreated, 1, true);
		} else {
			setAlert(
				'No value was entered',
				'Please enter a search value and try again.',
				'danger'
			);
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
					<SearchBar
						onSearchChange={onSearchChange}
						handleSearchSubmit={handleSearchSubmit}
						placeholder={'Search by title, source, brand, or ASIN'}
					/>
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
