import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AuthLayout from 'components/layout/AuthLayout';
import SettingsLayout from 'components/layout/SettingsLayout';
import AffiliateTable from 'components/settings/affiliates/AffiliateTable';
import FormField from 'components/layout/utils/FormField';
import Spinner from 'components/layout/utils/Spinner';

const BasicInformationItem = ({ title, value, isInteractable, t }) => {
	const [tooltip, setTooltip] = useState(false);

	return (
		<div className='flex items-center justify-between text-gray-900 text-sm'>
			<header className='flex items-end'>
				<h3 className='align-bottom'>{title}</h3>
				{t && (
					<div className='ml-2 relative flex items-end'>
						<button
							onMouseEnter={() => setTooltip(true)}
							onMouseLeave={() => setTooltip(false)}
							className='relative text-gray-400 rounded-full ring-gray'
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
						</button>
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

const AffiliatesPage = ({ auth: { user, loading, isAuthenticated } }) => {
	const [copyText, setCopyText] = useState('Copy LGID');
	const [copiedText, setCopiedText] = useState('');

	const { referrals } = Object(user);
	console.log(referrals);
	const isAffiliate = user && referrals.referrer.isReferrer;
	const lgid = user && referrals.referrer.lgid;

	const basicInformationItems = [
		{
			title: 'Unique link',
			value: (
				<button className='py-2 px-4 rounded-lg text-white text-sm shadow-md bg-purple-500 hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:shadow-outline'>
					Generate unique link
				</button>
			),
			isInteractable: true,
			t: 'hello',
		},
		{
			title: 'Link example',
			value: `https://leadgeek.io/?lgid=${lgid}`,
			isInteractable: false,
			t: 'hello',
		},
		{
			title: 'Paypal email address',
			value: (
				<form className='flex items-center'>
					<FormField
						padding={'pt-0'}
						placeholder={
							(user && referrals.referrer.paypalEmail) ||
							'Enter your PayPal email'
						}
					/>
					<button>Submit</button>
				</form>
			),
			isInteractable: true,
			t: "This is the PayPal email where your commission payments will be sent, so please make sure it's accurate",
		},
		{
			title: 'Days to next payout',
			value: 'Apr 321st',
			isInteractable: false,
			t: 'Affiliate payouts are made on the 15th of every month for commissions more than 60 days old',
		},
		{
			title: 'Commissions earned (+ all time)',
			value: 200,
			isInteractable: false,
		},
		{
			title: 'Total commission value',
			value: 201,
			isInteractable: false,
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
								<div className='grid grid-flow-col grid-rows-3 grid-cols-2 gap-y-2 gap-x-8 mt-6'>
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
								<AffiliateTable
									loading={loading}
									payments={[
										{
											data: {
												bsr30: 39428,
												bsr90: 43270,
												price30: 52.72,
												price90: 45.71,
												source: "Dillard's",
												title: 'Spanx Undie-Tectable Lace Hi-Hipster Panty',
												brand: 'Spanx',
												category: 'Clothing, Shoes & Jewelry',
												retailerLink:
													'https://www.dillards.com/p/spanx-undie-tectable-lace-hi-hipster-panty/505165839',
												amzLink: 'https://amazon.com/dp/B00S60YJRQ/',
												promo: '',
												buyPrice: 24,
												sellPrice: 48.5,
												netProfit: 12.37,
												roi: 0.5154166667,
												bsrCurrent: 50703,
												monthlySales: 60,
												competitorType: 'FBA',
												competitorCount: 2,
												variations: 'Size: S, M | Color: Black',
												cashback: '',
												weight: 0.13,
												shipping: 'Free shipping on $150+',
												notes: '',
												img: 'https://m.media-amazon.com/images/I/41Ak5d14o1L.jpg',
												date: '2021-07-22T13:53:00.000Z',
												asin: 'B00S60YJRQ',
											},
										},
									]}
								/>
							</section>
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

AffiliatesPage.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(AffiliatesPage);
