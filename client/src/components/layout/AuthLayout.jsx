import React, { Fragment } from 'react';

import Alert from '../layout/Alert';
import Navbar from './navigation/Navbar';

const AuthLayout = ({ children }) => {
	return (
		<Fragment>
			<Alert />
			<Navbar />
			<main className='relative flex flex-col h-screen'>{children}</main>
		</Fragment>
	);
};

export default AuthLayout;
