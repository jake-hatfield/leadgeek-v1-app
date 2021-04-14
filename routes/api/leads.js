const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const auth = require('../../middleware/auth');
const Lead = require('../../models/Lead');
const User = require('../../models/User');

const ITEMS_PER_PAGE = 20;

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
					variations: lead.variations,
					cashback: lead.cashback,
					asin: lead.asin,
					weight: +lead.weight,
					shipping: lead.shipping,
					notes: lead.notes,
					img: lead.img,
					date: Date.now(),
				},
				plan: lead.plan,
				_id: lead._id,
			}));
			if (newLeads) {
				Lead.insertMany(newLeads, function (err, leads) {
					if (err) {
						console.log(err);
						let message =
							"Leads weren't uploaded. Please check Google Sheets for duplicate _ids or missing attributes.";
						console.log(message);
						return res.status(200).send(message);
					} else {
						let message = `Leads were added to the database.`;
						console.log(message);
						return res.status(201).send(message);
					}
				});
			} else {
				let message = 'There were no rows to pull from Google Sheets';
				console.log(message);
				return res.status(400).send(message);
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
		const {
			lastLoggedIn,
			_id,
			plan,
			page,
			filters: {
				netProfit,
				buyPrice,
				sellPrice,
				roi,
				bsr,
				monthlySales,
				weight,
				category,
			},
		} = req.body;
		const user = await User.findById({ _id });
		if (!user) {
			let message = 'There was an error finding a user with that id.';
			console.log(message);
			return res.status(404).send({ status: 'failure', message });
		}
		console.log('Getting paginated leads...');
		const { unviewedLeads } = user;
		let totalItems;
		const feed = await Lead.find({ plan })
			.countDocuments()
			.then((numLeads) => {
				totalItems = numLeads;
				return Lead.find({
					$and: [
						{
							plan,
							'data.date': { $gte: user.dateCreated },
						},
						{
							...(netProfit.min && {
								'data.netProfit': { $gte: netProfit.min },
							}),
							...(netProfit.max && {
								'data.netProfit': { $lte: netProfit.max },
							}),
							...(netProfit.min &&
								netProfit.max && {
									'data.netProfit': {
										$gte: netProfit.min,
										$lte: netProfit.max,
									},
								}),
							...(buyPrice.min && {
								'data.buyPrice': { $gte: buyPrice.min },
							}),
							...(buyPrice.max && {
								'data.buyPrice': { $gte: buyPrice.max },
							}),
							...(buyPrice.min &&
								buyPrice.max && {
									'data.buyPrice': {
										$gte: buyPrice.min,
										$lte: buyPrice.max,
									},
								}),
							...(sellPrice.min && {
								'data.sellPrice': { $gte: sellPrice.min },
							}),
							...(sellPrice.max && {
								'data.sellPrice': { $lte: sellPrice.max },
							}),
							...(sellPrice.min &&
								sellPrice.max && {
									'data.sellPrice': {
										$gte: sellPrice.min,
										$lte: sellPrice.max,
									},
								}),
							...(roi.min && {
								'data.roi': { $gte: roi.min },
							}),
							...(roi.max && {
								'data.roi': { $lte: roi.max },
							}),
							...(roi.min &&
								roi.max && {
									'data.roi': {
										$gte: roi.min,
										$lte: roi.max,
									},
								}),
							...(bsr.min && {
								'data.bsr': { $gte: bsr.min },
							}),
							...(bsr.max && {
								'data.bsr': { $gte: bsr.max },
							}),
							...(bsr.min &&
								bsr.max && {
									'data.bsr': {
										$gte: bsr.min,
										$lte: bsr.max,
									},
								}),
							...(monthlySales.min && {
								'data.monthlySales': {
									$gte: monthlySales.min,
								},
							}),
							...(monthlySales.max && {
								'data.monthlySales': {
									$lte: monthlySales.max,
								},
							}),
							...(monthlySales.min &&
								monthlySales.max && {
									'data.monthlySales': {
										$gte: monthlySales.min,
										$lte: monthlySales.max,
									},
								}),
							...(weight.min && {
								'data.weight': {
									$gte: weight.min,
								},
							}),
							...(weight.max && {
								'data.weight': {
									$lte: weight.max,
								},
							}),
							...(weight.min &&
								weight.max && {
									'data.weight': {
										$gte: weight.min,
										$lte: weight.max,
									},
								}),
							...(category.length > 0 && {
								'data.category': {
									$in: category,
								},
							}),
						},
					],
				})
					.skip((page - 1) * ITEMS_PER_PAGE)
					.limit(ITEMS_PER_PAGE)
					.sort({ 'data.date': -1 });
			});
		if (feed.length === 0) {
			let message = 'There are no leads to show.';
			console.log(message);
			return res.status(200).send({ message });
		} else {
			const lastUpdated = feed[0].data.date;
			console.log(`Total items: ${totalItems}`);
			// see if any leads have been added since the user last logged in
			const unviewed = await Lead.find({
				plan,
				'data.date': { $gte: lastLoggedIn },
			}).select('_id');
			// if any new leads, add them to the DB
			if (unviewed.length > 0) {
				console.log('Adding new unviewed products...');
				// see if they're already in the user's unviewed leads
				const newUnviewed = unviewed.filter(
					(lead) => unviewedLeads.map((l) => l._id) !== lead._id
				);
				user.unviewedLeads = newUnviewed;
				await user.save();
			}
			console.log(
				`Successfully queried + paginated ${feed.length} database leads.`
			);
			return res.status(200).send({
				feed,
				unviewedLeads,
				totalItems,
				page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
				lastUpdated,
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
router.post('/all', auth, async (req, res) => {
	try {
		const { plan } = req.body;
		console.log('Getting all leads...');
		const feed = await Lead.find({ plan })
			.select('data -_id')
			.sort({ 'data.date': -1 });
		console.log(`Total items: ${feed.length}`);
		if (feed.length === 0) {
			let message = 'There are no leads to show.';
			console.log(message);
			return res.status(200).send({ message });
		} else {
			return res.status(200).send({
				feed,
			});
		}
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

// @route       POST api/view
// @description Update unviewed leads in database on view
// @access      Private
router.post('/view', auth, async (req, res) => {
	try {
		const { userId, leadId } = req.body;
		let user = await User.findById(userId);
		const newUnviewedLeads = user.unviewedLeads.filter(
			(lead) => lead._id.toString() !== leadId.toString()
		);
		user.unviewedLeads = newUnviewedLeads;
		await user.save();
		return res.status(200).send(newUnviewedLeads);
	} catch (error) {
		console.log(error.message);
		return res.status(500).send('Sever error');
	}
});

// @route       POST api/liked
// @description Send lead ids to populate the liked page
// @access      Private
router.post('/liked', auth, async (req, res) => {
	try {
		const { leads, page } = req.body;
		const likedLeads = await Lead.find({ _id: { $in: leads } })
			.countDocuments()
			.then((numLeads) => {
				totalItems = numLeads;
				return Lead.find({ _id: { $in: leads } })
					.skip((page - 1) * ITEMS_PER_PAGE)
					.limit(ITEMS_PER_PAGE)
					.sort({ 'data.date': -1 });
			});
		if (likedLeads.length === 0) {
			let message = 'You have not liked any leads.';
			console.log(message);
			return res.status(200).send({ message });
		} else {
			let message = `Successfully queried ${likedLeads.length} liked leads.`;
			console.log(message);
			return res.status(200).send({
				message,
				likedLeads,
				page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
			});
		}
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
		const { leads, page } = req.body;
		const archivedLeads = await Lead.find({ _id: { $in: leads } })
			.countDocuments()
			.then((numLeads) => {
				totalItems = numLeads;
				return Lead.find({ _id: { $in: leads } })
					.skip((page - 1) * ITEMS_PER_PAGE)
					.limit(ITEMS_PER_PAGE)
					.sort({ 'data.date': -1 });
			});
		if (archivedLeads.length === 0) {
			let message = 'You have not archived any leads.';
			console.log(message);
			return res.status(200).send({ message });
		} else {
			let message = `Successfully queried ${archivedLeads.length} archived leads.`;
			console.log(message);
			return res.status(200).send({
				message,
				archivedLeads,
				page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
			});
		}
	} catch (error) {
		console.log(error.message);
		return res.status(500).send('Sever error');
	}
});

// @route       POST api/handle-like-lead
// @description Like/unlike a lead
// @access      Private
const unlikeLead = async (user, leadId) => {
	const updatedLikedArray = user.likedLeads.filter(
		(lead) => lead._id.toString() !== leadId.toString()
	);
	console.log('Lead was unliked.');
	user.likedLeads = updatedLikedArray;
	await user.save();
};

const likeLead = async (user, leadId) => {
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
				return res
					.status(200)
					.send({ msg: 'Lead was unliked.', leads: user.likedLeads });
			} else {
				likeLead(user, leadId);
				return res
					.status(200)
					.send({ msg: 'Lead was liked.', leads: user.likedLeads });
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
const unarchiveLead = async (user, leadId) => {
	const updatedArchivedArray = user.archivedLeads.filter(
		(lead) => lead._id.toString() !== leadId.toString()
	);
	console.log('Lead was unarchived.');
	user.archivedLeads = updatedArchivedArray;
	await user.save();
};

const archiveLead = async (user, leadId) => {
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
				return res
					.status(200)
					.send({ msg: 'Lead was unarchived.', leads: user.archivedLeads });
			} else {
				archiveLead(user, leadId);
				return res
					.status(200)
					.send({ msg: 'Lead was archived.', leads: user.archivedLeads });
			}
		} else {
			return res.status(404).send('There was an error archiving this lead.');
		}
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

module.exports = router;
