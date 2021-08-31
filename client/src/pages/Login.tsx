import React, { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@utils/hooks';
import { setJWT, getUserData } from '@components/features/auth/authSlice';

import { Redirect, Link } from 'react-router-dom';

import DefaultLayout from '@components/layout/DefaultLayout';
import FormField from '@components/layout/utils/FormField';
import PasswordFormField from '@components/layout/utils/PasswordFormField';
import Button from '@components/layout/utils/Button';
import DefaultFooter from '@components/layout/navigation/DefaultFooter';

import { ReactComponent as LeadGeekLogo } from '@assets/images/svgs/leadgeek-logo-light.svg';
import setAuthToken from '@utils/authTokens';

const Login: React.FC = () => {
	const dispatch = useAppDispatch();
	const readyStatus = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const { email, password } = formData;

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async (e: any) => {
		e.preventDefault();
		const {
			payload: { token },
		} = await dispatch(setJWT({ email, password }));
		if (token && readyStatus === 'idle') {
			setAuthToken(token);
			const test = await dispatch(getUserData());
			console.log(test);
		} else {
			console.log('boo');
		}
	};

	if (isAuthenticated) {
		return <Redirect to='/leads' />;
	}

	return (
		<DefaultLayout>
			<section className={classes.wrapper}>
				<div className={classes.border} />
				<div className={classes.content}>
					<header className={classes.contentHeader}>
						<LeadGeekLogo className={classes.logoLg} />
					</header>
					<section className='container'>
						<article className={classes.card}>
							<div>
								<LeadGeekLogo className={classes.logoSm} />
								<h1 className={classes.title}>Log in</h1>
							</div>
							<form>
								<FormField
									label={'Email'}
									type={'email'}
									name={'email'}
									placeholder={'dsaunders@gmail.com'}
									value={email}
									onChange={onChange}
									required={true}
									styles={null}
								/>
								<PasswordFormField
									label={'Password'}
									placeholder={'Password'}
									value={password}
									onChange={onChange}
									required={true}
									styles={null}
								/>
								<div className='mt-2'>
									<Link to={'/reset/forgot-password/'} className='link'>
										Forgot password?
									</Link>
								</div>
								<div className='mt-4'>
									<Button
										text={'Log in'}
										onClick={onSubmit}
										width={'w-full'}
										margin={null}
										path={null}
										conditional={null}
										conditionalDisplay={null}
										size={'sm'}
										cta={true}
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
					<DefaultFooter />
				</div>
				{/* <LoginImage /> */}
			</section>
		</DefaultLayout>
	);
};

const classes = {
	wrapper: 'min-h-screen relative flex justify-center bg-gray-100',
	border: 'h-2 absolute z-10 inset-x-0 top-0 bg-purple-300',
	content:
		'xl:h-screen w-full xl:w-3/5 md:flex md:flex-col md:justify-between bg-gray-100',
	contentHeader: 'mt-6 hidden md:block container',
	logoLg: 'default-logo-lg',
	logoSm: 'default-logo-sm',
	card: 'mt-12 md:mt-0 max-w-md card',
	title:
		'pb-2 text-xl md:text-2xl lg:text-3xl font-black text-gray-900 border-b border-gray-200',
	signup: 'mt-4 flex items-center mt-2 text-sm',
	subheaderLink: 'ml-2 block md:inline-block link',
};

export default Login;
