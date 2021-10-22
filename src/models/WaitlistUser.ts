import { Document, model, Model, ObjectId, Schema } from 'mongoose';

import { IWaitlistUser } from 'types/WaitlistUser';

export interface IWaitlistUserDocument extends IWaitlistUser, Document {}

interface IWaitlistUserModel extends Model<IWaitlistUserDocument> {
	_id: ObjectId;
}

const WaitlistUserSchema: Schema<IWaitlistUserDocument> = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		dateCreated: {
			type: Date,
			default: new Date(),
		},
		plans: [
			{
				type: {
					type: String,
					required: true,
				},
				active: {
					type: Boolean,
					required: true,
					default: true,
				},
			},
		],
		active: { type: Boolean },
	},
	{ collection: 'waitlist' }
);

const WaitlistUser = model<IWaitlistUserDocument, IWaitlistUserModel>(
	'WaitlistUser',
	WaitlistUserSchema
);

export default WaitlistUser;
