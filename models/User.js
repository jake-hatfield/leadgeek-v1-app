const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	dateCreated: {
		type: Date,
		default: Date.now,
	},
	lastLogin: {
		type: Date,
		required: true,
		default: null,
	},
	subscription: {
		cusId: {
			type: String,
			required: true,
			unique: true,
		},
		subIds: [
			{
				id: { type: String, required: true, unique: true },
				active: { type: Boolean, required: true },
			},
		],
		planIds: [
			{
				type: String,
				required: true,
			},
		],
	},
	billing: {
		paymentMethod: {
			type: String,
			required: true,
			unique: true,
		},
		last4: {
			type: String,
			required: true,
		},
		brand: {
			type: String,
			required: true,
		},
	},
	resetPwToken: {
		type: String,
		default: null,
		unique: true,
	},
	resetPwExpires: {
		type: Date,
		default: null,
	},
	role: {
		type: String,
		enum: ['user', 'grow', 'pro', 'bundle', 'admin'],
		default: 'user',
		required: true,
	},
	likedLeads: [
		{
			leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
		},
	],
	archivedLeads: [
		{
			leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
		},
	],
	unviewedLeads: [
		{
			leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
		},
	],
});

module.exports = User = mongoose.model('user', UserSchema);
