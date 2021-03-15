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
	lastLoggedIn: {
		type: Date,
		required: true,
		default: null,
	},
	customerId: {
		type: String,
		required: true,
		unique: true,
	},
	subId: [
		{
			type: Object,
			required: true,
		},
	],
	planId: [
		{
			type: String,
			required: true,
		},
	],
	paymentMethod: {
		type: Object,
		required: true,
	},
	resetPasswordToken: {
		type: String,
		default: null,
		unique: true,
	},
	resetPasswordExpires: {
		type: Date,
		default: null,
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
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
