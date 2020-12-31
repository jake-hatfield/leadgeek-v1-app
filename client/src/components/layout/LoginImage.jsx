import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ReactComponent as LeadGeekLogo } from '../../assets/images/svgs/leadgeek-logo-light.svg';

const LoginImage = ({ auth: { isAuthenticated } }) => {
	return (
		<Fragment>
			{!isAuthenticated && (
				<aside className='py-12 hidden xl:block h-screen xl:w-2/5 bg-gray-800'>
					<header className='container'>
						<LeadGeekLogo className='w-16' />
						<h2 className='max-w-md text-4xl text-gray-400 font-black'>
							Find the best products to flip on Amazon.
						</h2>
					</header>
				</aside>
			)}
		</Fragment>
	);
};

LoginImage.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(LoginImage);
