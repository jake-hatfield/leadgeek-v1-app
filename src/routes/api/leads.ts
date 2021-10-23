// packages
import { Request, Response, Router } from 'express';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { DateTime } from 'luxon-business-days';
import mongoose, { ObjectId } from 'mongoose';

// middleware
import auth from '@middleware/auth';

// models
import Lead, { ILeadDocument } from '@models/Lead';
import User, { IUserDocument } from '@models/User';

// types
import { Filter } from 'types/Filter';
import { ILead } from 'types/Lead';

// router
const router = Router();

// global value
const ITEMS_PER_PAGE = 15;

// @route       POST api/leads/export
// @description Create new leads
// @access      Private
router.post(
	'/export',
	auth,
	async (
		req: Request<{}, {}, { user: { id: string } }>,
		res: Response<{
			message:
				| 'No user found'
				| 'Access prohibited'
				| 'Error connecting to Google Sheets'
				| 'Leads were added to the database'
				| 'There was an error uploading the leads'
				| 'There were no rows to pull from Google Sheets';
		}>
	) => {
		const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID;
		const CLIENT_EMAIL = process.env.REACT_APP_SHEETS_CLIENT_EMAIL;
		const PRIVATE_KEY = process.env.REACT_APP_SHEETS_PRIVATE_KEY.replace(
			/\\n/gm,
			'\n'
		);
		try {
			const { id } = req.body.user;

			const user = await User.findById(id);

			if (!user) {
				return res.status(200).send({
					message: 'No user found',
				});
			}

			if (user.role !== 'master' && user.role !== 'admin') {
				return res.status(401).send({
					message: 'Access prohibited',
				});
			}

			console.log('Connecting to Google Sheets...');
			const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
			await doc.useServiceAccountAuth({
				client_email: CLIENT_EMAIL,
				private_key: PRIVATE_KEY,
			});
			await doc.loadInfo();
			const sheet = await doc.sheetsByIndex[0];
			if (!sheet) {
				return res
					.status(404)
					.send({ message: 'Error connecting to Google Sheets' });
			} else {
				console.log('Sheet found!');
				const rows = await sheet.getRows();
				rows.forEach(async (element, index) => {
					if (element._id === undefined) {
						rows[index]._id = mongoose.Types.ObjectId();
						await rows[index].save();
					}
				});
				const newLeads = rows.map((lead) => ({
					data: {
						source: lead.source,
						title: lead.title,
						brand: lead.brand,
						category: lead.category,
						retailerLink: lead.retailerLink,
						amzLink: lead.amzLink,
						promo: lead.promo,
						buyPrice: +lead.buyPrice,
						sellPrice: +lead.sellPrice,
						netProfit: +lead.netProfit,
						roi: +lead.roi,
						bsrCurrent: +lead.bsrCurrent,
						monthlySales: +lead.monthlySales,
						bsr30: +lead.bsr30,
						bsr90: +lead.bsr90,
						competitorType: lead.competitorType,
						competitorCount: lead.competitorCount,
						price30: +lead.price30,
						price90: +lead.price90,
						variations: lead.variations,
						cashback: lead.cashback,
						weight: +lead.weight,
						shipping: lead.shipping,
						notes: lead.notes,
						img: lead.img,
						date: lead.date || new Date(),
						asin: lead.asin,
					},
					plan: lead.plan.split(','),
					_id: lead._id,
				}));

				let message:
					| 'Leads were added to the database'
					| 'There was an error uploading the leads'
					| 'There were no rows to pull from Google Sheets';

				if (newLeads) {
					try {
						await Lead.insertMany(newLeads);
						message = 'Leads were added to the database';
						console.log(message);
						return res.status(201).send({ message });
					} catch (error) {
						console.log(error);
						message = 'There was an error uploading the leads';
						console.log(message);
						return res.status(200).send({ message });
					}
				} else {
					message = 'There were no rows to pull from Google Sheets';
					console.log(message);
					return res.status(200).send({ message });
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
);

// @route       POST api/leads/feed
// @description Get paginated feed leads by plan and filters
// @access      Private
router.post(
	'/feed',
	auth,
	async (
		req: Request<
			{},
			{},
			{
				user: {
					id: string;
				};
				page: number;
				filters: {
					filters: Filter[];
					dateLimits: {
						min: string;
						max: string;
					};
					itemLimit: number;
				};
			}
		>,
		res: Response<{
			message:
				| 'No user found'
				| 'There are no leads to show'
				| 'Successfully queried feed leads'
				| 'Server error';
			feed: mongoose.LeanDocument<ILeadDocument>[];
			page: number;
			hasNextPage: boolean;
			hasPreviousPage: boolean;
			nextPage: number;
			previousPage: number;
			lastPage: number | null;
			totalItems: number | null;
			filteredItems: number;
			lastUpdated: Date | null;
		}>
	) => {
		try {
			// destructure items from request
			const {
				user: { id },
				page,
				filters: {
					filters: itemFilters,
					dateLimits: { min: minDate, max: maxDate },
					itemLimit,
				},
			} = req.body;

			// lookup user by id
			const user = await User.findById({ _id: id });

			let message:
				| 'No user found'
				| 'There are no leads to show'
				| 'Successfully queried feed leads';

			// no user was found (though shouldn't ever happen)
			if (!user) {
				message = 'No user found';
				console.log(message);
				return res.status(200).send({
					message,
					feed: [],
					page: 1,
					hasNextPage: false,
					hasPreviousPage: false,
					nextPage: 1,
					previousPage: 0,
					lastPage: null,
					totalItems: 0,
					filteredItems: 0,
					lastUpdated: null,
				});
			}

			// lookup active subscriptions
			const activeSub = user.subscription.subIds.filter(
				(sub: { id: string | null; active?: boolean }) => sub.active
			);

			// if no active subscriptions, return
			if (activeSub.length === 0) {
				message = 'There are no leads to show';
				console.log(message);
				return res.status(200).send({
					message,
					feed: [],
					page: 1,
					hasNextPage: false,
					hasPreviousPage: false,
					nextPage: 1,
					previousPage: 0,
					lastPage: null,
					totalItems: 0,
					filteredItems: 0,
					lastUpdated: null,
				});
			}

			// we can proceed getting leads
			console.log('Getting paginated leads...');

			// set role filter
			const roleFilter = [user.role.toString()];

			// declare admin roles and set admin to true if one exists
			const administrativeRoles = ['master', 'admin'];
			if (administrativeRoles.indexOf(user.role) >= 0) {
				roleFilter.push('bundle');
			}

			const now = DateTime.now();

			// set date filter
			const minDateFilter = minDate
				? minDate
				: now.isBusinessDay()
				? now.startOf('day').toISO()
				: now.minusBusiness({ days: 1 }).isBusinessDay()
				? now.minusBusiness({ days: 1 }).toISO()
				: now.minusBusiness({ days: 2 }).toISO();
			const maxDateFilter = maxDate ? maxDate : now.toISO();

			// convert iso to unix timestamp
			const isoToTimestamp = (date: string) => {
				return new Date(date).getTime();
			};

			// set baseline params
			const baselineQueryParams = [
				{ plan: { $in: roleFilter } },
				{ 'data.date': { $gte: isoToTimestamp(minDateFilter) } },
				{ 'data.date': { $lte: isoToTimestamp(maxDateFilter) } },
			];

			// query for total items is just baseline params
			const totalItemQuery: any = {
				$and: [...baselineQueryParams],
			};

			// build feed query
			const feedQuery = Lead.buildQuery(baselineQueryParams, itemFilters);

			const feed = await Lead.find(feedQuery)
				.lean()
				.skip((page - 1) * (itemLimit || ITEMS_PER_PAGE))
				.limit(itemLimit || ITEMS_PER_PAGE)
				.sort({ 'data.date': -1 });

			if (feed.length === 0) {
				message = 'There are no leads to show';
				console.log(message);
				return res.status(200).send({
					message,
					feed,
					page,
					hasNextPage: false,
					hasPreviousPage: false,
					nextPage: 1,
					previousPage: 0,
					lastPage: null,
					totalItems: 0,
					filteredItems: 0,
					lastUpdated: null,
				});
			} else {
				// get the most recent item for date purposes
				const mostRecentItem = await Lead.find()
					.where('plan')
					.in(roleFilter)
					.sort({ 'data.date': -1 })
					.limit(1);
				// get the number of total items
				const totalItems = await Lead.find()
					.lean()
					.countDocuments(totalItemQuery);
				// get the number of filtered items
				const filteredItems = await Lead.find()
					.lean()
					.countDocuments(feedQuery);

				message = 'Successfully queried feed leads';

				console.log(
					`Successfully queried + paginated ${feed.length} of ${totalItems} database leads.`
				);
				return res.status(200).send({
					message,
					feed,
					page,
					hasNextPage: (itemLimit || ITEMS_PER_PAGE) * page < filteredItems,
					hasPreviousPage: page > 1,
					nextPage: page + 1,
					previousPage: page - 1,
					lastPage: Math.ceil(filteredItems / (itemLimit || ITEMS_PER_PAGE)),
					totalItems,
					filteredItems,
					lastUpdated: mostRecentItem[0].data.date,
				});
			}
		} catch (error) {
			console.error(error.message);
			return res.status(500).send({
				message: 'Server error',
				feed: [],
				page: 1,
				hasNextPage: false,
				hasPreviousPage: false,
				nextPage: 1,
				previousPage: 0,
				lastPage: null,
				totalItems: 0,
				filteredItems: 0,
				lastUpdated: null,
			});
		}
	}
);

// @route       POST api/leads/all
// @description Get all leads by plan and type
// @access      Private
router.post(
	'/all',
	auth,
	async (
		req: Request<
			{},
			{},
			{
				user: {
					id: string;
				};
				filters: {
					filters: Filter[];
					dateLimits: {
						min: string;
						max: string;
					};
				};
				type: 'feed' | 'liked' | 'archived' | 'search';
				query?: string;
			}
		>,
		res: Response<{
			message:
				| 'No user found'
				| 'There are no leads to show'
				| 'Successfully queried leads'
				| 'Server error';
			totalByIds: ILeadDocument[];
		}>
	) => {
		try {
			// destructure necessary items
			const {
				user: { id: userId },
				filters: {
					filters: itemFilters,
					dateLimits: { min: minDate, max: maxDate },
				},
				type,
				query,
			} = req.body;

			// lookup user by id
			const user = await User.findById(userId);

			let message:
				| 'No user found'
				| 'There are no leads to show'
				| 'Successfully queried leads';

			// no user was found (though shouldn't ever happen)
			if (!user) {
				message = 'No user found';
				console.log(message);
				return res.status(400).send({ message, totalByIds: [] });
			}

			// declare global variables
			let leads: { _id: ObjectId }[], allLeads;

			// switch on type to export the right leads
			switch (type) {
				case 'liked':
					leads = user.likedLeads.length > 0 ? user.likedLeads : [];
					break;
				case 'archived':
					leads = user.archivedLeads.length > 0 ? user.archivedLeads : [];
					break;
				default:
					leads = [];
			}

			console.log('Getting all leads...');

			// set role filter
			const roleFilter = [user.role.toString()];
			// declare admin roles and set admin to true if one exists
			const administrativeRoles = ['master', 'admin'];
			if (administrativeRoles.indexOf(user.role) >= 0) {
				roleFilter.push('bundle');
			}

			const now = DateTime.now();

			// set date filter
			const minDateFilter = minDate
				? minDate
				: now.isBusinessDay()
				? now.startOf('day').toISO()
				: now.minusBusiness({ days: 1 }).isBusinessDay()
				? now.minusBusiness({ days: 1 }).toISO()
				: now.minusBusiness({ days: 2 }).toISO();
			const maxDateFilter = maxDate ? maxDate : now.toISO();

			// convert iso to unix timestamp
			const isoToTimestamp = (date: string) => {
				return new Date(date).getTime();
			};

			// set baseline params
			const baselineQueryParams: any = [
				{ plan: { $in: roleFilter } },
				{ 'data.date': { $gte: isoToTimestamp(minDateFilter) } },
				{ 'data.date': { $lte: isoToTimestamp(maxDateFilter) } },
			];

			// if the leads variable is not empty, add it to the baseline query parameters
			if (leads.length > 0) {
				baselineQueryParams.push({ _id: { $in: leads } });
			}

			// build all leads query
			const allLeadsQuery = Lead.buildQuery(baselineQueryParams, itemFilters);

			// query leads
			if (type === 'search' && query) {
				allLeads = await Lead.fuzzySearch(
					{
						query,
						prefixOnly: true,
						exact: true,
					},
					baselineQueryParams
				).lean();
			} else {
				allLeads = await Lead.find(allLeadsQuery)
					.lean()
					.sort({ 'data.date': -1 });
			}

			// if the query is an empty array, return
			if (allLeads.length === 0) {
				message = 'There are no leads to show';
				console.log(message);
				return res.status(200).send({ message, totalByIds: [] });
			} else {
				message = 'Successfully queried leads';
				// return with data
				return res.status(200).send({
					message,
					totalByIds: allLeads,
				});
			}
		} catch (error) {
			console.error(error.message);
			return res.status(500).send({ message: 'Server error', totalByIds: [] });
		}
	}
);

// @route       POST api/liked
// @description Send lead ids to populate the liked page
// @access      Private
router.post(
	'/liked',
	auth,
	async (
		req: Request<
			{},
			{},
			{
				leads: ILead[];
				page: number;
				filters: {
					filters: Filter[];
					itemLimit: number;
				};
			}
		>,
		res: Response<{
			message:
				| 'You have not liked any leads'
				| 'Successfully queried liked leads'
				| 'Server error';
			likedLeads: ILeadDocument[];
			page: number;
			hasNextPage: boolean;
			hasPreviousPage: boolean;
			nextPage: number;
			previousPage: number;
			lastPage: number | null;
			totalItems: number | null;
		}>
	) => {
		try {
			// destructure necessary items from request body
			const {
				leads,
				page,
				filters: { filters: itemFilters, itemLimit },
			} = req.body;

			// declare global variables
			let totalItems;

			// set baseline params
			const baselineQueryParams = [{ _id: { $in: leads } }];

			// build liked query
			const likedQuery = Lead.buildQuery(baselineQueryParams, itemFilters);

			// query leads
			const likedLeads = await Lead.find(likedQuery)
				.countDocuments()
				.then((numLeads) => {
					totalItems = numLeads;
					return Lead.find(likedQuery)
						.skip((page - 1) * (itemLimit || ITEMS_PER_PAGE))
						.limit(itemLimit || ITEMS_PER_PAGE)
						.sort({ 'data.date': -1 });
				});

			let message:
				| 'You have not liked any leads'
				| 'Successfully queried liked leads';

			if (likedLeads.length === 0) {
				message = 'You have not liked any leads';
				console.log(message);
			} else {
				message = 'Successfully queried liked leads';
				console.log(message);
			}
			return res.status(200).send({
				message,
				likedLeads,
				page,
				hasNextPage: totalItems
					? (itemLimit || ITEMS_PER_PAGE) * page < totalItems
					: false,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: totalItems
					? Math.ceil(totalItems / (itemLimit || ITEMS_PER_PAGE))
					: null,
				totalItems,
			});
		} catch (error) {
			console.log(error.message);
			return res.status(500).send({
				message: 'Server error',
				likedLeads: [],
				page: 1,
				hasNextPage: false,
				hasPreviousPage: false,
				nextPage: 2,
				previousPage: 0,
				lastPage: 0,
				totalItems: null,
			});
		}
	}
);

// @route       POST api/archived
// @description Send lead ids to populate the archived page
// @access      Private
router.post(
	'/archived',
	auth,
	async (
		req: Request<
			{},
			{},
			{
				leads: ILead[];
				page: number;
				filters: {
					filters: Filter[];
					itemLimit: number;
				};
			}
		>,
		res: Response<{
			message:
				| 'You have not archived any leads'
				| 'Successfully queried archived leads'
				| 'Server error';
			archivedLeads: ILeadDocument[];
			page: number;
			hasNextPage: boolean;
			hasPreviousPage: boolean;
			nextPage: number;
			previousPage: number;
			lastPage: number | null;
			totalItems: number | null;
		}>
	) => {
		try {
			// destructure necessary items from request body
			const {
				leads,
				page,
				filters: { filters: itemFilters, itemLimit },
			} = req.body;

			// declare global variables
			let totalItems;

			// set baseline params
			const baselineQueryParams = [{ _id: { $in: leads } }];

			// build liked query
			const archivedQuery = Lead.buildQuery(baselineQueryParams, itemFilters);

			const archivedLeads = await Lead.find(archivedQuery)
				.countDocuments()
				.then((numLeads) => {
					totalItems = numLeads;
					return Lead.find(archivedQuery)
						.skip((page - 1) * (itemLimit || ITEMS_PER_PAGE))
						.limit(itemLimit || ITEMS_PER_PAGE)
						.sort({ 'data.date': -1 });
				});

			let message:
				| 'You have not archived any leads'
				| 'Successfully queried archived leads';

			if (archivedLeads.length === 0) {
				message = 'You have not archived any leads';
				console.log(message);
			} else {
				message = 'Successfully queried archived leads';
				console.log(message);
			}
			return res.status(200).send({
				message,
				archivedLeads,
				page,
				hasNextPage: totalItems
					? (itemLimit || ITEMS_PER_PAGE) * page < totalItems
					: false,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: totalItems
					? Math.ceil(totalItems / (itemLimit || ITEMS_PER_PAGE))
					: null,
				totalItems,
			});
		} catch (error) {
			console.log(error.message);
			return res.status(500).send({
				message: 'Server error',
				archivedLeads: [],
				page: 1,
				hasNextPage: false,
				hasPreviousPage: false,
				nextPage: 2,
				previousPage: 0,
				lastPage: 0,
				totalItems: null,
			});
		}
	}
);

// @route       POST api/like/leadId
// @description Like/unlike a lead
// @access      Private
const unlikeLead = async (user: IUserDocument, leadId: string) => {
	const updatedLikedArray = user.likedLeads.filter(
		(lead: { _id: ObjectId }) => lead._id.toString() !== leadId.toString()
	);
	console.log('Lead was unliked.');
	user.likedLeads = updatedLikedArray;
	await user.save();
};

const likeLead = async (user: IUserDocument, leadId: string) => {
	const newLead = new Lead({
		_id: mongoose.Types.ObjectId(leadId),
	});

	console.log('Lead was liked.');
	user.likedLeads.push(newLead);
	await user.save();
};

router.post(
	'/like/:leadId',
	auth,
	async (
		req: Request<
			{ leadId: string },
			{},
			{
				user: {
					id: string;
				};
			}
		>,
		res: Response<{
			title: 'Lead was unliked' | 'Lead was liked' | 'Error';
			message: string;
			leads: { _id: ObjectId }[];
		}>
	) => {
		try {
			// destructure necessary items
			const {
				user: { id: userId },
			} = req.body;

			const { leadId } = req.params;

			// find lead in the feed
			const lead = await Lead.findById(leadId);

			if (lead) {
				// find the user's liked leads
				const user = await User.findById(userId);
				const likedLeads = user.likedLeads;
				// check if the lead is already liked
				const indexed = likedLeads
					.map((l) => {
						return l._id.toString();
					})
					.indexOf(leadId);
				if (indexed >= 0) {
					unlikeLead(user, leadId);
					return res.status(200).send({
						title: 'Lead was unliked',
						message: lead.data.title,
						leads: user.likedLeads,
					});
				} else {
					likeLead(user, leadId);
					return res.status(200).send({
						title: 'Lead was liked',
						message: lead.data.title,
						leads: user.likedLeads,
					});
				}
			} else {
				return res.status(404).send({
					title: 'Error',
					message: 'There was an error liking this lead.',
					leads: [],
				});
			}
		} catch (error) {
			console.error(error.message);
			return res
				.status(500)
				.send({ title: 'Error', message: 'Server error', leads: [] });
		}
	}
);

// @route       POST api/archive/leadId
// @description Archive/unarchive a lead
// @access      Private
const unarchiveLead = async (user: IUserDocument, leadId: string) => {
	const updatedArchivedArray = user.archivedLeads.filter(
		(lead: { _id: ObjectId }) => lead._id.toString() !== leadId.toString()
	);
	console.log('Lead was unarchived.');
	user.archivedLeads = updatedArchivedArray;
	await user.save();
};

const archiveLead = async (user: IUserDocument, leadId: string) => {
	const newLead = new Lead({
		_id: mongoose.Types.ObjectId(leadId),
	});

	console.log('Lead was archived.');
	user.archivedLeads.push(newLead);
	await user.save();
};

router.post(
	'/archive/:leadId',
	auth,
	async (
		req: Request<
			{ leadId: string },
			{},
			{
				user: {
					id: string;
				};
			}
		>,
		res: Response<{
			title: 'Lead was archived' | 'Lead was unarchived' | 'Error';
			message: string;
			leads: { _id: ObjectId }[];
		}>
	) => {
		try {
			// destructure necessary items
			const {
				user: { id: userId },
			} = req.body;

			const { leadId } = req.params;

			// find lead in the feed
			const lead = await Lead.findById(leadId);

			if (lead) {
				// find the user's liked leads
				const user = await User.findById(userId);
				const archivedLeads = user.archivedLeads;

				// check if the lead is already liked
				const indexed = archivedLeads
					.map((l) => {
						return l._id.toString();
					})
					.indexOf(leadId);

				if (indexed >= 0) {
					unarchiveLead(user, leadId);
					return res.status(200).send({
						title: 'Lead was unarchived',
						message: lead.data.title,
						leads: user.archivedLeads,
					});
				} else {
					archiveLead(user, leadId);
					return res.status(200).send({
						title: 'Lead was archived',
						message: lead.data.title,
						leads: user.archivedLeads,
					});
				}
			} else {
				return res.status(404).send({
					title: 'Error',
					message: 'There was an error archiving this lead.',
					leads: [],
				});
			}
		} catch (error) {
			console.error(error.message);
			return res
				.status(500)
				.send({ title: 'Error', message: 'Server error', leads: [] });
		}
	}
);

// @route       POST api/comment/leadId
// @description Add a comment to a lead
// @access      Private
router.post(
	'/comment/:leadId',
	auth,
	async (
		req: Request<
			{ leadId: string },
			{},
			{ user: { id: string }; comment: string }
		>,
		res: Response<{
			message:
				| 'Required information is missing'
				| 'Comment was added'
				| 'No user found'
				| 'Server error';
			comments: { leadId: string; comment: string; date: Date }[];
		}>
	) => {
		try {
			// destructure necessary items from request body
			const {
				user: { id: userId },
				comment,
			} = req.body;

			const { leadId } = req.params;

			// if required information is missing, return
			if (!comment || !userId || !leadId) {
				return res
					.status(401)
					.send({ message: 'Required information is missing', comments: [] });
			}

			// declare global variables
			let message: 'Comment was added' | 'No user found';

			// query lead
			const lead = await Lead.findById(leadId);

			// if it exists, see if it already has a comment
			if (lead) {
				const user = await User.findById(userId);
				if (user) {
					const alreadyCommented = user.comments.find(
						(l) => l.leadId.toString() === leadId.toString()
					);

					// build the new comment
					const newComment = {
						leadId,
						comment,
						date: new Date(),
					};

					// if it already has a comment, update it
					if (alreadyCommented) {
						console.log('Overwriting comment...');

						// find the index of it
						const commentIndex = user.comments.findIndex(
							(l) => l.leadId.toString() === leadId.toString()
						);

						// replace it in the array
						user.comments[commentIndex] = newComment;
					} else {
						console.log('Comment does not exist yet...');

						// push the new comment onto the array
						user.comments.push(newComment);
					}

					// save the user document
					await user.save();
					console.log('Comment saved!');

					// return successful
					return res.status(201).send({ message, comments: user.comments });
				} else {
					message = 'No user found';
					return res.status(200).send({ message, comments: [] });
				}
			}
		} catch (error) {
			console.error(error.message);
			return res.status(500).send({ message: 'Server error', comments: [] });
		}
	}
);

// @route       POST api/leads/search
// @description Seach all leads a user has access to
// @access      Private
router.post(
	'/search',
	auth,
	async (
		req: Request<
			{},
			{},
			{
				user: { id: string };
				query: string;
				page: number;
				filters: {
					filters: Filter[];
					dateLimits: {
						min: string;
						max: string;
					};
					itemLimit: number;
				};
			}
		>,
		res: Response
	) => {
		try {
			// destructure necessary items from request body
			const {
				user: { id: userId },
				query,
				page,
				filters: {
					filters: itemFilters,
					dateLimits: { min: minDate, max: maxDate },
					itemLimit,
				},
			} = req.body;

			// lookup user by id
			const user = await User.findById(userId);

			// no user was found (though shouldn't ever happen)
			if (!user) {
				let message = 'No user found';
				console.log(message);
				return res.status(400).send({ status: 'failure', message });
			}

			// we can proceed getting leads
			console.log('Searching for query matches...');

			// set role filter
			const roleFilter = [user.role.toString()];
			// declare admin roles and set admin to true if one exists
			const administrativeRoles = ['master', 'admin'];
			if (administrativeRoles.indexOf(user.role) >= 0) {
				roleFilter.push('bundle');
			}

			// set date filter
			const fromJSDate = DateTime.fromJSDate(user.dateCreated);
			const userDayCreated = fromJSDate.startOf('day').toISO();
			const minDateFilter = minDate ? minDate : userDayCreated;
			const maxDateFilter = maxDate ? maxDate : DateTime.now().toISO();

			// convert iso to unix timestamp
			const isoToTimestamp = (date: string) => {
				return new Date(date).getTime();
			};

			// set baseline params
			const baselineQueryParams = [
				{ plan: { $in: roleFilter } },
				{ 'data.date': { $gte: isoToTimestamp(minDateFilter) } },
				{ 'data.date': { $lte: isoToTimestamp(maxDateFilter) } },
			];

			const searchQuery = Lead.buildQuery(baselineQueryParams, itemFilters);

			const searchMatches: ILeadDocument[] = await Lead.fuzzySearch(
				{
					query,
					prefixOnly: true,
					exact: true,
				},
				searchQuery
			)
				.lean()
				.select('-plan')
				.skip((page - 1) * (itemLimit || ITEMS_PER_PAGE))
				.limit(itemLimit || ITEMS_PER_PAGE);

			// declare global variables
			let message, totalItems;

			// set total items + message relevant to whether or not there are search matches
			if (searchMatches.length === 0) {
				totalItems = 0;
				message = 'No matches were found';
			} else {
				// get the number of total items
				totalItems = await Lead.fuzzySearch(
					{
						query,
						prefixOnly: true,
						exact: true,
					},
					searchQuery
				)
					.lean()
					.countDocuments(baselineQueryParams);

				message = `${totalItems} ${
					totalItems === 1 ? 'match was' : 'matches were'
				} found`;
			}

			console.log(message);

			return res.status(200).send({
				message,
				leads: searchMatches,
				page,
				hasNextPage: (itemLimit || ITEMS_PER_PAGE) * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / (itemLimit || ITEMS_PER_PAGE)),
				totalItems,
			});
		} catch (error) {
			console.error(error.message);
			return res.status(500).send('Server error');
		}
	}
);

module.exports = router;
