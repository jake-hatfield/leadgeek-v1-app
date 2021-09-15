export interface Lead {
	_id: string;
	data: {
		source: string;
		title: string;
		retailerLink: string;
		amzLink: string;
		buyPrice: number;
		sellPrice: number;
		netProfit: number;
		roi: number;
		monthlySales: number;
		bsrCurrent: number;
		bsr30: number;
		bsr90: number;
		category: string;
		price30: number;
		price90: number;
		brand: string;
		weight: number;
		asin: string;
		promo: string;
		cashback: string;
		competitorType: string;
		competitorCount: number;
		shipping: string;
		variations: string;
		notes: string;
		img: string;
		date: string;
	};
	plan: 'bundle' | 'pro' | 'grow'[];
}

export type LeadTypes = 'feed' | 'liked' | 'archived' | 'search';
