import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// redux
import { connect } from 'react-redux';
import {
	viewLead,
	handleLikeLead,
	setCurrentLead,
} from '../../redux/actions/leads';
// utils
import { truncate, numberWithCommas, calculateBSR } from '../../utils/utils';
const LeadRow = ({
	lead,
	viewLead,
	handleLikeLead,
	showDetails,
	setShowDetails,
	setCurrentLead,
	user,
}) => {
	const { data } = lead;
	// event handlers
	const [like, setLike] = useState(false);
	const [newLead, setNewLead] = useState(false);
	useEffect(() => {
		// set unviewed status
		if (user.unviewedLeads.some((l) => l._id === lead._id)) {
			setNewLead(true);
		}
		// set like status
		for (let i = 0; i < user.likedLeads.length; i++) {
			if (user.likedLeads[i]._id === lead._id) {
				setLike(true);
				break;
			}
		}
	}, [user]);
	// link opener
	const openBothLinks = (e, sourceLink, amzLink) => {
		e.preventDefault();
		window.open(sourceLink);
		window.open(amzLink);
	};
	return (
		<tr
			className='border-b border-gray-200 hover:bg-gray-100 transition-all duration-100 cursor-pointer'
			onClick={() => {
				newLead && setNewLead(false);
				setShowDetails(!showDetails);
				viewLead(user._id, lead._id);
				setCurrentLead(lead);
			}}
		>
			<td className='p-2'>
				{newLead && (
					<span className='h-4 w-4 flex items-center justify-center rounded-full bg-teal-200'>
						<span className='h-2 w-2 inline-block rounded-full bg-teal-400' />
					</span>
				)}
			</td>
			<td className='p-2 text-center text-gray-400'>
				<button
					onClick={(e) => {
						e.stopPropagation();
						newLead && setNewLead(false);
						setLike(!like);
						handleLikeLead(user._id, lead._id);
						viewLead(user._id, lead._id);
					}}
					className='rounded-md focus:outline-none focus:shadow-outline align-middle'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill={`${like ? '#5d55fa' : 'none'}`}
						viewBox='0 0 24 24'
						stroke={`${like ? '#5d55fa' : 'currentColor'}`}
						className='h-6 w-6 hover:text-purple-400 transition-colors duration-100 ease-in-out'
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
			<td className='p-2 font-semibold'>{truncate(data.title, 28)}</td>
			<td className='p-2'>{truncate(data.category, 28)}</td>
			<td className='p-2'>
				<span>$</span>
				{data.netProfit.toFixed(2)}
				<span className='ml-1 text-gray-400 font-semibold uppercase'>USD</span>
			</td>
			<td className='p-2'>
				{(data.roi.toFixed(2) * 100).toFixed(0)}
				<span className='ml-1 text-gray-400 font-semibold'>%</span>
			</td>
			<td className='p-2'>
				{numberWithCommas(data.bsrCurrent)}
				<span className='ml-1 text-gray-400 font-normal'>
					({calculateBSR(data.bsrCurrent, data.category)})
					<span className='ml-1 text-gray-400 font-semibold'>%</span>
				</span>
			</td>
			<td className='p-2'>{numberWithCommas(data.monthlySales)}</td>
			<td className='p-2'>{numberWithCommas(data.monthlySales)}</td>
			<td className='p-2'>
				<button
					onClick={(e) => {
						e.stopPropagation();
						openBothLinks(e, data.sourceLink, data.amzLink);
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
	);
};

LeadRow.propTypes = {
	viewLead: PropTypes.func.isRequired,
	setCurrentLead: PropTypes.func.isRequired,
};

export default connect(null, {
	viewLead,
	handleLikeLead,
	setCurrentLead,
})(LeadRow);
