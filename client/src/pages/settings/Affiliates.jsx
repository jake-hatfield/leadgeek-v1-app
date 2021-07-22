import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AuthLayout from 'components/layout/AuthLayout';
import SettingsLayout from 'components/layout/SettingsLayout';
import AffiliateTable from 'components/affiliates/AffiliateTable';
import Spinner from 'components/layout/utils/Spinner';

const Dashboard = ({ auth: { user, loading, isAuthenticated } }) => {
	const [copyText, setCopyText] = useState(false);
	const [copiedText, setCopiedText] = useState('');

	const isAffiliate = (user && user.referrals.referrer.isReferrer) || false;
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
					) : (
						<div className='w-full max-w-3xl'>
							<article className='w-full max-w-md mt-6'>
								<header>
									<h2 className='font-bold text-lg text-gray-800'>
										Your affiliate information
									</h2>
								</header>
								<div className='mt-4'>
									<div className='mt-4 flex items-end justify-between'>
										<h3 className='font-semibold text-gray-900'>Leadgeek ID</h3>
										<div className='flex items-center'>
											<button
												onMouseEnter={() => setCopyText(true)}
												onMouseLeave={() => setCopyText(false)}
												onClick={() => {
													navigator.clipboard.writeText(
														user.referrals.referrer.lgid || ''
													);
													setCopiedText(true);
													setTimeout(function () {
														setCopiedText(false);
													}, 2000);
												}}
												className='p-1 rounded-lg bg-gray-100 text-gray-900 text-sm border border-gray-400 ring-gray'
											>
												LG16H42X
											</button>
										</div>
									</div>
									<div className='mt-4 flex items-end justify-between'>
										<h3 className='font-semibold text-gray-900'>
											Affiliate link
										</h3>
										<div className='flex items-center'>
											<button className='py-2 px-4 rounded-lg text-white text-sm shadow-md bg-purple-500 hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:shadow-outline'>
												Generate unique link
											</button>
										</div>
									</div>
								</div>
							</article>
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
						</div>
					)}
				</section>
			</SettingsLayout>
		</AuthLayout>
	);
};

Dashboard.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(Dashboard);
