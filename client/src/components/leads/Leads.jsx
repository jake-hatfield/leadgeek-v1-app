import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { clearDetailedLead } from '../../redux/actions/leads';

import LeadTable from './LeadTable';
import Details from './details/Details';
import Pagination from '../layout/navigation/Pagination';

const Leads = ({
	leads,
	pagination,
	type,
	user,
	currentLead,
	authLoading,
	leadLoading,
	clearDetailedLead,
}) => {
	// search helpers
	const [search, setSearch] = useState('');
	const onSearchChange = (e) => {
		setSearch(e.target.value);
	};
	// toggle additional information
	const [showDetails, setShowDetails] = useState(false);
	return (
		!authLoading &&
		user && (
			<Fragment>
				<section className='my-6 lg:my-10 relative container flex'>
					<section className='w-full'>
						<header className='ml-20 flex items-center justify-between'>
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
								<button className='py-3 px-4 flex items-center rounded-md text-sm font-semibold hover:bg-purple-100 hover:text-purple-600 transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 20 20'
										fill='currentColor'
										className='h-4 w-4'
									>
										<path
											fillRule='evenodd'
											d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 k0 010-1.414z'
											clipRule='evenodd'
										/>
									</svg>
									<span className='ml-2'>Export</span>
								</button>
							</div>
						</header>
						<LeadTable
							leads={leads}
							loading={leadLoading}
							showDetails={showDetails}
							setShowDetails={setShowDetails}
							user={user}
						/>
						<Pagination pagination={pagination} type={type} />
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
		)
	);
};

const mapStateToProps = (state, ownProps) => {
	const { leads, pagination } = ownProps;
	const { user, loading: authLoading } = state.auth;
	const { currentLead, page, loading: leadLoading } = state.leads;
	return {
		leads,
		pagination,
		user,
		authLoading,
		currentLead,
		page,
		leadLoading,
	};
};

export default connect(mapStateToProps, {
	clearDetailedLead,
})(Leads);
