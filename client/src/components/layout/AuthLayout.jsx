import React, { Fragment } from 'react';

import Alert from '../layout/Alert';
import Navbar from './navigation/Navbar';

const AuthLayout = ({ children }) => {
	return (
		<Fragment>
			<Alert />
			<div className='relative flex h-screen'>
				<Navbar />
				<main className='w-full'>{children}</main>
			</div>
		</Fragment>
	);
};

export default AuthLayout;
