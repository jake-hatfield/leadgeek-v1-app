import React from 'react';

import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import { CSVLink } from 'react-csv';

const ExportButton = ({ user, leads, setExportLeads }) => {
	const currentLocalDate = DateTime.now().setLocale('el').toLocaleString();
	const headers = [
		{ label: 'Source', key: 'data.source' },
		{ label: 'Title', key: 'data.title' },
		{ label: 'Brand', key: 'data.brand' },
		{ label: 'Category', key: 'data.category' },
		{ label: 'Retailer Source', key: 'data.retailerLink' },
		{ label: 'Amazon Link', key: 'data.amzLink' },
		{ label: 'Promo Code', key: 'data.promo' },
		{ label: 'Buy Price', key: 'data.buyPrice' },
		{ label: 'Sell Price', key: 'data.sellPrice' },
		{ label: 'Profit', key: 'data.netProfit' },
		{ label: 'ROI', key: 'data.roi' },
		{ label: 'Current BSR', key: 'data.bsrCurrent' },
		{ label: 'Avg Mo. Sales', key: 'data.monthlySales' },
		{ label: '30 Day BSR', key: 'data.bsr30' },
		{ label: '90 Day BSR', key: 'data.bsr90' },
		{ label: 'Seller competition', key: 'data.competitorType' },
		{ label: 'Seller count', key: 'data.competitorCount' },
		{ label: '30 Day Price', key: 'data.price30' },
		{ label: '90 Day Price', key: 'data.price90' },
		{ label: 'Variation Suggestions', key: 'data.variations' },
		{ label: 'Cashback Discounts', key: 'data.cashback' },
		{ label: 'Item Weight (lb)', key: 'data.weight' },
		{ label: 'ASIN', key: 'data.asin' },
		{ label: 'Shipping Notes', key: 'data.shipping' },
		{ label: 'Seller Notes', key: 'data.notes' },
		{ label: 'Date', key: 'data.date' },
	];
	return (
		<CSVLink
			data={leads}
			headers={headers}
			onClick={() => setExportLeads(false)}
			filename={`${user.role || 'leadgeek'}_plan_leads_${currentLocalDate}.csv`}
			target='_blank'
			className='ml-4 py-2 px-3 flex items-center rounded-lg bg-purple-500 text-white shadow-sm hover:shadow-md text-sm font-semibold hover:bg-purple-600 transition duration-100 ease-in-out ring-purple'
		>
			<span>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
					className='h-4 w-4'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
					/>
				</svg>
			</span>
			<span className='ml-2'>Confirm</span>
		</CSVLink>
	);
};

ExportButton.propTypes = {
	user: PropTypes.object.isRequired,
	leads: PropTypes.array.isRequired,
	setExportLeads: PropTypes.func.isRequired,
};

export default ExportButton;
