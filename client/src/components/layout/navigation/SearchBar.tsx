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
		<div className='flex items-center justify-end'>
			<div className='w-72 relative z-0'>
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
						className='py-2 pl-10 w-full rounded-main border border-300 input text-sm placeholder-gray-700 text-300 transition-main ring-purple'
					/>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='mt-2.5 ml-4 absolute top-0 left-0 svg-sm text-gray-700'
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
