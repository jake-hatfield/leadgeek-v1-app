import { Filter } from './Filter';

export type Role =
	| 'user'
	| 'grow'
	| 'pro'
	| 'bundle'
	| 'affiliate'
	| 'admin'
	| 'master';

export interface User {
	_id: string;
	name: string;
	email: string;
	password?: string;
	dateCreated: Date;
	lastLoggedIn: Date | null;
	subscription: {
		cusId?: string;
		subIds: { id: string | null; active: boolean }[];
		planIds?: string[];
	};
	billing: {
		paymentMethod: string | null;
		last4?: string;
		brand?: string;
	};
	resetPwToken: string | null;
	resetPwExpires: Date | null;
	role: Role;
	referrals: {
		referred: {
			wasReferred: boolean;
			referrerlgid: string | null;
		};
		referrer: {
			isReferrer: boolean;
			pendingApplication: boolean;
			lgid: string | null;
			paypalEmail: string | null;
			dateCreated?: Date;
			clients?: { userId: string; cusId: string }[];
		};
	};
	likedLeads: { _id: string }[];
	archivedLeads: { _id: string }[];
	comments: { date: Date; leadId: string; comment: string }[];
	notifications: { _id: string }[];
	settings: {
		filterGroups: {
			_id: string;
			title: string;
			filters: Filter[];
		}[];
	};
}
