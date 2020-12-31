import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../redux/actions/auth';
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
		return <Redirect to='/' />;
	}
	return (
		<Fragment>
			<section className='h-screen relative flex justify-center bg-gray-100'>
				<div className='lg:hidden h-2 absolute inset-x-0 top-0 bg-purple-300' />
				<div className='xl:h-screen w-full xl:w-3/5 lg:flex lg:flex-col justify-between bg-gray-100'>
					<div className='mt-32 lg:mt-48 mx-4 md:mx-auto pt-2 pb-3 lg:pt-3 lg:pb-2 px-6 md:px-8 lg:px-12 max-w-sm bg-white rounded-md shadow-lg'>
						<header>
							<LeadGeekLogo className='lg:hidden w-16' />
							<h1 className='text-5xl font-black text-gray-900'>Log in</h1>
							<p className='inline-block'>Need a LeadGeek account?</p>
							<a
								href='https://leadgeek.io/signup'
								className='mt-2 md:mt-0 md:ml-2 block md:inline-block link'
							>
								Join now
							</a>
						</header>
						<form className='my-3 max-w-xs' onSubmit={(e) => onSubmit(e)}>
							<FormField
								label='Email'
								type='email'
								placeholder='dsaunders@gmail.com'
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
					<div className='mt-6 xl:mt-0 mb-6 container'>
						&copy; {new Date().getFullYear()} LeadGeek, Inc. All rights reserved
					</div>
				</div>
				<LoginImage />
			</section>
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
