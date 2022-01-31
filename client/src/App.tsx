import React from 'react';

// packages
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// redux
import { Provider } from 'react-redux';
import store from './store';
import {
	getUserData,
	removeUserData,
} from '@components/features/auth/authSlice';

// routes
import Routes from './routes/Routes';

// utils
import setAuthToken from '@utils/authTokens';

const stripeKey = `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`;
const stripePromise = loadStripe(stripeKey);

const App: React.FC = () => {
	React.useEffect(() => {
		// check for token in LS
		if (localStorage.token) {
			setAuthToken(localStorage.token);
		}
		store.dispatch(getUserData());
		// log user out from all tabs if they log out in one tab
		window.addEventListener('storage', () => {
			if (!localStorage.token) store.dispatch(removeUserData());
		});
	}, []);

	return (
		<Elements stripe={stripePromise} data-test='component-app'>
			<Provider store={store}>
				<Router>
					<Switch>
						<Routes />
					</Switch>
				</Router>
			</Provider>
		</Elements>
	);
};

export default App;
