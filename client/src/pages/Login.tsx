import React, { useState } from 'react';

// packages
import { Redirect, Link } from 'react-router-dom';

// redux
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { removeAlert } from '@components/features/alert/alertSlice';
import {
	authenticateUser,
	getUserData,
} from '@components/features/auth/authSlice';

// components
import Button from '@components/utils/Button';
import DefaultLayout from '@components/layout/DefaultLayout';
import FormField from '@components/utils/FormField';
import PasswordFormField from '@components/utils/PasswordFormField';

// utils
import setAuthToken from '@utils/authTokens';

const Login: React.FC = () => {
	const dispatch = useAppDispatch();

	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const token = useAppSelector((state) => state.auth.token);

	// local state
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	// destructure necessary items
	const { email, password } = formData;

	// handle form change
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	// handle submission login logic
	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const res = await dispatch(authenticateUser({ email, password }));
		if (res.meta.requestStatus !== 'rejected' && status === 'idle') {
			setAuthToken(res.payload);
			dispatch(removeAlert());
			return dispatch(getUserData());
		}
	};

	// redirect to app if authenticated
	if (isAuthenticated && token) {
		return <Redirect to='/leads/' />;
	}

	return (
		<DefaultLayout>
			<section className={classes.content}>
				<article className={classes.card}>
					<header className='pb-4 border-b border-gray-200'>
						<h1 className={classes.title}>Log in</h1>
					</header>
					<form className='card-padding-x'>
						<FormField
							label={'Email'}
							type={'email'}
							name={'email'}
							placeholder={'dsaunders@gmail.com'}
							value={email}
							onChange={onChange}
							required={true}
							styles={null}
							lightOnly={true}
						/>
						<PasswordFormField
							label={'Password'}
							name={'password'}
							placeholder={'Enter your password...'}
							value={password}
							onChange={onChange}
							required={true}
							styles={null}
							lightOnly={true}
						/>
						<div className='mt-4'>
							<Link to={'/reset/forgot-password/'} className='link-light'>
								Forgot password?
							</Link>
						</div>
						<div className='mt-4'>
							<Button
								text={'Log in'}
								onClick={onSubmit}
								width={'w-full'}
								margin={false}
								path={null}
								conditional={null}
								conditionalDisplay={null}
								size={'sm'}
								cta={true}
								lightOnly={true}
							/>
						</div>
					</form>
					<aside className={classes.signup}>
						<p className='inline-block'>Need a LeadGeek account?</p>
						<a
							href='https://leadgeek.io/pricing/'
							className={classes.subheaderLink}
						>
							Join now
						</a>
					</aside>
				</article>
			</section>
		</DefaultLayout>
	);
};

const classes = {
	card: 'max-w-md w-full mt-12 md:mt-0 mx-auto card-200 card-padding-y bg-white',
	content: 'h-full w-full md:flex md:flex-col md:justify-center container',
	contentHeader: 'mt-8 hidden md:block container',
	logoLg: 'default-logo-lg text-purple-500',
	logoSm: 'default-logo-sm',
	signup: 'flex items-center mt-4 card-padding-x text-sm',
	subheaderLink: 'block md:inline-block ml-2 link-light',
	title: 'card-padding-x font-bold text-xl text-gray-900',
};

export default Login;
