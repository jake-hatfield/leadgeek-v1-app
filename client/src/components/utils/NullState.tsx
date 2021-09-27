import React from 'react';

import { Link } from 'react-router-dom';

import Button from '@components/utils/Button';

interface NullStateProps {
	header: string;
	text: string;
	path: JSX.Element;
	link: string;
	linkText: string;
}

const NullState: React.FC<NullStateProps> = ({
	header,
	text,
	path,
	link,
	linkText,
}) => {
	return (
		<div className={nullStateClasses.nullStateWrapper}>
			<div className={nullStateClasses.svgWrapper}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					className={nullStateClasses.svg}
				>
					{path}
				</svg>
			</div>
			<h3 className='mt-2 font-bold text-lg text-200'>{header}</h3>
			<p className='text-100'>{text}</p>
			{link ? (
				<Link
					to={link}
					className='mt-4 inline-block py-2 px-3 rounded-main shadow-sm hover:shadow-md text-sm font-semibold bg-purple-500 hover:bg-purple-600 text-white transition-main ring-purple'
				>
					{linkText}
				</Link>
			) : (
				<div className='mt-4'>
					<Button
						text={'Reload the page'}
						onClick={() => window.location.reload()}
						width={null}
						margin={false}
						size={'sm'}
						cta={true}
						path={null}
						conditional={null}
						conditionalDisplay={null}
					/>
				</div>
			)}
		</div>
	);
};

const nullStateClasses = {
	nullStateWrapper: 'w-96 card-padding card-200 cs-light-400',
	svgWrapper: 'h-10 w-10',
	svg: 'p-2 bg-gray-900 rounded-lg text-teal-300 shadow-sm',
};

export default NullState;
