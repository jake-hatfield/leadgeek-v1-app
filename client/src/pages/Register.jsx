import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from 'redux/actions/auth';

import Layout from 'components/layout/Layout';
import RegistrationForm from 'components/auth/login/RegistrationForm';
import { ReactComponent as LeadGeekLogo } from 'assets/images/svgs/leadgeek-logo-light.svg';

const Register = ({ login, isAuthenticated }) => {
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
				<div className='flex flex-col justify-between xl:h-screen w-full bg-gray-100'>
					<div className='mt-6 hidden md:block container'>
						<LeadGeekLogo className='inline-block w-16' />
					</div>
					<div className='container'>
						<div className='mt-12 md:mt-0 mx-auto py-4 lg:py-6 px-6 md:px-8 lg:px-12 w-full max-w-md bg-white rounded-md shadow-lg'>
							<header className='pb-2 border-b border-gray-200'>
								<LeadGeekLogo className='md:hidden w-16' />
								<h1 className='text-2xl md:text-3xl lg:text-4xl font-black text-gray-900'>
									Join the beta
								</h1>
							</header>
							<RegistrationForm />
						</div>
					</div>
					<div className='mt-6 xl:mt-0 mb-6 container'>
						&copy; 2020 - {new Date().getFullYear()} LeadGeek, Inc. All rights
						reserved.
					</div>
				</div>
			</section>
		</Layout>
	);
};

Register.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Register);
