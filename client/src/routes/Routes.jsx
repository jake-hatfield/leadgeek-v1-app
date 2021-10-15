import React, { Fragment } from 'react';

// packages
import { Route } from 'react-router-dom';

// components
import Login from '@pages/Login';
import ForgotPassword from '@pages/ForgotPassword';
import ResetPassword from '@pages/ResetPassword';
import Feed from '@pages/Feed';
import Liked from '@pages/Liked';
import Archived from '@pages/Archived';
import Search from '@pages/Search';
import Admin from '@pages/Admin';
import Account from '@pages/settings/Account';
import Arbitrage from '@pages/settings/Arbitrage';
import Affiliates from '@pages/settings/Affiliates';
import Billing from '@pages/settings/Billing';

// utils
import PrivateRoute from './PrivateRoute';

const Routes = () => {
	return (
		<Fragment>
			<Route exact path='/login/' component={Login} />
			<Route exact path='/reset/forgot-password/' component={ForgotPassword} />
			<Route exact path='/reset/reset-password/' component={ResetPassword} />
			<PrivateRoute exact path='/' component={Feed} />
			<PrivateRoute exact path='/liked/' component={Liked} />
			<PrivateRoute exact path='/archived/' component={Archived} />
			<PrivateRoute exact path='/search/' component={Search} />
			<PrivateRoute exact path='/settings/account/' component={Account} />
			<PrivateRoute exact path='/settings/arbitrage/' component={Arbitrage} />
			<PrivateRoute exact path='/settings/affiliates/' component={Affiliates} />
			<PrivateRoute exact path='/settings/billing/' component={Billing} />
			<PrivateRoute exact path='/admin/' component={Admin} />
		</Fragment>
	);
};

export default Routes;
