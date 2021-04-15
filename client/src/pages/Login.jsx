import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from 'redux/actions/auth';

import Layout from 'components/layout/Layout';
import FormField from 'components/layout/formField/FormField';
import LoginImage from 'components/auth/login/LoginImage';
import UnAuthFooter from 'components/layout/navigation/UnAuthFooter';
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
								<h1 className='pb-2 text-xl md:text-2xl lg:text-3xl font-black text-gray-900 border-b border-gray-200'>
									Log in
								</h1>
								<div className='mt-2'>
									<p className='inline-block'>Need a LeadGeek account?</p>
									<Link
										to={'/register'}
										className='mt-2 md:mt-0 md:ml-2 block md:inline-block link'
									>
										Join now
									</Link>
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
									className='mt-4 py-2 w-full rounded-md font-semibold text-white bg-purple-500 hover:bg-purple-600 shadow-sm hover:shadow-md transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline'
								>
									Log in
								</button>
								<div className='mt-4 text-sm text-gray-400'>
									<Link to={'/reset/forgot-password'} className='link'>
										Forgot password?
									</Link>
								</div>
							</form>
						</div>
					</div>
					<UnAuthFooter />
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
