import React, { useState, useEffect, useCallback, useRef } from 'react';

// redux
import { updatePaypalEmail, getAffiliatePayments } from '@redux/actions/users';

// components
import AuthLayout from '@components/layout/AuthLayout';
import NullState from '@components/utils/NullState';
import SettingsLayout from '@components/layout/SettingsLayout';
import Spinner from '@components/utils/Spinner';

// utils
import {
	calcAffCommission,
	calcNextPayoutDate,
	calcNextPossiblePayoutDate,
	formatTimestamp,
	planCheckerByPrice,
	truncateAndObfuscate,
} from '@utils/utils';
import { useAppDispatch, useAppSelector } from '@utils/hooks';

interface Payment {
	id: string;
	amount: number;
	currency: string;
	created: number;
}

const AffiliatesPage = () => {
	const dispatch = useAppDispatch();
	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const user = useAppSelector((state) => state.auth.user);
	// local state
	const [affiliateState, setAffiliateState] = useState<{
		paypalEmail: string;
		paymentHistory: {
			status: string;
			payments: Payment[];
		};
	}>({
		paypalEmail: '',
		paymentHistory: {
			status: 'loading',
			payments: [],
		},
	});
	const [changePaypal, setChangePaypal] = useState(false);
	const [copiedText, setCopiedText] = useState(false);
	const [copyText, setCopyText] = useState('Copy LGID');
	const [isAffiliate] = useState(
		isAuthenticated && user?.referrals.referrer.isReferrer
	);
	const [lastPayout] = useState(calcNextPossiblePayoutDate(-1));
	const [lgid] = useState(isAuthenticated && user?.referrals.referrer.lgid);
	const [modal, setModal] = useState(false);
	const [nextPayout] = useState(calcNextPossiblePayoutDate(1));

	// destructure necessary items
	const {
		paypalEmail,
		paymentHistory: { status: paymentStatus, payments },
	} = affiliateState;

	// get affiliate payments if user is authenticated & affiliate
	useEffect(() => {
		status === 'idle' &&
			isAffiliate &&
			payments.length === 0 &&
			getAffiliatePayments(
				user?.referrals.referrer.clients,
				user?.referrals.referrer.dateCreated
			);
	}, [
		status,
		isAffiliate,
		payments,
		user?.referrals.referrer.clients,
		user?.referrals.referrer.dateCreated,
	]);

	// close modal on click outside
	const modalRef = useRef();
	// close modal on esc key
	const keyPress = useCallback(
		(e) => {
			if (e.key === 'Escape' && modal) {
				setModal(false);
			}
		},
		[setModal, modal]
	);
	useEffect(() => {
		document.addEventListener('keydown', keyPress);
		return () => document.removeEventListener('keydown', keyPress);
	}, [keyPress]);

	// handle input change for PayPal email
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAffiliateState({ ...affiliateState, [e.target.name]: e.target.value });
	};

	// submit for form
	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		updatePaypalEmail(
			user?._id,
			user?.referrals.referrer.paypalEmail,
			affiliateState.paypalEmail
		);
		setChangePaypal(false);
	};

	const calcCommissionTotal = (payments: any) => {
		const total = payments.reduce((a: any, b: any) => {
			return a + b['amount'];
		}, 0);
		return calcAffCommission(total);
	};

	const calcAffPayout = (payments: any) => {
		const eligiblePayments = payments.filter(
			(payment: any) =>
				calcNextPayoutDate(payment.created) >= lastPayout &&
				calcNextPayoutDate(payment.created) <= nextPayout
		);
		const affPayout = calcCommissionTotal(eligiblePayments);

		return affPayout;
	};

	const basicInformationItems = [
		{
			title: <span>Unique link</span>,
			value: (
				<button
					onClick={() => setModal((prev) => !prev)}
					className='font-semibold text-purple-600 hover:text-gray-700 ring-gray rounded-lg transition-main'
				>
					Generate affiliate link
				</button>
			),
			isInteractable: true,
			t: 'Generate & copy your unique link in the format "https://leadgeek.io/?lgid=YOUR_LGID"',
			size: '',
		},
		{
			title: <span>PayPal email address</span>,
			value: changePaypal ? (
				<form onSubmit={(e) => onSubmit(e)} className='flex items-center'>
					<input
						name='paypalEmail'
						type='email'
						placeholder='Your new PayPal email'
						required={true}
						onChange={onChange}
						className='w-full py-1 px-2 rounded-l-md border border-gray-200 hover:border-purple-300 placeholder-gray-300 ring-purple focus:ring-inset'
					/>
					<button className='py-1 px-2 rounded-r-md text-white border border-purple-500 bg-purple-500 hover:bg-purple-600 transition-main ring-purple'>
						Update
					</button>
				</form>
			) : (
				<button
					onClick={() => setChangePaypal(true)}
					className={`font-semibold ${
						isAuthenticated &&
						(user?.referrals.referrer.paypalEmail || paypalEmail)
							? 'text-purple-500 hover:text-gray-700'
							: 'text-red-400 hover:text-red-500'
					} hover:text-gray-700 ring-gray rounded-lg transition-main`}
				>
					{isAuthenticated &&
					(user?.referrals.referrer.paypalEmail || paypalEmail)
						? paypalEmail || user?.referrals.referrer.paypalEmail
						: 'Add PayPal email for payout'}
				</button>
			),
			isInteractable: true,
			t: 'This is the PayPal email where your commission payments will be sent',
			size: 'row-span-2',
		},
		{
			title: (
				<span>
					Est. payout for{' '}
					<span className='font-bold'>{nextPayout.toFormat('LLLL dd')}</span>
				</span>
			),
			value:
				status === 'idle' ? (
					<span className='font-bold'>${calcAffPayout(payments)}</span>
				) : (
					<Spinner
						divWidth={null}
						center={true}
						spinnerWidth={'sm'}
						margin={false}
						text={null}
					/>
				),
			isInteractable: false,
			t: 'On the 15th of each month for commissions > 60 days old',
			size: '',
		},
		{
			title: <span>Total clients referred</span>,
			value: (
				<span className='font-bold'>
					{isAuthenticated &&
						user?.referrals.referrer.clients &&
						user.referrals.referrer.clients.length}
				</span>
			),
			isInteractable: false,
			t: '',
			size: '',
		},
		{
			title: <span>Total referral value</span>,
			value:
				status === 'idle' ? (
					<span className='font-bold'>${calcCommissionTotal(payments)}</span>
				) : (
					<Spinner
						divWidth={null}
						center={true}
						spinnerWidth={'sm'}
						margin={false}
						text={null}
					/>
				),
			isInteractable: false,
			t: '',
			size: '',
		},
	];

	const codeItems = [
		{
			title: 'Text link',
			code: (
				<code>
					&lt;<span className='code-html-tag'>a</span>{' '}
					<span className='code-html-attribute'>href</span>
					="https://leadgeek.io/?lgid={lgid ? lgid : 'YOUR_LGID'}"{' '}
					<span className='code-html-attribute'>rel</span>
					="sponsored"&gt;Join Leadgeek now&lt;/
					<span className='code-html-tag'>a</span>&gt;
				</code>
			),
			clipboard: `<a href="https://leadgeek.io/?lgid=${
				lgid ? lgid : 'YOUR_LGID'
			}" rel="sponsored">Join Leadgeek now</a>`,
		},
		{
			title: 'Image link',
			code: (
				<code>
					&lt;<span className='code-html-tag'>a</span>{' '}
					<span className='code-html-attribute'>href</span>
					="https://leadgeek.io/?lgid={lgid ? lgid : 'YOUR_LGID'}"{' '}
					<span className='code-html-attribute'>rel</span>
					="sponsored"&gt;
					<br />
					{'  '}&lt;
					<span className='code-html-tag'>img</span>{' '}
					<span className='code-html-attribute'>src</span>
					="https://www.YOUR_WEBSITE.com/YOUR_GRAPHIC.png" /&gt;
					<br />
					&lt;/
					<span className='code-html-tag'>a</span>&gt;
				</code>
			),
			clipboard: `<a href="https://leadgeek.io/?lgid=${
				lgid ? lgid : 'YOUR_LGID'
			}" rel="sponsored"><img src="https://www.YOUR_WEBSITE.com/YOUR_GRAPHIC.png"/></a>`,
		},
	];

	return status === 'idle' && user ? (
		<AuthLayout>
			<SettingsLayout
				isAuthenticated={isAuthenticated}
				user={user}
				title={'Affiliate panel'}
				description={'Manage your Leadgeek affiliate account'}
				pill={{
					active: isAffiliate,
					text: isAffiliate ? 'Active affiliate' : 'Inactive affiliate',
				}}
			>
				<section className='my-6'>
					{isAffiliate ? (
						<div className='w-full pr-16'>
							<section className='mt-6'>
								<header className='flex items-end justify-between pb-2 border-b border-gray-200'>
									<h2 className='font-bold text-lg text-gray-800'>
										Basic information
									</h2>
									{lgid && (
										<div className='relative'>
											<button
												onClick={() => {
													navigator.clipboard.writeText(lgid || '');
													setCopyText('LGID copied');
													setCopiedText(true);
													setTimeout(function () {
														setCopiedText(false);
														setCopyText('Copy LGID');
													}, 2000);
												}}
												onMouseEnter={() => setCopiedText(true)}
												onMouseLeave={() => setCopiedText(false)}
												className='p-1 rounded-lg bg-gray-100 text-gray-900 text-xs border border-gray-400 ring-gray transition-main ring-gray'
											>
												Leadgeek ID: {lgid}
											</button>
											{copiedText && (
												<div className='absolute top-0 right-0 flex items-center p-2 transform -translate-y-10 rounded-lg shadow-md bg-gray-900 text-white text-xs whitespace-nowrap'>
													{copyText || 'Copy LGID'}
												</div>
											)}
										</div>
									)}
								</header>
								<div className='grid grid-flow-col grid-rows-3 grid-cols-2 gap-y-2 gap-x-8 mt-6'>
									{basicInformationItems.map((item, i) => (
										<BasicInformationItem
											key={i}
											title={item.title}
											value={item.value}
											isInteractable={item.isInteractable}
											t={item.t}
											size={item.size}
										/>
									))}
								</div>
							</section>
							<section className='mt-6'>
								<header className='pb-2 border-b border-gray-200'>
									<h2 className='font-bold text-lg text-gray-800'>
										Commission history
									</h2>
								</header>
								{paymentStatus === 'loading' ? (
									<Spinner
										divWidth={null}
										center={false}
										spinnerWidth={null}
										margin={true}
										text={'Loading affiliate payments...'}
									/>
								) : payments.length > 0 ? (
									<div>
										<div className={classes.tableWrapper}>
											<table className={classes.table} id='payments'>
												<thead className={classes.tableHeadWrapper}>
													<tr className={classes.tableHead}>
														<th>Transaction ID</th>
														<th className={classes.tableHeadCell}>Plan</th>
														<th className={classes.tableHeadCell}>Amount</th>

														<th className='pl-2 text-right'>Date created</th>
														<th className='pl-2 text-right'>
															Est. payout date
														</th>
													</tr>
												</thead>
												<tbody className={classes.tableBody}>
													{payments.map((payment, i) => (
														<tr key={i} className={classes.rowWrapper}>
															{/* transaction id */}
															<td>{truncateAndObfuscate(payment.id, 22)}</td>
															{/* plan */}
															<td className={classes.defaultCellWrapper}>
																{planCheckerByPrice(payment.amount)}
															</td>
															{/* amount */}
															<td className={classes.defaultCellWrapper}>
																<span>$</span>
																{calcAffCommission(payment.amount)}
																<span className={classes.valueIndicator}>
																	{payment.currency.toUpperCase()}
																</span>
															</td>
															{/* date created */}
															<td className='pl-2 text-right'>
																{formatTimestamp(payment.created, true)}
															</td>
															{/* payout date */}
															<td className='pl-2 text-right'>
																{calcNextPayoutDate(payment.created).toFormat(
																	'LLLL dd, yyyy'
																)}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								) : (
									<section className='mt-6'>
										<NullState
											header={'No affiliate payments found'}
											text={'No payments have been found for your account.'}
											path={svgList.payment}
											link={''}
											linkText={''}
										/>
									</section>
								)}
							</section>
							{modal && (
								<>
									<div
										// ref={modalRef}
										onClick={() => {
											setModal((prev) => !prev);
										}}
										className='absolute inset-0 z-10 h-full w-full bg-gray-900 opacity-25'
									/>
									<div
										className={`absolute top-1/2 inset-x-0 z-20 max-h-screen max-w-4xl mx-auto p-6 rounded-lg bg-white shadow-lg transform -translate-y-1/2`}
									>
										<div className='relative pb-1 border-b border-gray-200'>
											<header className='flex items-center'>
												<h3 className='text-xl font-bold text-gray-800'>
													Generated affiliate links
												</h3>
											</header>
											<button
												onClick={() => setModal((prev) => !prev)}
												className='absolute top-0 right-0 ml-2 p-1 hover:bg-gray-100 rounded-md hover:text-gray-700 ring-gray transition duration-100 ease-in-out'
											>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													className='h-5 w-5'
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
										{codeItems.map((codeItem, i) => (
											<CodeItem
												key={i}
												title={codeItem.title}
												code={codeItem.code}
												clipboard={codeItem.clipboard}
											/>
										))}
									</div>
								</>
							)}
						</div>
					) : (
						<section className='mt-6'>
							<NullState
								header={'Become a Leadgeek affiliate'}
								text={
									'Leadgeek offers 25% lifetime commissions for any new member you refer. Apply @ www.leadgeek.io/affiliates'
								}
								path={svgList.affiliate}
								link={''}
								linkText={''}
							/>
						</section>
					)}
				</section>
			</SettingsLayout>
		</AuthLayout>
	) : (
		<div className='h-screen'>
			<Spinner
				divWidth={null}
				center={true}
				spinnerWidth={null}
				margin={false}
				text={'Loading your Leadgeek profile...'}
			/>
		</div>
	);
};

interface BasicInformationItemProps {
	title: JSX.Element;
	value: JSX.Element;
	isInteractable: boolean;
	t: string;
	size: string;
}

const BasicInformationItem: React.FC<BasicInformationItemProps> = ({
	title,
	value,
	isInteractable,
	t,
	size,
}) => {
	// local state
	const [tooltip, setTooltip] = useState(false);

	return (
		<div
			className={`flex justify-between text-gray-900 ${
				size ? `${size} items-start` : 'items-center'
			}`}
		>
			<header className='flex items-center'>
				<h3 className='align-bottom'>{title}</h3>
				{t && (
					<div className='mt-1 ml-2 relative z-0 flex items-end'>
						<div
							onMouseEnter={() => setTooltip(true)}
							onMouseLeave={() => setTooltip(false)}
							className='text-gray-400 rounded-full ring-gray cursor-pointer'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-4 w-4'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path
									fillRule='evenodd'
									d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
									clipRule='evenodd'
								/>
							</svg>
						</div>
						{tooltip && (
							<div className='absolute left-0 flex items-center p-2 transform translate-x-6 translate-y-1 rounded-lg shadow-md bg-gray-900 text-white text-xs whitespace-nowrap'>
								{t}
							</div>
						)}
					</div>
				)}
			</header>
			{isInteractable ? value : <div>{value}</div>}
		</div>
	);
};

interface CodeItemProps {
	title: string;
	code: JSX.Element;
	clipboard: string;
}

const CodeItem: React.FC<CodeItemProps> = ({ title, code, clipboard }) => {
	const [hover, setHover] = useState(false);
	const [copyText, setCopyText] = useState('Copy code');

	return (
		<div className='mt-6'>
			<header className='relative pb-1 border-b border-gray-200'>
				<h4 className='text-lg font-bold text-gray-800'>{title}</h4>
				{hover && (
					<div className='absolute left-1/2 transform -translate-x-1/2 -translate-y-8 p-2 rounded-lg shadow-md bg-gray-900 text-white text-xs whitespace-nowrap'>
						{copyText}
					</div>
				)}
			</header>
			<button
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => copyText === 'Copy code' && setHover(false)}
				onClick={() => {
					navigator.clipboard.writeText(clipboard || '');
					setCopyText('Code copied');
					setHover(true);
					setTimeout(function () {
						setCopyText('Copy code');
						setHover(false);
					}, 2000);
				}}
				className='w-full mt-2 rounded-lg text-left ring-gray transition-main'
			>
				<pre className='p-4 bg-gray-900 rounded-lg text-gray-300 shadow-lg whitespace-pre'>
					{code}
				</pre>
			</button>
		</div>
	);
};

const svgList = {
	payment: (
		<g>
			<path d='M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z' />
			<path
				fillRule='evenodd'
				d='M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z'
				clipRule='evenodd'
			/>
		</g>
	),
	affiliate: (
		<path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' />
	),
};

const classes = {
	tableWrapper: 'w-full relative mt-4',
	table: 'w-full table-auto',
	tableHeadWrapper: 'border-b border-gray-200',
	tableHead:
		'text-left font-semibold text-xs text-gray-600 uppercase tracking-widest whitespace-no-wrap',
	tableHeadCell: 'p-2',
	tableBody: 'text-sm text-gray-800',
	rowWrapper: 'relative px-1 border-b border-gray-200 hover:bg-gray-100',

	defaultCellWrapper: 'p-2',
	defaultSvg: 'svg-base',
	valueIndicator: 'ml-1 text-gray-400 font-semibold',
};

export default AffiliatesPage;