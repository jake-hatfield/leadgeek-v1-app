const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	leads: [
		{
			leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
			viewed: { type: Boolean, default: false, required: true },
			liked: { type: Boolean, default: false, required: true },
			archived: { type: Boolean, default: false, required: true },
		},
	],
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
