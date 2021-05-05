import React, { Fragment } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeAlert } from 'redux/actions/alert';

import Alert from '../layout/Alert';

const Layout = ({ children, removeAlert }) => {
	return (
		<Fragment>
			<Alert removeAlert={removeAlert} />
			<main className='relative flex flex-col h-screen'>{children}</main>
		</Fragment>
	);
};

Layout.propTypes = {
	children: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
	const { children } = ownProps;
	return { children };
};

export default connect(mapStateToProps, { removeAlert })(Layout);
