import { ObjectId } from 'mongoose';

export type Roles =
	| 'user'
	| 'grow'
	| 'pro'
	| 'bundle'
	| 'affiliate'
	| 'admin'
	| 'master';

export interface IUser {
	name: string;
	email: string;
	password: string;
	dateCreated: Date;
	lastLoggedIn: number;
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
	resetPwExpires: number | null;
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
		date: string;
		leadId: string;
		comment: string;
	}[];
	notifications: {
		_id: ObjectId;
	}[];
}
