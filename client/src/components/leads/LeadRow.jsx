import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';
import {
	likeLead,
	setLikeStatus,
	unlikeLead,
	showDetailedLead,
} from '../../redux/actions/leads';

const LeadRow = ({
	lead,
	likeLead,
	setLikeStatus,
	unlikeLead,
	showDetails,
	setShowDetails,
	showDetailedLead,
}) => {
	// utils
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	function truncate(str, n) {
		return str.length > n ? str.substr(0, n - 1) + '...' : str;
	}
	const [like, setLike] = useState(false);
	const handleFavorite = (leadId, like, liked) => {
		like || liked ? unlikeLead(leadId) : setLikeStatus(leadId);
	};
	// bsr / category % calculator
	const calculateBSR = (currentRank, category) => {
		let totalItems;
		if (category === 'Appliances') {
			totalItems = 616462;
		} else if (category.includes('Arts')) {
			totalItems = 7498354;
		} else if (category === 'Automotive') {
			totalItems = 22271330;
		} else if (category.includes('Baby')) {
			totalItems = 2969134;
		} else if (category.includes('Beauty')) {
			totalItems = 8918802;
		} else if (category === 'Books') {
			totalItems = 63513871;
		} else if (category.includes('CDs')) {
			totalItems = 5768853;
		} else if (category.includes('Clothing')) {
			totalItems = 115990329;
		} else if (category.includes('Collectibles')) {
			totalItems = 5319325;
		} else if (category.includes('Electronics')) {
			totalItems = 13436282;
		} else if (category.includes('Grocery')) {
			totalItems = 2871202;
		} else if (category.includes('Handmade')) {
			totalItems = 1515790;
		} else if (category.includes('Health')) {
			totalItems = 7528676;
		} else if (category.includes('Home')) {
			totalItems = 59108947;
		} else if (category.includes('Industrial')) {
			totalItems = 9915828;
		} else if (category.includes('Movies')) {
			totalItems = 3426934;
		} else if (category.includes('Musical')) {
			totalItems = 1455860;
		} else if (category.includes('Office')) {
			totalItems = 7746679;
		} else if (category.includes('Patio')) {
			totalItems = 8107431;
		} else if (category.includes('Pet')) {
			totalItems = 4996454;
		} else if (category.includes('Software')) {
			totalItems = 160164;
		} else if (category.includes('Sports')) {
			totalItems = 29519885;
		} else if (category.includes('Tools')) {
			totalItems = 17564272;
		} else if (category.includes('Toys')) {
			totalItems = 8933993;
		} else if (category === 'Video Games') {
			totalItems = 730691;
		}
		let bsrPercentage = ((currentRank / totalItems) * 100).toFixed(3);
		return bsrPercentage;
	};
	// link opener
	const openBothLinks = (e, sourceLink, amzLink) => {
		e.preventDefault();
		window.open(sourceLink);
		window.open(amzLink);
	};
	return (
		<Fragment>
			<tr
				className='rounded-md last:border-none border-b-2 border-gray-100 hover:bg-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer'
				onClick={() => {
					setShowDetails(!showDetails);
					showDetailedLead(lead.id);
				}}
			>
				<td className='pl-2'>
					<span className='h-4 w-4 flex items-center justify-center rounded-full bg-teal-200'>
						<span className='h-2 w-2 inline-block rounded-full bg-teal-400' />
					</span>
				</td>
				<td className='p-2 text-center text-gray-400'>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setLike(!like);
							handleFavorite(lead.id, like, lead.liked);
						}}
						className='rounded-md focus:outline-none focus:shadow-outline align-middle'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill={`${lead.liked || like ? '#5d55fa' : 'none'}`}
							viewBox='0 0 24 24'
							stroke={`${lead.liked || like ? '#5d55fa' : 'currentColor'}`}
							className='h-6 w-6'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
							/>
						</svg>
					</button>
				</td>
				<td className='py-6 flex items-center'>{truncate(lead.title, 28)}</td>
				<td className='pl-6'>{truncate(lead.category, 28)}</td>
				<td className='pl-6 text-gray-600 font-bold text-right'>
					<span>$</span>
					{lead.netProfit.toFixed(2)}
					<span className='ml-1 text-gray-400 font-semibold uppercase'>
						USD
					</span>
				</td>
				<td className='pl-6 text-gray-600 font-bold text-right'>
					{lead.roi}
					<span className='ml-1 text-gray-400 font-semibold'>%</span>
				</td>
				<td className='px-6 text-gray-600 font-bold text-right'>
					{numberWithCommas(lead.currentBSR)}
					<span className='ml-1 text-gray-400 font-normal'>
						({calculateBSR(lead.currentBSR, lead.category)})
						<span className='ml-1 text-gray-400 font-semibold'>%</span>
					</span>
				</td>
				<td className='pr-6 text-gray-600 font-bold text-right'>
					{numberWithCommas(lead.monthlySales)}
				</td>
				<td className='pr-4'>
					<button
						onClick={(e) => {
							e.stopPropagation();
							openBothLinks(e, lead.sourceLink, lead.amzLink);
						}}
						className='ml-2 rounded-md focus:outline-none focus:shadow-outline'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='h-6 w-6 text-gray-400'
						>
							<path d='M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z' />
							<path d='M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z' />
						</svg>
					</button>
				</td>
			</tr>
		</Fragment>
	);
};

LeadRow.propTypes = {
	likeLead: PropTypes.func.isRequired,
	unlikeLead: PropTypes.func.isRequired,
	showDetailedLead: PropTypes.func.isRequired,
	setLikeStatus: PropTypes.func.isRequired,
};

export default connect(null, {
	likeLead,
	setLikeStatus,
	unlikeLead,
	showDetailedLead,
})(LeadRow);
