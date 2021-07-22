import React, { Fragment } from 'react';

import { Route } from 'react-router-dom';

// routes
import Register from 'pages/Register';
import Login from 'pages/Login';
import ForgotPassword from 'pages/ForgotPassword';
import ResetPassword from 'pages/ResetPassword';
import Feed from 'pages/Feed';
import Liked from 'pages/Liked';
import Archived from 'pages/Archived';
import Search from 'pages/Search';
import Admin from 'pages/Admin';
import Help from 'pages/Help';
import Profile from 'pages/settings/Profile';
import Security from 'pages/settings/Security';
import Billing from 'pages/settings/Billing';
import Affiliates from 'pages/settings/Affiliates';
// utils
import PrivateRoute from './PrivateRoute';

const Routes = () => {
	return (
		<Fragment>
			<Route exact path='/register' component={Register} />
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
			<PrivateRoute exact path='/search' component={Search} />
			<PrivateRoute exact path='/settings/profile' component={Profile} />
			<PrivateRoute exact path='/settings/security' component={Security} />
			<PrivateRoute exact path='/settings/billing' component={Billing} />
			<PrivateRoute exact path='/settings/affiliates' component={Affiliates} />
			<PrivateRoute exact path='/admin' component={Admin} />
			<PrivateRoute exact path='/help' component={Help} />
		</Fragment>
	);
};

export default Routes;
