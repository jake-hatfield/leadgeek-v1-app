import { Lead } from './Lead';
import { Notification } from './Notification';

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
	dateCreated: string;
	lastLoggedIn: string | null;
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
	resetPwExpires: string | null;
	role: Role;
	referrals: {
		referred: {
			wasReferred: boolean;
			referrerlgid: string | null;
		};
		referrer: {
			isReferrer: boolean;
			lgid: string | null;
			paypalEmail: string | null;
			dateCreated?: string;
			clients?: { userId: string; cusId: string }[];
		};
	};
	likedLeads: Lead[];
	archivedLeads: Lead[];
	comments: { date: string; leadId: string; comment: string }[];
	notifications: { _id: string }[];
}
