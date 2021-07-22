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
		default: null,
	},
	subscription: {
		cusId: {
			type: String,
			unique: true,
		},
		subIds: [
			{
				id: { type: String, unique: true },
				active: { type: Boolean },
			},
		],
		planIds: [
			{
				type: String,
			},
		],
	},
	billing: {
		paymentMethod: {
			type: String,
			unique: true,
		},
		last4: {
			type: String,
		},
		brand: {
			type: String,
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
		enum: ['user', 'grow', 'pro', 'bundle', 'admin', 'master'],
		default: 'user',
		required: true,
	},
	referrals: {
		referred: {
			wasReferred: {
				type: Boolean,
				default: false,
			},
			referrerlgid: {
				type: String,
				unique: true,
			},
		},
		referrer: {
			isReferrer: {
				type: Boolean,
				required: true,
				default: false,
			},
			lgid: {
				type: String,
				unique: true,
			},
			dateCreated: {
				type: Date,
			},
			clients: [
				{
					userId: { type: Schema.Types.ObjectId, ref: 'User' },
				},
			],
		},
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
