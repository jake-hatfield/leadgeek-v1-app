export interface Notification {
	title: string;
	description: string;
	date: number;
	externalLink: string | null;
	internalLink: string | null;
	clearable: boolean;
}
