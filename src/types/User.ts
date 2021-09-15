import { Types, ObjectId } from 'mongoose';

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
	lastLoggedIn: Date;
	subscription: {
		cusId?: string;
		subIds: Types.Array<{
			id: string | null;
			active?: boolean;
		}>;
		planIds: Types.Array<string>;
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
			clients: Types.Array<{ userId: string; cusId: string }>;
		};
	};
	likedLeads: Types.Array<{ _id: ObjectId }>;
	archivedLeads: Types.Array<{ _id: ObjectId }>;
	comments: Types.Array<{
		date: string;
		leadId: string;
		comment: string;
	}>;
}
