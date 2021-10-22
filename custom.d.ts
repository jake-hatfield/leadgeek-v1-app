declare module 'mongoose-fuzzy-searching';
declare module 'luxon-business-days';
declare module '@mailchimp/mailchimp_marketing';
declare module 'stripe' {
	namespace Stripe {
		interface TypedEventData<T> extends Stripe.Event.Data {
			object: T extends Stripe.Plan;
			previous_attributes?: Partial<T>;
		}
	}
}
