import { ObjectId } from 'mongoose';

export type Roles =
	| 'user'
	| 'bundle'
	| 'pro'
	| 'grow'
	| 'bundle_2'
	| 'pro_2'
	| 'grow_2'
	| 'affiliate'
	| 'admin'
	| 'master';

export interface IUser {
	name: string;
	email: string;
	password: string;
	dateCreated: Date;
	lastLoggedIn: Date;
	subscription: {
		cusId?: string;
		subIds: {
			id: string | null;
			active?: boolean;
		}[];
		planIds: string[];
	};
	billing: {
		paymentMethod: string | null;
		last4?: string;
		brand?: string;
	};
	resetPwToken: string | null;
	resetPwExpires: Date | null;
	role: Roles;
	referrals: {
		referred: {
			wasReferred: boolean;
			referrerlgid: string | null;
		};
		referrer: {
			isReferrer: boolean;
			lgid: string | null;
			paypalEmail: string | null;
			dateCreated: Date;
			clients: { userId: string; cusId: string }[];
		};
	};
	likedLeads: { _id: ObjectId }[];
	archivedLeads: { _id: ObjectId }[];
	comments: {
		date: Date;
		leadId: string;
		comment: string;
	}[];
	notifications: {
		_id: ObjectId;
	}[];
}
