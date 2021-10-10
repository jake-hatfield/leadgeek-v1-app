export interface INotification {
	title: string;
	description: string;
	date: Date;
	externalLink: string | null;
	internalLink: string | null;
	clearable: boolean;
}
