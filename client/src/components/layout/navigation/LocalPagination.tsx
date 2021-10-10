import React from 'react';

// utils
import { Pagination } from '@utils/interfaces/Pagination';

interface PaginationProps<T, U> {
	items: T[];
	pagination: Pagination;
	setItems: React.Dispatch<React.SetStateAction<U>>;
}

const LocalPaginationComponent = <T, U extends {}>({
	items,
	pagination,
	setItems,
}: PaginationProps<T, U>) => {
	// destructure necessary items
	const {
		page,
		hasNextPage,
		hasPreviousPage,
		nextPage,
		previousPage,
		totalItems,
	} = pagination;

	const itemLimit = 20;

	const itemsFrom =
		previousPage !== null
			? previousPage * itemLimit + 1
			: previousPage && previousPage + 1;
	const itemsTo =
		totalItems && totalItems < page * itemLimit ? totalItems : page * itemLimit;

	const handleDecrementPage = () => {
		setItems((prev: U) => {
			return {
				...prev,
				pageByIds: previousPage
					? items.slice(
							previousPage === 1
								? (previousPage - 1) * itemLimit
								: (previousPage - 1) * itemLimit + 1,
							previousPage * itemLimit
					  )
					: [],
				pagination: {
					page: previousPage,
					hasNextPage: true,
					hasPreviousPage: previousPage && previousPage > 1,
					nextPage: page,
					previousPage: previousPage && previousPage - 1,
					totalItems,
				},
			};
		});
		console.log(
			previousPage && (previousPage - 1) * itemLimit,
			previousPage && previousPage * itemLimit
		);
	};

	const handleIncrementPage = () => {
		setItems((prev: U) => {
			return {
				...prev,
				pageByIds: nextPage
					? items.slice(page * itemLimit + 1, nextPage * itemLimit + 1)
					: [],
				pagination: {
					page: nextPage,
					hasNextPage: nextPage && items.length > nextPage * itemLimit,
					hasPreviousPage: nextPage && nextPage > 1,
					nextPage: nextPage && nextPage + 1,
					previousPage: page,
					totalItems,
				},
			};
		});
	};

	return (
		<article className='mt-8'>
			<div className='flex items-center justify-end py-2 px-4 cs-light-400 rounded-main shadow-md text-100 border border-300'>
				<div className='flex items-center justify-end text-sm'>
					{totalItems ? (
						<div>
							Showing {itemsFrom} to {itemsTo} of {totalItems} results
						</div>
					) : (
						<div />
					)}
					{(hasPreviousPage || hasNextPage) && (
						<nav>
							<button
								onClick={() => hasPreviousPage && handleDecrementPage()}
								className={`${
									hasPreviousPage
										? 'hover:shadow-md hover:text-gray-700 border border-300'
										: 'pointer-events-none bg-gray-200 opacity-50'
								} ${classes.button} ml-8`}
							>
								Previous
							</button>
							<button
								onClick={() => hasNextPage && handleIncrementPage()}
								className={`${
									hasNextPage
										? 'hover:shadow-md hover:text-gray-700 border border-300'
										: 'pointer-events-none bg-gray-200 opacity-50'
								} ${classes.button} ml-4`}
							>
								Next
							</button>
						</nav>
					)}
				</div>
			</div>
		</article>
	);
};

// component classes
const classes = {
	button:
		'py-2 px-3 rounded-lg dark:bg-darkGray-200 dark:hover:bg-darkGray-100 shadow-sm text-sm font-semibold border border-gray-200 dark:border-darkGray-100 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 transition duration-100 ease-in-out ring-purple',
};

export default LocalPaginationComponent;
