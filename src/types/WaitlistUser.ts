export interface IWaitlistUser {
	name: string;
	email: string;
	dateCreated: Date;
	plans: { active: boolean; type: 'bundle' | 'pro' | 'grow' }[];
}
