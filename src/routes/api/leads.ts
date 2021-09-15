// packages
import { Router } from 'express';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { DateTime } from 'luxon';
import mongoose, { ObjectId } from 'mongoose';

// middleware
import auth from '@middleware/auth';

// models
import Lead from '../../models/Lead';
import User, { IUserDocument } from '../../models/User';

// types
import { Filter } from '../../types/Filter';
import { ILead } from 'types/Lead';
import { Roles } from '../../types/User';

// router
const router = Router();

// global var
const ITEMS_PER_PAGE = 15;

// @route       POST api/leads/export
// @description Create new lead
// @access      Private
router.get('/export', auth, async (req, res) => {
	const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID;
	const CLIENT_EMAIL = process.env.REACT_APP_SHEETS_CLIENT_EMAIL;
	const PRIVATE_KEY = process.env.REACT_APP_SHEETS_PRIVATE_KEY.replace(
		/\\n/gm,
		'\n'
	);
	try {
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
				.send('Error connecting to Google Sheets. No sheet was found');
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
					date: lead.date || Date.now(),
					asin: lead.asin,
				},
				plan: lead.plan.split(','),
				_id: lead._id,
			}));

			if (newLeads) {
				try {
					await Lead.insertMany(newLeads);
					let message = `Leads were added to the database.`;
					console.log(message);
					return res.status(201).send(message);
				} catch (error) {
					console.log(error);
					let message = 'There was an error uploading the leads.';
					console.log(message);
					return res.status(200).send(message);
				}
			} else {
				let message = 'There were no rows to pull from Google Sheets';
				console.log(message);
				return res.status(200).send(message);
			}
		}
	} catch (error) {
		console.log(error);
	}
});

// @route       GET api/leads
// @description Get paginated leads by plan and filters
// @access      Private
router.post('/', auth, async (req, res) => {
	try {
		// destructure items from request
		const {
			_id,
			role,
			page,
			filters: {
				filters: itemFilters,
				dateLimits: { min: minDate, max: maxDate },
				itemLimit,
			},
		}: {
			_id: string;
			role: Roles;
			page: number;
			filters: {
				filters: Filter[];
				dateLimits: {
					min: string;
					max: string;
				};
				itemLimit: number;
			};
		} = req.body;

		// lookup user by id
		const user = await User.findById({ _id });

		// no user was found (though shouldn't ever happen)
		if (!user) {
			let message = 'There was an error finding a user with that id.';
			console.log(message);
			return res.status(400).send({ status: 'failure', message });
		}

		// lookup active subscriptions
		const activeSub = user.subscription.subIds.filter(
			(sub: { id: string | null; active?: boolean }) => sub.active
		);

		// if no active subscriptions, return
		if (activeSub.length === 0) {
			let message = 'There are no leads to show';
			console.log(message);
			return res.status(200).send({ status: 'failure', message });
		}

		// we can proceed getting leads
		console.log('Getting paginated leads...');

		// set role filter
		const roleFilter = [role.toString()];
		// declare admin roles and set admin to true if one exists
		const administrativeRoles = ['master', 'admin'];
		if (administrativeRoles.indexOf(role) >= 0) {
			roleFilter.push('bundle');
		}

		// set date filter
		const fromJSDate = DateTime.fromJSDate(user.dateCreated);
		const userDayCreated = fromJSDate.startOf('day').toISODate();
		const minDateFilter = minDate ? minDate : userDayCreated;
		const maxDateFilter = maxDate ? maxDate : DateTime.now().toISODate();
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
			let message = 'There are no leads to show';
			console.log(message);
			return res.status(200).send({
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
			const filteredItems = await Lead.find().lean().countDocuments(feedQuery);

			console.log(
				`Successfully queried + paginated ${feed.length} of ${totalItems} database leads.`
			);
			return res.status(200).send({
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
		return res.status(500).send('Server error');
	}
});

// @route       GET api/leads
// @description Get all leads by plan
// @access      Private
// router.post('/all', auth, async (req, res) => {
// 	try {
// 		const { role, dateCreated } = req.body;
// 		console.log('Getting all leads...');
// 		let roleFilter = [role.toString()];
// 		let administrator;
// 		const administrativeRoles = ['master', 'admin'];
// 		if (administrativeRoles.indexOf(role) >= 0) {
// 			administrator = true;
// 		}
// 		const feed = await Lead.find({
// 			...(!administrator && { plan: { $in: roleFilter } }),
// 			...(!administrator && {
// 				'data.date': { $gte: dateCreated },
// 			}),
// 		})
// 			.select('data -_id')
// 			.sort({ 'data.date': -1 });
// 		console.log(`Total items: ${feed.length}`);
// 		if (feed.length === 0) {
// 			let message = 'There are no leads to show';
// 			console.log(message);
// 			return res.status(200).send({ message });
// 		} else {
// 			return res.status(200).send({
// 				feed,
// 			});
// 		}
// 	} catch (error) {
// 		console.error(error.message);
// 		return res.status(500).send('Server error');
// 	}
// });

// @route       POST api/liked
// @description Send lead ids to populate the liked page
// @access      Private
router.post('/liked', auth, async (req, res) => {
	try {
		// destructure necessary items from request body
		const {
			leads,
			page,
			filters: { filters: itemFilters, itemLimit },
		}: {
			leads: ILead[];
			page: number;
			filters: {
				filters: Filter[];
				itemLimit: number;
			};
		} = req.body;

		// declare global variables
		let totalItems;

		// set baseline params
		const baselineQueryParams = [{ _id: { $in: leads } }];

		// build liked query
		const likedQuery = Lead.buildQuery(baselineQueryParams, itemFilters);

		const likedLeads = await Lead.find(likedQuery)
			.countDocuments()
			.then((numLeads) => {
				totalItems = numLeads;
				return Lead.find(likedQuery)
					.skip((page - 1) * (itemLimit || ITEMS_PER_PAGE))
					.limit(itemLimit || ITEMS_PER_PAGE)
					.sort({ 'data.date': -1 });
			});

		let message;
		if (likedLeads.length === 0) {
			message = 'You have not liked any leads';
			console.log(message);
		} else {
			message = `Successfully queried ${likedLeads.length} liked leads.`;
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
		return res.status(500).send('Sever error');
	}
});

// @route       POST api/archived
// @description Send lead ids to populate the archived page
// @access      Private
router.post('/archived', auth, async (req, res) => {
	try {
		// destructure necessary items from request body
		const {
			leads,
			page,
			filters: { filters: itemFilters, itemLimit },
		}: {
			leads: ILead[];
			page: number;
			filters: {
				filters: Filter[];
				itemLimit: number;
			};
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

		let message;
		if (archivedLeads.length === 0) {
			message = 'You have not archived any leads';
			console.log(message);
		} else {
			let message = `Successfully queried ${archivedLeads.length} archived leads.`;
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
		return res.status(500).send('Sever error');
	}
});

// @route       POST api/handle-like-lead
// @description Like/unlike a lead
// @access      Private
const unlikeLead = async (user: any, leadId: ObjectId) => {
	const updatedLikedArray = user.likedLeads.filter(
		(lead: { _id: ObjectId }) => lead._id.toString() !== leadId.toString()
	);
	console.log('Lead was unliked.');
	user.likedLeads = updatedLikedArray;
	await user.save();
};

const likeLead = async (user: any, leadId: ObjectId) => {
	console.log('Lead was liked.');
	user.likedLeads.push(leadId);
	await user.save();
};

router.post('/handle-like-lead', auth, async (req, res) => {
	try {
		const { userId, leadId } = req.body;
		// find lead in the feed
		const lead = await Lead.findById(leadId);
		if (lead) {
			// find the user's liked leads
			const user = await User.findById(userId);
			const likedLeads = user.likedLeads;
			// check if the lead is already liked
			const indexed = likedLeads
				.map((l) => {
					return l._id;
				})
				.indexOf(leadId);
			if (indexed >= 0) {
				unlikeLead(user, leadId);
				return res.status(200).send({
					message: 'Lead was unliked',
					leads: user.likedLeads,
					title: lead.data.title,
				});
			} else {
				likeLead(user, leadId);
				return res.status(200).send({
					message: 'Lead was liked',
					leads: user.likedLeads,
					title: lead.data.title,
				});
			}
		} else {
			return res.status(404).send('There was an error liking this lead.');
		}
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

// @route       POST api/handle-archive-lead
// @description Archive/unarchive a lead
// @access      Private
const unarchiveLead = async (user: any, leadId: ObjectId) => {
	const updatedArchivedArray = user.archivedLeads.filter(
		(lead: { _id: ObjectId }) => lead._id.toString() !== leadId.toString()
	);
	console.log('Lead was unarchived.');
	user.archivedLeads = updatedArchivedArray;
	await user.save();
};

const archiveLead = async (user: any, leadId: ObjectId) => {
	console.log('Lead was archived.');
	user.archivedLeads.push(leadId);
	await user.save();
};

router.post('/handle-archive-lead', auth, async (req, res) => {
	try {
		const { userId, leadId } = req.body;
		// find lead in the feed
		const lead = await Lead.findById(leadId);
		if (lead) {
			// find the user's liked leads
			const user = await User.findById(userId);
			const archivedLeads = user.archivedLeads;
			// check if the lead is already liked
			const indexed = archivedLeads
				.map((l) => {
					return l._id;
				})
				.indexOf(leadId);
			if (indexed >= 0) {
				unarchiveLead(user, leadId);
				return res.status(200).send({
					message: 'Lead was unarchived',
					leads: user.archivedLeads,
					title: lead.data.title,
				});
			} else {
				archiveLead(user, leadId);
				return res.status(200).send({
					message: 'Lead was archived',
					leads: user.archivedLeads,
					title: lead.data.title,
				});
			}
		} else {
			return res.status(404).send('There was an error archiving this lead.');
		}
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

// @route       POST api/add-comment
// @description Add a comment to a lead
// @access      Private
router.post('/add-comment', auth, async (req, res) => {
	try {
		const { comment, userId, leadId } = req.body;
		if (!comment || !userId || !leadId) {
			return res
				.status(400)
				.json({ message: 'Required information is missing' });
		}

		// declare global variables
		let message;

		// query lead
		const lead = await Lead.findById(leadId);

		// if it exists, see if it already has a comment
		if (lead) {
			const user = await User.findById(userId);
			if (user) {
				const alreadyCommented = user.comments.find(
					(l) => l.leadId.toString() === leadId
				);

				// if it already has a comment, update it
				if (alreadyCommented) {
					console.log('Overwriting comment...');

					// build the new comment
					const newComment = {
						leadId,
						comment,
						date: DateTime.now().toISO(),
					};

					// find the index of it
					const commentIndex = user.comments.findIndex(
						(l) => l.leadId.toString() === leadId
					);

					// replace it in the array
					user.comments[commentIndex] = newComment;
				} else {
					console.log('Comment does not exist yet...');

					// push the new comment onto the array
					user.comments.push({ leadId, comment });
				}

				// save the user document
				await user.save();
				console.log('Comment saved!');

				// return successful
				return res
					.status(201)
					.json({ message: 'Comment was added', comments: user.comments });
			} else {
				message = 'User could not be found';
				return res.status(400).json({ message });
			}
		}
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

module.exports = router;
