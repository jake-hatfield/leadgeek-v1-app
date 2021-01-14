const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
	date: {
		type: Date,
		default: Date.now,
	},
	customerId: {
		type: String,
		required: true,
		unique: true,
	},
	subId: {
		type: String,
		required: true,
	},
	resetPasswordToken: {
		type: String,
		default: null,
	},
	resetPasswordExpires: {
		type: Date,
		default: null,
	},
});

module.exports = User = mongoose.model('user', UserSchema);
