import React, { Fragment } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeAlert } from 'redux/actions/alert';

import Alert from './utils/Alert';

const DefaultLayout = ({ children, removeAlert }) => {
	return (
		<Fragment>
			<Alert removeAlert={removeAlert} />
			<main className='relative flex flex-col h-screen'>{children}</main>
		</Fragment>
	);
};

DefaultLayout.propTypes = {
	children: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
	const { children } = ownProps;
	return { children };
};

export default connect(mapStateToProps, { removeAlert })(DefaultLayout);
