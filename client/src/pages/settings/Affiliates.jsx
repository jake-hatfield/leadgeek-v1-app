import React, { useState, useEffect, useCallback, useRef } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAffiliatePayments } from 'redux/actions/users';

import {
	planCheckerByPrice,
	calcAffCommission,
	truncateAndObfuscate,
	formatTimestamp,
	getPayout,
	calcNextPayoutDate,
} from 'utils/utils';
import AuthLayout from 'components/layout/AuthLayout';
import SettingsLayout from 'components/layout/SettingsLayout';
import Spinner from 'components/layout/utils/Spinner';

const BasicInformationItem = ({ title, value, isInteractable, t }) => {
	const [tooltip, setTooltip] = useState(false);

	return (
		<div className='flex items-center justify-between text-gray-900'>
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

const AffiliatesPage = ({
	auth: { user, loading, isAuthenticated },
	affiliates: { paymentHistory },
	getAffiliatePayments,
}) => {
	const { referrals } = Object(user);
	const isAffiliate = isAuthenticated && referrals.referrer.isReferrer;
	const lgid = isAuthenticated && referrals.referrer.lgid;

	useEffect(() => {
		isAuthenticated &&
			paymentHistory.payments.length === 0 &&
			user.referrals.referrer.isReferrer === true &&
			getAffiliatePayments(lgid, user.referrals.referrer.dateCreated);
	}, [isAuthenticated]);

	const [modal, setModal] = useState(false);

	const toggleModal = (modal) => {
		setModal(!modal);
	};

	// close modal on click outside
	const modalRef = useRef();
	const closeModal = (e) => {
		if (modalRef.current === e.target) {
			setModal(false);
		}
	};
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

	const [copyText, setCopyText] = useState('Copy LGID');
	const [copiedText, setCopiedText] = useState('');

	const [nextPayout] = useState(getPayout(1));
	const [lastPayout] = useState(getPayout(-1));

	const calcCommissionTotal = (payments) => {
		const total = payments.reduce((a, b) => {
			return a + b['amount'];
		}, 0);
		return calcAffCommission(total);
	};

	const calcAffPayout = (payments) => {
		const eligiblePayments = payments.filter(
			(payment) =>
				calcNextPayoutDate(payment.created) >= lastPayout &&
				calcNextPayoutDate(payment.created) <= nextPayout
		);
		const affPayout = calcCommissionTotal(eligiblePayments);

		return affPayout;
	};

	const basicInformationItems = [
		{
			title: 'Unique link',
			value: (
				<button
					onClick={() => toggleModal(modal)}
					className='font-semibold text-purple-600 hover:text-gray-700 ring-gray rounded-lg transition-main'
				>
					Generate unique link
				</button>
			),
			isInteractable: true,
			t: 'Generate and copy your unique affiliate link',
		},
		{
			title: 'Link example',
			value: `https://leadgeek.io/?lgid=${lgid}`,
			isInteractable: false,
			t: "Refer clients to any page on Leadgeek's website with this link format",
		},
		{
			title: 'Paypal email address',
			value: (
				<form className='flex items-center'>
					{/* <FormField
						padding={'pt-0'}
						placeholder={
							(user && referrals.referrer.paypalEmail) ||
							'Enter your PayPal email'
						}
					/>
					<button>Submit</button> */}
				</form>
			),
			isInteractable: true,
			t: 'This is the PayPal email where your commission payments will be sent',
		},
		{
			title: (
				<span>
					Est. payout for{' '}
					<span className='font-bold'>{nextPayout.toFormat('LLLL dd')}</span>
				</span>
			),
			value: paymentHistory.loading ? (
				<Spinner spinnerWidth={'sm'} noMargin={'true'} />
			) : (
				<span className='font-bold'>
					${calcAffPayout(paymentHistory.payments)}
				</span>
			),
			isInteractable: false,
			t: 'Payouts are made on the 15th of each month for commissions > 60 days old',
		},
		{
			title: 'Total clients referred',
			value: (
				<span className='font-bold'>
					{isAuthenticated && user.referrals.referrer.clients.length}
				</span>
			),
			isInteractable: false,
		},
		{
			title: 'Total referral value',
			value: paymentHistory.loading ? (
				<Spinner spinnerWidth={'sm'} noMargin={'true'} />
			) : (
				<span className='font-bold'>
					${calcCommissionTotal(paymentHistory.payments)}
				</span>
			),
			isInteractable: false,
		},
	];

	const codeItems = [
		{
			title: 'Text link',
			code: (
				<code>
					&lt;<span className='code-html-tag'>a</span>{' '}
					<span className='code-html-attribute'>href</span>
					="https://leadgeek.io/?lgid={lgid}"{' '}
					<span className='code-html-attribute'>rel</span>
					="sponsored"&gt;Join Leadgeek now&lt;/
					<span className='code-html-tag'>a</span>&gt;
				</code>
			),
			clipboard: `<a href="https://leadgeek.io/?lgid=${lgid}" rel="sponsored">Join Leadgeek now</a>`,
		},
		{
			title: 'Image link',
			code: (
				<code>
					&lt;<span className='code-html-tag'>a</span>{' '}
					<span className='code-html-attribute'>href</span>
					="https://leadgeek.io/?lgid={lgid}"{' '}
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
			clipboard: `<a href="https://leadgeek.io/?lgid=${lgid}" rel="sponsored"><img src="https://www.YOUR_WEBSITE.com/YOUR_GRAPHIC.png"/></a>`,
		},
	];

	return (
		<AuthLayout>
			<SettingsLayout
				title={'Affiliate panel'}
				desc={'Manage your Leadgeek affiliate account'}
				pill={{
					active: isAffiliate,
					text: isAffiliate ? 'Active affiliate' : 'Inactive affiliate',
				}}
				loading={loading}
				isAuthenticated={isAuthenticated}
				user={user}
			>
				<section className='my-6'>
					{loading ? (
						<Spinner />
					) : isAffiliate ? (
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
								<div className='grid grid-flow-col grid-rows-3 grid-cols-2 gap-y-1 gap-x-8 mt-6'>
									{basicInformationItems.map((item, i) => (
										<BasicInformationItem
											key={i}
											title={item.title}
											value={item.value}
											isInteractable={item.isInteractable}
											t={item.t}
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
								{paymentHistory.loading ? (
									<Spinner />
								) : paymentHistory.payments.length > 0 ? (
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
													{paymentHistory.payments.map((payment, i) => (
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
									<div>
										There are no payments that have been recorded for your
										account.
									</div>
								)}
							</section>
							{modal && (
								<>
									<div
										ref={modalRef}
										onClick={() => {
											toggleModal(modal);
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
												onClick={() => toggleModal(modal)}
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
						<section>
							Leadgeek offers 25% lifetime commissions for any new member you
							refer. Please email support@leadgeek.io for an affiliate
							application.
						</section>
					)}
				</section>
			</SettingsLayout>
		</AuthLayout>
	);
};

const CodeItem = ({ title, code, clipboard }) => {
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

AffiliatesPage.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	affiliates: state.users.userSettings.affiliates,
});

export default connect(mapStateToProps, { getAffiliatePayments })(
	AffiliatesPage
);
