import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './redux/actions/auth';
import setAuthToken from './utils/authTokens';
// stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// components
import Navbar from './components/layout/Navbar';
import Login from './components/auth/login/Login';
import ForgotPassword from './components/auth/login/reset/ForgotPassword';
import ResetPasswordPage from './components/auth/login/reset/ResetPasswordPage';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import Leads from './components/leads/Leads';
import Profile from './components/account/Profile';
import Password from './components/account/Password';
import Billing from './components/account/Billing';
// utils
import PrivateRoute from './components/routing/PrivateRoute';
import Alert from './components/layout/Alert';
import { LOGOUT } from './redux/actions/types';
// styles & fonts
import './assets/tailwind.css';
import 'fontsource-inter';

const App = () => {
	useEffect(() => {
		// check for token in LS
		if (localStorage.token) {
			setAuthToken(localStorage.token);
		}
		store.dispatch(loadUser());

		// log user out from all tabs if they log out in one tab
		window.addEventListener('storage', () => {
			if (!localStorage.token) store.dispatch({ type: LOGOUT });
		});
	}, []);

	const stripePromise = loadStripe(
		'pk_test_51HF2gpDdWoP4Ck9RZqPhljVm5WMH4cwsMNSeMuevI8lWugnJQryfuvzx6aExHTTVBGU8woKxosaCzH4VXsKAgfsQ00Y7QBWKlc'
	);

	return (
		<Elements stripe={stripePromise}>
			<Provider store={store}>
				<Router>
					<Fragment>
						<Navbar />
						<Alert />
						<Switch>
							<Route exact path='/login' component={Login} />
							<Route
								exact
								path='/reset/forgot-password'
								component={ForgotPassword}
							/>
							<Route
								exact
								path='/reset/reset-password/:token'
								component={ResetPasswordPage}
							/>
							<PrivateRoute exact path='/' component={Leads} />
							<PrivateRoute exact path='/account/profile' component={Profile} />
							<PrivateRoute
								exact
								path='/account/password'
								component={Password}
							/>
							<PrivateRoute exact path='/account/billing' component={Billing} />
							<PrivateRoute
								exact
								path='/create-profile'
								component={CreateProfile}
							/>
							<PrivateRoute
								exact
								path='/edit-profile'
								component={EditProfile}
							/>
						</Switch>
					</Fragment>
				</Router>
			</Provider>
		</Elements>
	);
};

export default App;
