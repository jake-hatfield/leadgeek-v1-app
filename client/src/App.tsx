import React, { Fragment, useEffect } from 'react';

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
// import useDarkMode from './hooks/useDarkMode';

const App: React.FC = () => {
	useEffect(() => {
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

	// const [colorTheme, setColorTheme] = useDarkMode();

	// console.log(colorTheme);

	const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY!);

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
