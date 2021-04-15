import React, { Fragment } from 'react';

import PropTypes from 'prop-types';

import Alert from '../layout/Alert';

const Layout = ({ children }) => {
	return (
		<Fragment>
			<Alert />
			<main className='relative flex flex-col h-screen'>{children}</main>
		</Fragment>
	);
};

Layout.propTypes = {
	children: PropTypes.object.isRequired,
};

export default Layout;
