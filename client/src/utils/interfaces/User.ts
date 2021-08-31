export interface User {
	_id: string;
	name: string;
	email: string;
	password?: string;
	role: 'user' | 'grow' | 'pro' | 'bundle' | 'affiliate' | 'admin' | 'master';
	subscription: {
		cusId: string;
		subIds: { id: string; active: boolean }[];
		planIds: string[];
	};
	billing: {
		paymentMethod: string;
		last4: string;
		brand: string;
	};
	resetPwToken: string;
	resetPwExpires: string;
}
