import React, { Fragment, useState } from 'react';

import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from 'redux/actions/alert';
import { register } from 'redux/actions/auth';

import FormField from 'components/layout/formField/FormField';
import ResetPassword from './password/ResetPassword';

const RegistrationForm = ({ setAlert, register, isAuthenticated }) => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password2: '',
	});

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });
	const onSubmit = async (e) => {
		e.preventDefault();
		if (password !== password2) {
			setAlert("Passwords don't match", 'danger');
			return;
		} else {
			register({
				name,
				email,
				password,
			});
		}
	};

	const { name, email, password, password2 } = formData;

	if (isAuthenticated) {
		return <Redirect to='/' />;
	}
	return (
		<Fragment>
			<form className='form' onSubmit={(e) => onSubmit(e)}>
				<div className='form-group'>
					<FormField
						label='Name'
						type='text'
						placeholder='Dave Saunders'
						name='name'
						value={name}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className='form-group'>
					<FormField
						label='Email'
						type='email'
						placeholder='dsaunders@gmail.com'
						name='email'
						value={email}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<ResetPassword email={email} />
				<input type='submit' className='btn btn-primary' value='Register' />
			</form>
			<p className='my-1'>
				Already have an account? <Link to='/login'>Sign In</Link>
			</p>
		</Fragment>
	);
};

RegistrationForm.propTypes = {
	setAlert: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	register: state.auth.register,
	setAlert: state.alert,
});

export default connect(mapStateToProps, { setAlert, register })(
	RegistrationForm
);
