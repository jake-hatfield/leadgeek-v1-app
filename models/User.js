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
	// billing: {
	// 	cusId: {
	// 		type: String,
	// 		required: true,
	// 		unique: true,
	// 	},
	// 	subId: [
	// 		{
	// 			type: Object,
	// 			required: true,
	// 		},
	// 	],
	// 	planId: [
	// 		{
	// 			type: String,
	// 			required: true,
	// 		},
	// 	],
	// 	paymentMethod: {
	// 		type: Object,
	// 		required: true,
	// 	},
	// },
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
		enum: ['user', 'grow_1', 'pro_1', 'bundle_1', 'admin'],
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
