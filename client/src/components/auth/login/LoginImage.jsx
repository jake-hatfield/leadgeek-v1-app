import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const LoginImage = ({ auth: { isAuthenticated } }) => {
	return (
		<Fragment>
			{!isAuthenticated && (
				<aside
					style={{
						backgroundImage: `url(${
							process.env.PUBLIC_URL + '/img/login-image.png'
						})`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'cover',
						position: 'relative',
					}}
					className='py-12 hidden xl:block h-screen xl:w-3/5'
				>
					<header className='absolute top-0 left-0 h-screen container bg-gray-800 opacity-75 text-gray-200'>
						<h2 className='mt-16 text-4xl font-black'>
							LeadGeek beta now open.
						</h2>
						<h3 className='mt-4 text-xl font-semibold'>
							Test out our new software with features that help you source leads
							better than ever.
						</h3>
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
