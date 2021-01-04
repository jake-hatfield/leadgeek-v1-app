import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../redux/actions/profile';
import Spinner from '../layout/Spinner';

const Dashboard = ({
	auth: { user, loading },
	profile: { profile },
	getCurrentProfile,
}) => {
	useEffect(() => {
		if (!loading) {
			getCurrentProfile();
		}
	}, [loading, getCurrentProfile]);
	return (
		<Fragment>
			<section className='container'>
				<h1 className='large text-primary'>Dashboard</h1>
				{loading ? (
					<Spinner />
				) : (
					<div>
						<p className='lead'>
							<i className='fas fa-user'></i>
							Welcome {user && user.name}
						</p>

						<Fragment>
							<p>You have not yet set up a profile, please add some info</p>
							<Link to='/create-profile' className='btn btn-primary my-1'>
								Create profile
							</Link>
						</Fragment>
					</div>
				)}
			</section>
		</Fragment>
	);
};

Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
