import React, { Fragment } from 'react';

import { Route } from 'react-router-dom';

// routes
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Feed from '../pages/Feed';
import Liked from '../pages/Liked';
import Archived from '../pages/Archived';
import Admin from '../pages/Admin';
import Profile from '../pages/Profile';
import Password from '../pages/Password';
// utils
import PrivateRoute from './PrivateRoute';

const Routes = () => {
	return (
		<Fragment>
			<Route exact path='/login' component={Login} />
			<Route exact path='/reset/forgot-password' component={ForgotPassword} />
			<Route
				exact
				path='/reset/reset-password/:token'
				component={ResetPassword}
			/>
			<PrivateRoute exact path='/' component={Feed} />
			<PrivateRoute exact path='/leads' component={Feed} />
			<PrivateRoute exact path='/leads/liked' component={Liked} />
			<PrivateRoute exact path='/leads/archived' component={Archived} />
			<PrivateRoute exact path='/account/profile' component={Profile} />
			<PrivateRoute exact path='/account/password' component={Password} />
			<PrivateRoute exact path='/admin' component={Admin} />
		</Fragment>
	);
};

export default Routes;
