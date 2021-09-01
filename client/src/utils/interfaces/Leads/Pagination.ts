export interface Pagination {
	page: number;
	hasNextPage: boolean | null;
	hasPreviousPage: boolean;
	nextPage: number | null;
	previousPage: number | null;
	lastPage: number | null;
	totalItems: number | null;
	filteredItems: number | null;
}
