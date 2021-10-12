import React, { Fragment, useState } from 'react';

import { animated, useSpring } from 'react-spring';

// redux
import { useAppSelector } from '@hooks/hooks';
// import { removeAlert, setAlert } from '@features/alert/alertSlice';

// components
import AuthLayout from '@components/layout/AuthLayout';
import Button from '@components/utils/Button';
import FormField from '@components/utils/FormField';
import SettingsLayout from '@components/layout/SettingsLayout';
import Spinner from '@components/utils/Spinner';
import Toggle from '@components/utils/Toggle';

const ArbitragePage = () => {
	// const dispatch = useAppDispatch();

	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const user = useAppSelector((state) => state.auth.user);

	// local state
	const [formData, setFormData] = useState({
		unitFee: '',
		stdInventoryFee: '',
		labelingFee: '',
		inspectionFee: '',
		marketingInsertFee: '',
	});
	const [advancedPrepView, setAdvancedPrepView] = useState(false);

	// destructure necessary items
	// const {
	// 	unitFee,
	// 	stdInventoryFee,
	// 	labelingFee,
	// 	inspectionFee,
	// 	marketingInsertFee,
	// } = formData;

	// handle form input change
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onToggle = () => {
		setAdvancedPrepView((prev) => !prev);
	};

	const advancedPrepItems: {
		label: string;
		name: keyof typeof formData;
		placeholder: string;
		value: string | undefined;
	}[] = [
		{
			label: 'Standard inventory fee',
			name: 'stdInventoryFee',
			placeholder: user?.name ? user.name : 'Eg. 0.50',
			value: formData.stdInventoryFee || user?.name,
		},
		{
			label: 'Labeling fee',
			name: 'labelingFee',
			placeholder: 'Eg. 0.20',
			value: formData.labelingFee,
		},
		{
			label: 'Inspection fee',
			name: 'inspectionFee',
			placeholder: user?.name ? user.name : 'Eg. 0.20',
			value: formData.inspectionFee || user?.name,
		},
		{
			label: 'Marketing insert fee',
			name: 'marketingInsertFee',
			placeholder: user?.name ? user.name : 'Eg. 0.05',
			value: formData.inspectionFee || user?.name,
		},
	];

	const cardAnimationStyle = useSpring({
		height: advancedPrepView ? '10.25rem' : '5.125rem',
		config: { duration: 75 },
	});

	return (
		user && (
			<AuthLayout>
				<SettingsLayout
					title={'Arbitrage'}
					description={'Manage arbitrage settings and information'}
				>
					<section className='my-6'>
						{status === 'loading' ? (
							<Spinner
								divWidth={null}
								center={false}
								spinnerWidth={'sm'}
								margin={false}
								text={null}
							/>
						) : (
							<Fragment>
								<article className='pt-2 md:pt-4 lg:pt-6 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='center-between card-padding-x'>
											<h2 className='font-bold text-lg text-300'>Prep fees</h2>
											<Toggle
												itemLeft={null}
												itemRight={<span>Advanced</span>}
												onChange={onToggle}
												defaultChecked={false}
											/>
										</header>
									</div>
									<animated.div
										style={cardAnimationStyle}
										className='grid gap-x-16 grid-flow-row grid-cols-2 card-padding-x'
									>
										{advancedPrepView ? (
											<Fragment>
												{advancedPrepItems.map((item, i) => (
													<FormField
														key={i}
														label={item.label}
														type={'number'}
														name={item.name}
														placeholder={item.placeholder}
														value={item.value}
														onChange={onChange}
														required={false}
														styles={null}
													/>
												))}
											</Fragment>
										) : (
											<Fragment>
												<FormField
													label={'Fee per unit'}
													type={'number'}
													name={'unitFee'}
													placeholder={user.name}
													value={user.name}
													onChange={onChange}
													required={true}
													styles={null}
												/>
												<div />
											</Fragment>
										)}
									</animated.div>
									<div className='flex justify-end mt-4 py-2 card-padding-x cs-bg rounded-b-lg border-t border-300'>
										<Button
											text={'Save'}
											onClick={() => alert('hello')}
											width={null}
											margin={false}
											size={'sm'}
											cta={true}
											path={null}
											conditional={null}
											conditionalDisplay={null}
										/>
									</div>
								</article>
							</Fragment>
						)}
					</section>
				</SettingsLayout>
			</AuthLayout>
		)
	);
};

export default ArbitragePage;
