const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

const LeadSchema = new Schema({
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
			default: Date.now,
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

LeadSchema.plugin(mongoose_fuzzy_searching, {
	fields: [{ name: 'data', keys: ['source', 'title', 'brand', 'asin'] }],
});

module.exports = Lead = mongoose.model('lead', LeadSchema);
