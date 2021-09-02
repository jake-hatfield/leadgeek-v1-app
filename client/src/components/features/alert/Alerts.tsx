import React, { Fragment } from 'react';

import { useAppSelector } from '@utils/hooks';

import Alert from '@features/alert/Alert';

const Alerts = () => {
	const alerts = useAppSelector((state) => state.alert);

	return (
		<Fragment>
			{alerts.length > 0 &&
				alerts.map((alert, i) => (
					<Alert
						key={i}
						id={alert.id}
						title={alert.title}
						message={alert.message}
						alertType={alert.alertType}
					/>
				))}
		</Fragment>
	);
};

export default Alerts;
