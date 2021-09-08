import React, { useRef } from 'react';

// utils
import { useOutsideMousedown } from '@utils/utils';

type GenericObject = { [key: string]: any };

interface Option {
	type?: string;
	title: string;
	value?: string;
}

interface SelectComponentProps {
	title: string;
	options: Option[];
	selectedOption: string | number;
	openState: boolean;
	setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
	handleClick(obj: GenericObject | string): void;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
	title,
	options,
	selectedOption,
	openState,
	setOpenState,
	handleClick,
}) => {
	// close select handlers
	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, setOpenState, null);

	return (
		<div
			ref={wrapperRef}
			className='relative flex items-center shadow-sm rounded-lg text-sm'
		>
			<div className='w-16 py-2 px-2 bg-gray-100 rounded-l-lg font-semibold text-center text-gray-700 border border-gray-200'>
				{title}
			</div>
			<button
				type='button'
				className='relative w-full pl-2 pr-10 py-2 bg-white border-t border-b border-r border-gray-200 rounded-r-lg text-left cursor-default ring-purple ring-inset'
				aria-haspopup='listbox'
				aria-expanded='true'
				aria-labelledby='listbox-label'
				onClick={() => (openState ? setOpenState(false) : setOpenState(true))}
			>
				<span className='flex items-center'>
					<span className='ml-2 block truncate'>{selectedOption}</span>
				</span>
				<span className='ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
					<svg
						className='h-4 w-4 text-gray-400'
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'
						fill='currentColor'
						aria-hidden='true'
					>
						<path
							fillRule='evenodd'
							d='M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
							clipRule='evenodd'
						/>
					</svg>
				</span>
			</button>
			{openState && (
				<ul
					className='absolute top-0 right-0 z-10 max-h-56 w-full mt-1 py-1 bg-white border border-gray-200 shadow-md rounded-lg text-sm overflow-auto focus:outline-none transform translate-y-10 minimal-scrollbar'
					tabIndex={-1}
					role='listbox'
					aria-labelledby='listbox-label'
					aria-activedescendant='listbox-option-3'
				>
					{options.map((option, i) => (
						<li
							key={i}
							className={`py-2 pl-3 pr-9 cursor-default select-none relative ${
								selectedOption === option.title
									? 'bg-purple-500 hover:bg-purple-600 text-white'
									: 'bg-white hover:bg-gray-100 text-gray-900'
							}`}
							id={`listbox-option-${i}`}
							role='option'
							aria-selected='true'
							onClick={() => {
								handleClick(option);
								setOpenState(false);
							}}
						>
							{option.title}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SelectComponent;
