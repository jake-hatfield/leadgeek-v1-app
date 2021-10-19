// packages
import { Document, model, Model, ObjectId, Schema } from 'mongoose';
import mongoose_fuzzy_searching from 'mongoose-fuzzy-searching';

import { ILead } from 'types/Lead';
import { Filter } from 'types/Filter';

export interface ILeadDocument extends ILead, Document {
	_id: ObjectId;
	fuzzySearch(query: any): any;
}

interface ILeadModel extends Model<ILeadDocument> {
	buildQuery(query: any, filters: Filter[]): any;
	fuzzySearch(query: any, filters?: any): any;
}

const LeadSchema: Schema<ILeadDocument> = new Schema({
	data: {
		source: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		retailerLink: {
			type: String,
			required: true,
		},
		amzLink: {
			type: String,
			required: true,
		},
		buyPrice: {
			type: Number,
			required: true,
		},
		sellPrice: {
			type: Number,
			required: true,
		},
		netProfit: {
			type: Number,
			required: true,
		},
		roi: {
			type: Number,
			required: true,
		},
		monthlySales: {
			type: Number,
			required: true,
		},
		bsrCurrent: {
			type: Number,
			required: true,
		},
		bsr30: {
			type: Number,
			default: null,
		},
		bsr90: {
			type: Number,
			default: null,
		},
		category: {
			type: String,
			required: true,
		},
		price30: {
			type: Number,
			default: null,
		},
		price90: {
			type: Number,
			default: null,
		},
		brand: {
			type: String,
			required: true,
		},
		weight: {
			type: Number,
			required: true,
		},
		asin: {
			type: String,
			required: true,
		},
		promo: {
			type: String,
		},
		cashback: {
			type: String,
		},
		competitorType: {
			type: String,
			required: true,
		},
		competitorCount: {
			type: Number,
		},
		shipping: {
			type: String,
		},
		variations: {
			type: String,
		},
		notes: {
			type: String,
		},
		img: { type: String, required: true },
		date: {
			type: Date,
			default: new Date(),
		},
	},
	plan: [
		{
			type: String,
			enum: ['bundle', 'pro', 'grow'],
			required: true,
		},
	],
});

LeadSchema.static(
	'buildQuery',
	(baselineQueryParams: {}[], filters: Filter[]) => {
		// baseline query should include role and date params
		let query: any = {
			$and: [...baselineQueryParams],
			$or: [],
		};

		// map through filters and assign to query
		for (var i = 0; i < filters.length; i++) {
			let filter = filters[i];
			if (filter.format === 'numeric') {
				query.$and.push({
					[`data.${[filter.type]}`]: {
						[`$${[filter.operator]}`]: filter.value,
					},
				});
			} else {
				query.$or.push({
					[`data.${[filter.type]}`]: {
						[`$eq`]: filter.value,
					},
				});
			}
		}

		// $and and $or can't be empty arrays, so remove them from the object before querying if they are
		Object.keys(query).forEach((k) => query[k].length === 0 && delete query[k]);

		return query;
	}
);

LeadSchema.plugin(mongoose_fuzzy_searching, {
	fields: [{ name: 'data', keys: ['source', 'title', 'brand', 'asin'] }],
});

const Lead = model<ILeadDocument, ILeadModel>('Lead', LeadSchema);

export default Lead;
