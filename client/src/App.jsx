import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
// redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './redux/actions/auth';
import setAuthToken from './utils/authTokens';
// stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// routes
import Routes from './routes/Routes';
import { LOGOUT } from './redux/actions/types';

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

	const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

	return (
		<Elements stripe={stripePromise}>
			<Provider store={store}>
				<Router>
					<Fragment>
						<Switch>
							<Routes />
						</Switch>
					</Fragment>
				</Router>
			</Provider>
		</Elements>
	);
};

export default App;
