import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';

import SideNav from './SideNav';
import LeadTable from './LeadTable';
import Averages from './Averages';
import Details from './Details';

import { clearDetailedLead } from '../../redux/actions/leads';

const Leads = ({
	auth: { loading },
	feed,
	unviewed,
	liked,
	archived,
	currentLead,
	clearDetailedLead,
	getLeads,
}) => {
	// utils
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	// navigation
	const [activeLeadNav, setActiveLeadNav] = useState('Feed');
	// search helpers
	const [search, setSearch] = useState('');
	const onSearchChange = (e) => {
		setSearch(e.target.value);
	};
	// array helpers
	const filteredLeads = (array) =>
		array.filter((lead) => {
			return lead.title.toLowerCase().includes(search.toLowerCase());
		});
	const setActiveArray = () => {
		if (activeLeadNav === 'Liked') {
			return filteredLeads(liked);
		} else if (activeLeadNav === 'Archived') {
			return filteredLeads(archived);
		} else return filteredLeads(feed);
	};
	const arrayChooser = () => setActiveArray();
	// average data helpers
	const average = (total, array) =>
		Math.round((total / array.length + Number.EPSILON) * 100) / 100;
	const totalProfit = arrayChooser().reduce(
		(a, { netProfit }) => a + netProfit,
		0
	);
	const totalROI = arrayChooser().reduce((a, { roi }) => a + roi, 0);
	const totalSales = arrayChooser().reduce(
		(a, { monthlySales }) => a + monthlySales,
		0
	);
	const totalBSR = arrayChooser().reduce(
		(a, { currentBSR }) => a + currentBSR,
		0
	);
	// averages
	const averages = [
		{
			title: 'Net Profit',
			average: average(totalProfit, arrayChooser()).toFixed(2),
			path: (
				<g>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z'
					/>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z'
					/>
				</g>
			),
		},
		{
			title: 'Net ROI',
			average: average(totalROI, arrayChooser()).toFixed(0),
			path: (
				<g>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z'
					/>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z'
					/>
				</g>
			),
		},
		{
			title: 'Sales / mo',
			average: average(totalSales, arrayChooser()).toFixed(0),
			path: (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
				/>
			),
		},
		{
			title: 'BSR',
			average: numberWithCommas(average(totalBSR, arrayChooser()).toFixed(0)),
			path: (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M13 10V3L4 14h7v7l9-11h-7z'
				/>
			),
		},
	];
	// toggle additional information
	const [showDetails, setShowDetails] = useState(false);
	return (
		<Fragment>
			<section className='my-6 lg:my-10 relative container flex'>
				<SideNav
					loading={loading}
					feed={feed}
					unviewed={unviewed}
					liked={liked}
					setActiveLeadNav={setActiveLeadNav}
				/>
				<section className='w-full'>
					<header className='flex items-center justify-between'>
						<div className='relative z-0 w-full xl:w-5/6'>
							<input
								onChange={(e) => onSearchChange(e)}
								type='text'
								placeholder='Search by name, ASIN, store, or any other keyword'
								className='py-3 pl-12 pr-6 w-full rounded-md bg-gray-100 focus:outline-none focus:shadow-outline'
							/>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='mt-3 ml-3 absolute top-0 left-0 h-6 w-6'
							>
								<path
									fillRule='evenodd'
									d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
									clipRule='evenodd'
								/>
							</svg>
						</div>
						<div className='w-1/6 flex justify-end'>
							<button className='py-3 px-4 flex items-center rounded-md text-sm font-semibold focus:outline-none focus:shadow-outline'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 20 20'
									fill='currentColor'
									className='h-4 w-4'
								>
									<path
										fillRule='evenodd'
										d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
										clipRule='evenodd'
									/>
								</svg>
								<span className='ml-2'>Export</span>
							</button>
						</div>
					</header>
					<Averages averages={averages} filteredLeads={arrayChooser()} />
					<LeadTable
						leads={arrayChooser()}
						loading={loading}
						getLeads={getLeads}
						showDetails={showDetails}
						setShowDetails={setShowDetails}
					/>
				</section>
			</section>
			{showDetails && (
				<Details
					clearDetailedLead={clearDetailedLead}
					setShowDetails={setShowDetails}
					currentLead={currentLead}
				/>
			)}
		</Fragment>
	);
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	feed: state.leads.feed,
	unviewed: state.leads.unviewed,
	liked: state.leads.liked,
	archived: state.leads.archived,
	currentLead: state.leads.currentLead,
});

export default connect(mapStateToProps, { clearDetailedLead })(Leads);
