import React, { Fragment } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts, removeAlert }) => {
	return (
		<Fragment>
			{alerts !== null &&
				alerts.length > 0 &&
				alerts.map((alert) => (
					<div
						key={alert.id}
						className={`py-4 pl-16 fixed top-0 z-40 flex items-center justify-between w-full font-semibold text-sm lg:text-base border-b-4 alert-${alert.alertType}`}
					>
						<div className='flex items-center justify-between container'>
							<p>{alert.msg}</p>
							<button
								onClick={() => removeAlert(alert.id)}
								className={`alert-${alert.alertType}-button rounded-md`}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path
										fillRule='evenodd'
										d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
										clipRule='evenodd'
									/>
								</svg>
							</button>
						</div>
					</div>
				))}
		</Fragment>
	);
};

Alert.propTypes = {
	alerts: PropTypes.array.isRequired,
	removeAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	alerts: state.alert,
});
export default connect(mapStateToProps)(Alert);
