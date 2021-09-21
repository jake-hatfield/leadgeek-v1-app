export interface Alert {
	id: string;
	title: string;
	message: string;
	alertType: 'success' | 'warning' | 'danger' | null;
	visible: boolean;
}
