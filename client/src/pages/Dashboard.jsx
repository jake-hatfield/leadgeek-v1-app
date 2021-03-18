import React from 'react';

const Dashboard = () => {
	// // array helpers
	// const filteredLeads = (array) => {
	// 	array.filter((lead) => {
	// 		return lead.data.title.toLowerCase().includes(search.toLowerCase());
	// 	});
	// };
	// const setActiveArray = () => {
	// 	if (activeLeadNav === 'Liked') {
	// 		return filteredLeads(user.liked);
	// 	} else if (activeLeadNav === 'Archived') {
	// 		return filteredLeads(user.archived);
	// 	} else return filteredLeads(user.feed);
	// };
	// const arrayChooser = () => setActiveArray();
	// // average data helpers
	// const average = (total, array) =>
	// 	Math.round((total / array.length + Number.EPSILON) * 100) / 100;
	// const totalProfit = arrayChooser().reduce(
	// 	(acc, { netProfit }) => acc + netProfit,
	// 	0
	// );
	// const totalROI = arrayChooser().reduce((acc, { roi }) => acc + roi, 0);
	// const totalSales = arrayChooser().reduce(
	// 	(acc, { monthlySales }) => acc + monthlySales,
	// 	0
	// );
	// const totalBSR = arrayChooser().reduce(
	// 	(acc, { bsrCurrent }) => acc + bsrCurrent,
	// 	0
	// );
	// averages
	// const averages = [
	// 	{
	// 		title: 'Net Profit',
	// 		average: average(totalProfit, arrayChooser()).toFixed(2),
	// 		path: (
	// 			<g>
	// 				<path
	// 					strokeLinecap='round'
	// 					strokeLinejoin='round'
	// 					strokeWidth={2}
	// 					d='M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z'
	// 				/>
	// 				<path
	// 					strokeLinecap='round'
	// 					strokeLinejoin='round'
	// 					strokeWidth={2}
	// 					d='M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z'
	// 				/>
	// 			</g>
	// 		),
	// 	},
	// 	{
	// 		title: 'Net ROI',
	// 		average: average(totalROI, arrayChooser()) * 100,
	// 		path: (
	// 			<g>
	// 				<path
	// 					strokeLinecap='round'
	// 					strokeLinejoin='round'
	// 					strokeWidth={2}
	// 					d='M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z'
	// 				/>
	// 				<path
	// 					strokeLinecap='round'
	// 					strokeLinejoin='round'
	// 					strokeWidth={2}
	// 					d='M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z'
	// 				/>
	// 			</g>
	// 		),
	// 	},
	// 	{
	// 		title: 'Sales / mo',
	// 		average: average(totalSales, arrayChooser()).toFixed(0),
	// 		path: (
	// 			<path
	// 				strokeLinecap='round'
	// 				strokeLinejoin='round'
	// 				strokeWidth={2}
	// 				d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
	// 			/>
	// 		),
	// 	},
	// 	{
	// 		title: 'BSR',
	// 		average: numberWithCommas(average(totalBSR, arrayChooser()).toFixed(0)),
	// 		path: (
	// 			<path
	// 				strokeLinecap='round'
	// 				strokeLinejoin='round'
	// 				strokeWidth={2}
	// 				d='M13 10V3L4 14h7v7l9-11h-7z'
	// 			/>
	// 		),
	// 	},
	// ];
	return (
		<div>
			{/* convert to component later */}
			{/* <Averages averages={averages} filteredLeads={arrayChooser()} /> */}
		</div>
	);
};

export default Dashboard;
