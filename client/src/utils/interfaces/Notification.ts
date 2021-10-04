export interface Notification {
	title: string;
	description: string;
	date: string;
	new: boolean;
	externalLink: string | null;
	internalLink: string | null;
}
