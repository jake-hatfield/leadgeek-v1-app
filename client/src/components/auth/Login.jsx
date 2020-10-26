import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import LoginImage from '../layout/LoginImage';
import { ReactComponent as LeadGeekLogo } from '../../assets/images/svgs/leadgeek-logo-light.svg';
import FormField from './formField/FormField';

const Login = ({ login, isAuthenticated }) => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const { email, password } = formData;
	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });
	const onSubmit = (e) => {
		e.preventDefault();
		login(email, password);
	};

	if (isAuthenticated) {
		return <Redirect to='/dashboard' />;
	}
	return (
		<Fragment>
			<section className='py-12 md:py-0 lg:w-2/5 relative container flex items-center justify-center'>
				<div className='lg:hidden h-2 absolute inset-x-0 top-0 bg-purple-300' />
				<div>
					<header>
						<LeadGeekLogo className='lg:hidden w-16' />
						<h1 className='text-5xl font-black text-gray-900'>Log in</h1>
						<p className='inline-block'>Need a LeadGeek account?</p>
						<a href='https://leadgeek.io/signup' className='ml-2 link'>
							Join now
						</a>
					</header>
					<form className='my-3 max-w-xs' onSubmit={(e) => onSubmit(e)}>
						<FormField
							label='Email'
							type='email'
							placeholder='peterparker@gmail.com'
							name='email'
							value={email}
							onChange={onChange}
							required
						/>
						<FormField
							label='Password'
							type='password'
							placeholder='Password'
							name='password'
							value={password}
							onChange={onChange}
							minLength='6'
						/>
						<button
							type='submit'
							className='bg-purple-600 mt-4 py-2 w-full rounded-md text-white shadow-md hover:bg-purple-500 transition-colors duration-200 focus:outline-none focus:shadow-outline'
						>
							Log in
						</button>
						<div className='mt-4 text-sm text-gray-400 link'>
							<span>Forgot password?</span>
						</div>
					</form>
				</div>
			</section>
			<LoginImage />
		</Fragment>
	);
};

Login.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
