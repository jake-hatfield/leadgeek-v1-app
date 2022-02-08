import React from 'react';

import { DateTime } from 'luxon';
import { CSVLink } from 'react-csv';

import { User } from '@utils/interfaces/User';
import { Lead } from '@utils/interfaces/Lead';

interface ExportButtonProps {
	user: User;
	leads: Lead[];
	setExportLeads: any;
	headers: { label: string; key: string }[];
}

const ExportButton: React.FC<ExportButtonProps> = ({
	user,
	leads,
	setExportLeads,
	headers,
}) => {
	// set current local time
	const currentLocalDate = DateTime.now().setLocale('el').toLocaleString();

	return (
		<CSVLink
			data={leads}
			headers={headers}
			onClick={() => setExportLeads(false)}
			filename={`${user.role || 'leadgeek'}_plan_leads_${currentLocalDate}.csv`}
			target='_blank'
			className='ml-4 py-2 px-3 flex items-center rounded-main cs-purple shadow-sm hover:shadow-md text-sm font-semibold transition-main ring-purple'
		>
			<span>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
					className='svg-sm'
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

export default ExportButton;
