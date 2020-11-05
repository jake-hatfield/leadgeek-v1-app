import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import EditProfile from './components/profile-forms/EditProfile';
import Leads from './components/leads/Leads';

// utils
import PrivateRoute from './components/routing/PrivateRoute';
import Alert from './components/layout/Alert';
import { LOGOUT } from './redux/actions/types';

// redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './redux/actions/auth';
import setAuthToken from './utils/setAuthToken';

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

	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<Navbar />
					<Alert />
					<Switch>
						<Route exact path='/login' component={Login} />
						<PrivateRoute exact path='/' component={Dashboard} />
						<PrivateRoute exact path='/leads' component={Leads} />
						<PrivateRoute
							exact
							path='/create-profile'
							component={CreateProfile}
						/>
						<PrivateRoute exact path='/edit-profile' component={EditProfile} />
						<PrivateRoute
							exact
							path='/add-experience'
							component={AddExperience}
						/>
						<PrivateRoute
							exact
							path='/add-education'
							component={AddEducation}
						/>
					</Switch>
				</Fragment>
			</Router>
		</Provider>
	);
};

export default App;
