import React, { Fragment } from 'react';

import Alert from '../layout/Alert';

const Layout = ({ children }) => {
	return (
		<Fragment>
			<Alert />
			<main className='relative flex flex-col h-screen'>{children}</main>
		</Fragment>
	);
};

export default Layout;
