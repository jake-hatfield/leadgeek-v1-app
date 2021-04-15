import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from 'redux/actions/auth';

import Layout from 'components/layout/Layout';
import FormField from 'components/layout/formField/FormField';
import LoginImage from 'components/auth/login/LoginImage';
import { ReactComponent as LeadGeekLogo } from 'assets/images/svgs/leadgeek-logo-light.svg';

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
		return <Redirect to='/leads' />;
	}
	return (
		<Layout>
			<section className='min-h-screen relative flex justify-center bg-gray-100'>
				<div className='h-2 absolute z-10 inset-x-0 top-0 bg-purple-300' />
				<div className='xl:h-screen w-full xl:w-3/5 md:flex md:flex-col md:justify-between bg-gray-100'>
					<div className='mt-6 hidden md:block container'>
						<LeadGeekLogo className='inline-block w-16' />
					</div>
					<div className='container'>
						<div className='mt-12 md:mt-0 mx-auto py-4 lg:py-6 px-6 md:px-8 lg:px-12 w-full max-w-md bg-white rounded-md shadow-lg'>
							<header>
								<LeadGeekLogo className='md:hidden w-16' />
								<h1 className='text-2xl md:text-3xl lg:text-4xl font-black text-gray-900'>
									Log in
								</h1>
								<div className='mt-2'>
									<p className='inline-block'>Need a LeadGeek account?</p>
									<a
										href='https://leadgeek.io/signup'
										className='mt-2 md:mt-0 md:ml-2 block md:inline-block link'
									>
										Join now
									</a>
								</div>
							</header>
							<form className='my-3' onSubmit={(e) => onSubmit(e)}>
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
									<NavLink exact to={'/reset/forgot-password'}>
										Forgot password?
									</NavLink>
								</div>
							</form>
						</div>
					</div>
					<div className='mt-6 xl:mt-0 mb-6 container'>
						&copy; 2020 - {new Date().getFullYear()} LeadGeek, Inc. All rights
						reserved.
					</div>
				</div>
				<LoginImage />
			</section>
		</Layout>
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
