import React, { Fragment, useState } from 'react';

// packages
// import { animated, useSpring } from 'react-spring';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// redux
import { useAppSelector, useAppDispatch } from '@hooks/hooks';
import {
	defaultHeaders,
	setExportHeaders,
} from '@components/features/leads/leadsSlice';
// import { removeAlert, setAlert } from '@features/alert/alertSlice';

// components
import AuthLayout from '@components/layout/AuthLayout';
import Button from '@components/utils/Button';
// import FormField from '@components/utils/FormField';
import SettingsItem from '@components/utils/SettingsItem';
import SettingsLayout from '@components/layout/SettingsLayout';
import Spinner from '@components/utils/Spinner';
// import Toggle from '@components/utils/Toggle';

const ArbitragePage = () => {
	const dispatch = useAppDispatch();

	// auth state
	const { status, user, exportHeaders } = useAppSelector((state) => ({
		status: state.auth.status,
		user: state.auth.user,
		exportHeaders: state.leads.settings.exportHeaders,
	}));

	// local state
	const [modal, setModal] = useState(false);
	const [headers, setHeaders] = useState(exportHeaders);

	// local state
	// const [formData, setFormData] = useState({
	// 	unitFee: '',
	// 	stdInventoryFee: '',
	// 	labelingFee: '',
	// 	inspectionFee: '',
	// 	marketingInsertFee: '',
	// });
	// const [advancedPrepView, setAdvancedPrepView] = useState(false);

	// destructure necessary items
	// const {
	// 	unitFee,
	// 	stdInventoryFee,
	// 	labelingFee,
	// 	inspectionFee,
	// 	marketingInsertFee,
	// } = formData;

	// handle form input change
	// const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	setFormData({ ...formData, [e.target.name]: e.target.value });
	// };

	// const onToggle = () => {
	// 	setAdvancedPrepView((prev) => !prev);
	// };

	// const advancedPrepItems: {
	// 	label: string;
	// 	name: keyof typeof formData;
	// 	placeholder: string;
	// 	value: string | undefined;
	// }[] = [
	// 	{
	// 		label: 'Standard inventory fee',
	// 		name: 'stdInventoryFee',
	// 		placeholder: user?.name ? user.name : 'Eg. 0.50',
	// 		value: formData.stdInventoryFee || user?.name,
	// 	},
	// 	{
	// 		label: 'Labeling fee',
	// 		name: 'labelingFee',
	// 		placeholder: 'Eg. 0.20',
	// 		value: formData.labelingFee,
	// 	},
	// 	{
	// 		label: 'Inspection fee',
	// 		name: 'inspectionFee',
	// 		placeholder: user?.name ? user.name : 'Eg. 0.20',
	// 		value: formData.inspectionFee || user?.name,
	// 	},
	// 	{
	// 		label: 'Marketing insert fee',
	// 		name: 'marketingInsertFee',
	// 		placeholder: user?.name ? user.name : 'Eg. 0.05',
	// 		value: formData.inspectionFee || user?.name,
	// 	},
	// ];

	const reorder = (
		list: { label: string; key: string }[],
		startIndex: number,
		endIndex: number
	) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	};

	const onDragEnd = (result: any) => {
		const { destination, source } = result;

		// dragging outside the droppable area
		if (!destination) {
			return;
		}

		// dropping in the same spot
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const items = reorder(headers, source.index, destination.index);
		setHeaders(items);
	};

	const onModalClose = () => {
		return dispatch(setExportHeaders(headers));
	};

	// const cardAnimationStyle = useSpring({
	// 	height: advancedPrepView ? '10.25rem' : '5.125rem',
	// 	config: { duration: 75 },
	// });

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
								{/* <article className='pt-2 md:pt-4 lg:pt-6 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='center-between card-padding-x'>
											<h2 className='font-bold text-lg text-300'>Prep fees</h2>
											<Toggle
												itemLeft={<span>Advanced</span>}
												itemRight={null}
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
								</article> */}
								<article className='mt-4 py-2 md:py-4 lg:py-6 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='card-padding-x'>
											<h2 className='font-bold text-lg text-300'>Leads</h2>
										</header>
									</div>
									<SettingsItem
										title={'Export preferences'}
										description={'Adjust the column order when exporting leads'}
										action={
											<Button
												text={'Edit'}
												onClick={() => setModal((prev) => !prev)}
												width={null}
												margin={false}
												size={'sm'}
												cta={true}
												path={null}
												conditional={null}
												conditionalDisplay={null}
											/>
										}
									/>
								</article>
								{modal && (
									<>
										<div
											onClick={() => {
												onModalClose();
												setModal((prev) => !prev);
											}}
											className='absolute inset-0 z-10 h-full w-full bg-gray-900 opacity-25'
										/>
										<div
											className={`absolute inset-0 z-20 h-1/2 max-w-2xl m-auto pt-2 md:pt-4 lg:pt-6 pb-8 cs-light-200 card-200`}
										>
											<div className='center-between pb-1  card-padding-x border-b border-200'>
												<header className='flex items-end'>
													<h3 className='text-xl font-bold text-300'>
														Column order
													</h3>
												</header>
												<div className='flex items-center'>
													<button
														onClick={() => {
															setHeaders(defaultHeaders);
														}}
														className='mr-4 link'
													>
														Reset to default
													</button>
													<button
														onClick={() => {
															onModalClose();
															setModal((prev) => !prev);
														}}
														className='p-1 text-100 hover:bg-gray-100 dark:hover:bg-darkGray-100 rounded-md hover:text-gray-700 dark:hover:text-gray-400 ring-gray transition-main'
													>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='svg-base'
															viewBox='0 0 20 20'
															fill='currentColor'
														>
															<path
																fillRule='evenodd'
																d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
																clipRule='evenodd'
															/>
														</svg>
													</button>
												</div>
											</div>
											<div className='card-padding-x h-full py-6 minimal-scrollbar transform-none -translate-y-0'>
												<DragDropContext onDragEnd={onDragEnd}>
													<Droppable droppableId={'export-headers'}>
														{(provided: any) => (
															<ul
																{...provided.droppableProps}
																ref={provided.innerRef}
															>
																{headers.map(({ key, label }, i: number) => (
																	<Draggable
																		key={key}
																		draggableId={key}
																		index={i}
																	>
																		{(provided, snapshot) => (
																			<li
																				{...provided.draggableProps}
																				{...provided.dragHandleProps}
																				ref={provided.innerRef}
																				className={`flex justify-between items-center first:mt-0 mt-2 py-2 px-4 text-200 ${
																					snapshot.isDragging
																						? 'bg-gray-200 dark:bg-darkGray-200 card-200'
																						: 'bg-gray-100 dark:bg-darkGray-100 card-100'
																				}`}
																			>
																				<span>{label}</span>
																				<span className='text-100'>
																					<svg
																						xmlns='http://www.w3.org/2000/svg'
																						className='h-5 w-5'
																						viewBox='0 0 20 20'
																						fill='currentColor'
																					>
																						<path
																							fillRule='evenodd'
																							d='M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
																							clipRule='evenodd'
																						/>
																					</svg>
																				</span>
																			</li>
																		)}
																	</Draggable>
																))}
																{provided.placeholder}
															</ul>
														)}
													</Droppable>
												</DragDropContext>
											</div>
										</div>
									</>
								)}
							</Fragment>
						)}
					</section>
				</SettingsLayout>
			</AuthLayout>
		)
	);
};

export default ArbitragePage;
