import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) =>
	alerts !== null &&
	alerts.length > 0 &&
	alerts.map((alert) => (
		<div
			key={alert.id}
			className={`py-4 px-6 absolute top-0 z-10 w-full border-b-4 alert-${alert.alertType}`}
		>
			{alert.msg}
		</div>
	));

Alert.propTypes = {
	alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
	alerts: state.alert,
});
export default connect(mapStateToProps)(Alert);
