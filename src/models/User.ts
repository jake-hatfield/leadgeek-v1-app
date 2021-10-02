import { Document, model, Model, ObjectId, Schema } from 'mongoose';

import { IUser } from 'types/User';

export interface IUserDocument extends IUser, Document {}

interface IUserModel extends Model<IUserDocument> {
	_id: ObjectId;
}

const UserSchema: Schema<IUserDocument> = new Schema({
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
		default: null,
	},
	subscription: {
		cusId: {
			type: String,
		},
		subIds: [
			{
				id: { type: String, default: null },
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
			default: null,
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
	},
	resetPwExpires: {
		type: Number,
		default: null,
	},
	role: {
		type: String,
		enum: ['user', 'grow', 'pro', 'bundle', 'affiliate', 'admin', 'master'],
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
				default: null,
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
				default: null,
				unique: true,
			},
			paypalEmail: {
				type: String,
				unique: true,
				default: null,
			},
			dateCreated: {
				type: Date,
			},
			clients: [
				{
					userId: { type: Schema.Types.ObjectId, ref: 'User' },
					cusId: {
						type: String,
						unique: true,
					},
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
	comments: [
		{
			date: { type: Date, default: Date.now() },
			leadId: { type: String, required: true },
			comment: { type: String },
		},
	],
});

const User = model<IUserDocument, IUserModel>('User', UserSchema);

export default User;
