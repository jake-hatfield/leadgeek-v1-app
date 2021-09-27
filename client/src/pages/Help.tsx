import React, { Fragment, useEffect, useState } from 'react';

import { DateTime } from 'luxon';

import AuthLayout from '@components/layout/AuthLayout';
import Header from '@components/layout/navigation/Header';
import Spinner from '@components/utils/Spinner';
import { useAppSelector } from '@hooks/hooks';

interface HelpItemProps {
	title: string;
	description: string;
	path: JSX.Element;
	color: string;
	actions: { title: string; link: string; external: boolean }[];
}

const HelpItem: React.FC<HelpItemProps> = ({
	title,
	description,
	path,
	color,
	actions,
}) => {
	return (
		<Fragment>
			<article
				v-for='item in items'
				className='even:border-r even:border-l border-gray-200'
			>
				<div className='p-4 '>
					<div className='flex items-center'>
						<span className={color}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								{path}
							</svg>
						</span>
						<h3 className='ml-2 font-semibold text-gray-900'>{title}</h3>
					</div>
					<p className='mt-2 text-sm text-gray-700'>{description}</p>
					{actions.map((action, i) => (
						<div key={i} className='mt-2'>
							{action.external && (
								<a
									href={action.link}
									target='_blank'
									rel='noopener noreferrer'
									className='link text-purple-500 hover:text-purple-600 rounded-lg transition duration-100 ease-in-out focus:outline-none focus:shadow-outline'
								>
									{action.title}
								</a>
							)}
						</div>
					))}
				</div>
			</article>
		</Fragment>
	);
};

const Help: React.FC = () => {
	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const user = useAppSelector((state) => state.auth.user);
	// local state
	const [currentTime, setCurrentTime] = useState('');

	// set current time on mount (for email timestamp)
	useEffect(() => {
		setCurrentTime(DateTime.now().toLocaleString(DateTime.DATETIME_MED));
	}, []);

	const helpItems = [
		{
			title: 'Support',
			description:
				'Have a question about selling on Amazon? Ask away! Please allow up to 24 hours for a response.',
			path: (
				<path
					fillRule='evenodd'
					d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z'
					clipRule='evenodd'
				/>
			),
			color: 'text-purple-600',
			actions: [
				{
					title: 'Contact support',
					link: 'mailto:support@leadgeek.io',
					external: true,
				},
			],
		},
		{
			title: 'Software',
			description:
				'This software is still in early-access, so we highly encourage you to report bugs or offer feature suggestions. Help us make this better for you!',
			path: (
				<path
					fillRule='evenodd'
					d='M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z'
					clipRule='evenodd'
				/>
			),
			color: 'text-teal-600',
			actions: [
				{
					title: 'Report a bug',
					link: `mailto:software@leadgeek.io?subject=LeadGeek%20Bug%20Report%20${currentTime}`,
					external: true,
				},
				{
					title: 'Suggest a feature',
					link: `mailto:software@leadgeek.io?subject=LeadGeek%20Feature%20Suggestion%20${currentTime}`,
					external: true,
				},
			],
		},
	];

	return (
		<AuthLayout colorTheme={'light'}>
			{status === 'idle' && user ? (
				<section className='mb-6'>
					<div className='pb-4 shadow-md cs-light-400'>
						<Header
							userId={user._id}
							title={'Help panel'}
							searchActive={false}
						/>
					</div>
					<div className='mt-6 container'>
						<div>
							<h2 className='font-semibold text-xl text-gray-900'>Resources</h2>
							<p>
								Use these resources to get help or offer feedback on our
								software.
							</p>
						</div>
						<div className='mt-6 grid grid-cols-3 border-t border-b border-gray-200'>
							{helpItems.map((item, i) => (
								<HelpItem
									key={i}
									title={item.title}
									description={item.description}
									path={item.path}
									color={item.color}
									actions={item.actions}
								/>
							))}
						</div>
					</div>
				</section>
			) : (
				<Spinner
					divWidth={null}
					center={false}
					spinnerWidth={null}
					margin={false}
					text={'Loading Help panel...'}
				/>
			)}
		</AuthLayout>
	);
};

export default Help;
