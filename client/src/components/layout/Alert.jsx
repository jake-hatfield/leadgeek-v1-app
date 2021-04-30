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
						className={`py-4 pl-16 fixed top-0 z-40 w-full font-semibold text-sm lg:text-base border-b-4 alert-${alert.alertType}`}
					>
						<p className='container'>{alert.msg}</p>
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
