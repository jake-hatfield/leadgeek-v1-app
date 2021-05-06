const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const auth = require('../../middleware/auth');
const Lead = require('../../models/Lead');
const User = require('../../models/User');

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
			_id,
			role,
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
				itemLimits: { leadsLimit: itemLimit },
				dateLimits: { min: minDate, max: maxDate },
			},
		} = req.body;
		console.log(
			netProfit,
			buyPrice,
			sellPrice,
			roi,
			bsr,
			monthlySales,
			weight,
			category
		);
		const user = await User.findById({ _id });
		if (!user) {
			let message = 'There was an error finding a user with that id.';
			console.log(message);
			return res.status(404).send({ status: 'failure', message });
		}
		console.log('Getting paginated leads...');
		const { unviewedLeads } = user;
		let totalItems, filteredItems, lastUpdated, administrator;
		let roleFilter = [role.toString()];
		const minDateFilter = minDate ? minDate : user.dateCreated;
		const maxDateFilter = maxDate ? maxDate : Date.now();
		const administrativeRoles = ['master', 'admin'];
		if (administrativeRoles.indexOf(role) >= 0) {
			administrator = true;
		}
		const feed = await Lead.find({
			...(!administrator && { plan: { $in: roleFilter } }),
			'data.date': { $gte: minDateFilter, $lt: maxDateFilter },
		})
			.countDocuments()
			.then((numLeads) => {
				totalItems = numLeads;
				Lead.findOne({}, {}, { sort: { 'data.date': -1 } }, (err, res) => {
					lastUpdated = res.data.date;
				});
				Lead.countDocuments(
					{
						$and: [
							{
								...(!administrator && { plan: { $in: roleFilter } }),
								'data.date': { $gte: minDateFilter, $lte: maxDateFilter },
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
					},
					(err, numLeads) => {
						filteredItems = numLeads;
					}
				);
				return Lead.find({
					$and: [
						{
							...(!administrator && { plan: { $in: roleFilter } }),
							'data.date': { $gte: minDateFilter, $lte: maxDateFilter },
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
					.skip((page - 1) * (itemLimit || ITEMS_PER_PAGE))
					.limit(itemLimit || ITEMS_PER_PAGE)
					.sort({ 'data.date': -1 });
			});
		if (feed.length === 0) {
			let message = 'There are no leads to show.';
			console.log(message);
			return res.status(200).send({ message });
		} else {
			console.log(`Total items: ${totalItems} (${filteredItems}) filtered.`);
			console.log(
				`Successfully queried + paginated ${feed.length} database leads.`
			);

			return res.status(200).send({
				feed,
				unviewedLeads,
				totalItems,
				filteredItems,
				page,
				hasNextPage: (itemLimit || ITEMS_PER_PAGE) * page < filteredItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(filteredItems / (itemLimit || ITEMS_PER_PAGE)),
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
		const { role, dateCreated } = req.body;
		console.log('Getting all leads...');
		let roleFilter = [role.toString()];
		let administrator;
		const administrativeRoles = ['master', 'admin'];
		if (administrativeRoles.indexOf(role) >= 0) {
			administrator = true;
		}
		const feed = await Lead.find({
			...(!administrator && { plan: { $in: roleFilter } }),
			...(!administrator && {
				'data.date': { $gte: dateCreated },
			}),
		})
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
		const { leads, page, itemLimit } = req.body;
		const likedLeads = await Lead.find({ _id: { $in: leads } })
			.countDocuments()
			.then((numLeads) => {
				totalItems = numLeads;
				return Lead.find({ _id: { $in: leads } })
					.skip((page - 1) * (itemLimit || ITEMS_PER_PAGE))
					.limit(itemLimit || ITEMS_PER_PAGE)
					.sort({ 'data.date': -1 });
			});
		let message;
		if (likedLeads.length === 0) {
			message = 'You have not liked any leads.';
			console.log(message);
		} else {
			message = `Successfully queried ${likedLeads.length} liked leads.`;
			console.log(message);
		}
		return res.status(200).send({
			message,
			likedLeads,
			page,
			hasNextPage: (itemLimit || ITEMS_PER_PAGE) * page < totalItems,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(totalItems / (itemLimit || ITEMS_PER_PAGE)),
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
		const { leads, page, itemLimit } = req.body;
		const archivedLeads = await Lead.find({ _id: { $in: leads } })
			.countDocuments()
			.then((numLeads) => {
				totalItems = numLeads;
				return Lead.find({ _id: { $in: leads } })
					.skip((page - 1) * (itemLimit || ITEMS_PER_PAGE))
					.limit(itemLimit || ITEMS_PER_PAGE)
					.sort({ 'data.date': -1 });
			});
		let message;
		if (archivedLeads.length === 0) {
			message = 'You have not archived any leads.';
			console.log(message);
		} else {
			let message = `Successfully queried ${archivedLeads.length} archived leads.`;
			console.log(message);
		}
		return res.status(200).send({
			message,
			archivedLeads,
			page,
			hasNextPage: (itemLimit || ITEMS_PER_PAGE) * page < totalItems,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(totalItems / (itemLimit || ITEMS_PER_PAGE)),
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
				return res.status(200).send({
					msg: 'Lead was unliked',
					leads: user.likedLeads,
					title: lead.data.title,
				});
			} else {
				likeLead(user, leadId);
				return res.status(200).send({
					msg: 'Lead was liked',
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
				return res.status(200).send({
					msg: 'Lead was unarchived',
					leads: user.archivedLeads,
					title: lead.data.title,
				});
			} else {
				archiveLead(user, leadId);
				return res.status(200).send({
					msg: 'Lead was archived',
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

module.exports = router;
