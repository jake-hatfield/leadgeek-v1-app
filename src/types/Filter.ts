export type FilterTypes =
	| 'netProfit'
	| 'buyPrice'
	| 'sellPrice'
	| 'roi'
	| 'bsr'
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
	type: FilterTypes;
	title: FilterTitles;
	operator: FilterOperators;
	value: string | number;
}
