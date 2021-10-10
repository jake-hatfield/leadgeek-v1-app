export type FilterTypes =
	| 'netProfit'
	| 'buyPrice'
	| 'sellPrice'
	| 'roi'
	| 'bsrCurrent'
	| 'monthlySales'
	| 'weight'
	| 'category'
	| 'source';

export type FilterTitles =
	| 'Profit'
	| 'Buy price'
	| 'Sell price'
	| 'Return on investment'
	| "Best seller's rank"
	| 'Monthly sales'
	| 'Weight'
	| 'Category'
	| 'Source';

export type FilterOperators = 'gte' | 'lte' | 'eq';

export interface Filter {
	id: string;
	format: 'numeric' | 'text';
	type: FilterTypes;
	title: FilterTitles;
	operator: FilterOperators;
	value: string | number;
}

export interface FilterState {
	count: number;
	filters: Filter[];
	prep: {
		unit: number | null;
		lb: number | null;
	};
	itemLimit: number;
	dateLimits: {
		min: string | null;
		max: string | null;
		selected: string | null;
	};
}
