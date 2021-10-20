import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAppSelector } from '@hooks/hooks';

interface PrivateRouteProps {
	component: React.FunctionComponent<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
	component: Component,
	...rest
}) => {
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const status = useAppSelector((state) => state.auth.status);

	return (
		<Route
			{...rest}
			render={(props) =>
				!isAuthenticated && status === 'idle' ? (
					<Redirect to='/login/' />
				) : (
					<Component {...props} />
				)
			}
		/>
	);
};

export default PrivateRoute;
