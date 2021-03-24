import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { getSearchResults, getAllLeads } from '../../../redux/actions/leads';
import { useLocation } from 'react-router-dom';

import { DateTime } from 'luxon';
import { CSVLink } from 'react-csv';

import Button from '../formField/Button';
import { Redirect } from 'react-router';
import { setAlert } from '../../../redux/actions/alert';

const Header = ({
	user,
	feed,
	exporting,
	title,
	getSearchResults,
	getAllLeads,
}) => {
	// search helpers
	const [search, setSearch] = useState('');
	const onSearchChange = (e) => {
		setSearch(e.target.value);
	};

	const location = useLocation();
	const [redirect, setRedirect] = useState(false);
	const handleSearchSubmit = async (e) => {
		e.preventDefault();
		if (location.pathname !== '/search') {
			setRedirect(true);
		}
		getSearchResults(search);
	};

	const currentLocalDate = DateTime.now().setLocale('el').toLocaleString();

	const tools = [
		{
			text: 'Filters',
			path: (
				<path
					fillRule='evenodd'
					d='M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z'
					clipRule='evenodd'
				/>
			),
		},
		{
			text: 'Inventory',
			path: (
				<path
					fillRule='evenodd'
					d='M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z'
					clipRule='evenodd'
				/>
			),
		},
	];

	const [exportLeads, setExportLeads] = useState(false);
	const handleExport = async () => {
		try {
			getAllLeads(user);
			setExportLeads(true);
		} catch (error) {
			setAlert('Error exporting leads, please try again', 'danger');
		}
	};

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

	if (redirect) {
		return <Redirect to={{ pathname: '/search', search: `?q=${search}` }} />;
	}

	return (
		<header className='border-b border-gray-200'>
			<div className='flex justify-between pb-2 container'>
				<div className='flex items-center'>
					<h1 className='text-3xl text-gray-900 font-bold'>
						{title || 'Leads'}
					</h1>
				</div>
				<div className='ml-32 w-full flex items-center justify-end text-gray-300'>
					<div className='w-48 relative z-0 text-gray-400'>
						<form
							action='/search'
							method='GET'
							onSubmit={(e) => handleSearchSubmit(e)}
						>
							<input
								type='text'
								name='q'
								placeholder='Search...'
								onChange={onSearchChange}
								className='py-2 pl-10 w-full rounded-lg text-sm text-gray-500 placeholder-gray-400 transition-all duration-100 ease-in-out focus:outline-none hover:shadow-outline focus:shadow-outline'
							/>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='mt-2 ml-3 absolute top-0 left-0 h-4 w-4'
							>
								<path
									fillRule='evenodd'
									d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
									clipRule='evenodd'
								/>
							</svg>
						</form>
					</div>
					{tools.map((tool, i) => (
						<Button key={i} text={tool.text} path={tool.path} />
					))}
					{!exportLeads && (
						<Button
							text='Export'
							path={
								<path
									fillRule='evenodd'
									d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
									clipRule='evenodd'
								/>
							}
							onClick={handleExport}
						/>
					)}

					{exportLeads && (
						<CSVLink
							data={feed}
							headers={headers}
							onClick={() => setExportLeads(false)}
							filename={`${
								user.role || 'leadgeek'
							}_plan_leads_${currentLocalDate}.csv`}
							target='_blank'
							className='ml-4 py-2 px-3 flex items-center rounded-lg bg-purple-500 text-white shadow-sm hover:shadow-md text-sm font-semibold hover:bg-purple-600 transition-all duration-100 ease-in-out focus:outline-none focus:shadow-outline'
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
					)}
				</div>
			</div>
		</header>
	);
};

const mapStateToProps = (state, ownProps) => {
	const { user } = state.auth;
	const { feed, loading, exporting } = state.leads;
	const { title } = ownProps;
	return { user, feed, loading, exporting, title };
};

export default connect(mapStateToProps, { getSearchResults, getAllLeads })(
	Header
);
