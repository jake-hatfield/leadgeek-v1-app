const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeadSchema = new Schema({
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
		required: true,
	},
	bsr90: {
		type: Number,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	brand: {
		type: String,
		required: true,
	},
	weight: {
		type: Number,
	},
	asin: {
		type: String,
	},
	promo: {
		type: String,
	},
	cashback: {
		type: String,
	},
	asin: {
		type: String,
	},
	competitorType: {
		type: String,
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
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Lead = mongoose.model('lead', LeadSchema);
