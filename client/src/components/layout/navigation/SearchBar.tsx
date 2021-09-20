import React from 'react';

interface SearchBarProps {
	placeholder: string | null;
	onSearchChange: any;
	handleSearchSubmit: any;
}

const SearchBar: React.FC<SearchBarProps> = ({
	placeholder,
	onSearchChange,
	handleSearchSubmit,
}) => {
	return (
		<div className='flex items-center justify-end text-gray-300'>
			<div className='w-72 relative z-0 text-gray-600'>
				<form
					action='/search/'
					method='POST'
					onSubmit={(e) => handleSearchSubmit(e)}
				>
					<input
						type='text'
						name='q'
						placeholder={placeholder || 'Enter a search...'}
						onChange={onSearchChange}
						className='py-2 pl-8 w-full rounded-lg border border-gray-200 dark:border-darkGray-100 bg-gray-100 dark:bg-darkGray-500 hover:bg-gray-200 dark:hover:bg-darkGray-400 text-sm placeholder-gray-600 transition duration-100 ease-in-out ring-purple'
					/>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='mt-2.5 ml-2 absolute top-0 left-0 h-4 w-4'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
						/>
					</svg>
				</form>
			</div>
		</div>
	);
};

export default SearchBar;
