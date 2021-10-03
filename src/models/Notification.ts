import { Document, model, Model, ObjectId, Schema } from 'mongoose';

import { INotification } from 'types/Notification';

export interface INotificationDocument extends INotification, Document {}

interface INotificationModel extends Model<INotificationDocument> {
	_id: ObjectId;
}

const NotificationSchema: Schema<INotificationDocument> = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	link: {
		type: String,
		default: null,
	},
});

const Notification = model<INotificationDocument, INotificationModel>(
	'Notification',
	NotificationSchema
);

export default Notification;
