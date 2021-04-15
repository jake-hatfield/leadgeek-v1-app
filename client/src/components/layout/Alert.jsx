import React, { Fragment } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => {
	return (
		<Fragment>
			{alerts !== null &&
				alerts.length > 0 &&
				alerts.map((alert) => (
					<div
						key={alert.id}
						className={`py-2 px-4 xl:py-4 xl:px-6 absolute top-0 z-40 w-full text-sm xl:text-base border-b-4 alert-${alert.alertType}`}
					>
						{alert.msg}
					</div>
				))}
		</Fragment>
	);
};

Alert.propTypes = {
	alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
	alerts: state.alert,
});
export default connect(mapStateToProps)(Alert);
