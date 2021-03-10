const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const Lead = require('../../models/Lead');
const User = require('../../models/User');

const ITEMS_PER_PAGE = 3;

// @route       POST api/leads/export
// @description Create new lead
// @access      Private
router.post('/export', auth, async (req, res) => {
	try {
		const newLead = await new Lead(req.body.lead);
		newLead.save();
		let message = 'Lead was added to the database.';
		console.log(message);
		return res.status(200).send(message);
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

// @route       GET api/leads
// @description Get bundle leads
// @access      Private
router.post('/', auth, async (req, res) => {
	try {
		const { lastLoggedIn, _id, plan, page } = req.body;
		console.log(page);
		let totalItems;
		const feed = await Lead.find({ plan })
			.countDocuments()
			.then((numLeads) => {
				totalItems = numLeads;
				return Lead.find({ plan })
					.skip((page - 1) * ITEMS_PER_PAGE)
					.limit(ITEMS_PER_PAGE)
					.sort({ 'data.date': -1 });
			});
		if (feed.length === 0) {
			let message = 'There are no leads to show.';
			console.log(message);
			return res.status(404).send({ status: 'failure', message });
		} else {
			const user = await User.findById({ _id });
			const { unviewedLeads } = user;
			// see if any leads have been added since the user last logged in
			const unviewed = feed
				.filter((lead) => lead.data.date >= lastLoggedIn)
				.map((obj) => {
					return obj._id;
				});
			// if any new leads, add them to the DB
			if (unviewed.length > 0) {
				console.log('Adding new unviewed products...');
				unviewedLeads.push(unviewed);
				console.log(unviewedLeads);
				await user.save();
			}
			console.log(
				`Successfully queried all leads! There were ${feed.length} leads found.`
			);
			return res.status(200).send({
				feed,
				unviewedLeads,
				page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
			});
		}
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

// @route       POST api/liked
// @description Send lead ids to populate the liked page
// @access      Private
router.post('/liked', auth, async (req, res) => {
	try {
		const likedLeads = await Lead.find({ _id: { $in: req.body } }).sort({
			'data.date': -1,
		});
		if (likedLeads.length === 0) {
			console.log('You have not liked any leads yet.');
			return res.status(204);
		} else {
			console.log(
				`Successfully queried liked leads! There were ${likedLeads.length} leads found.`
			);
			return res.status(200).send({ likedLeads });
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
		const archivedLeads = await Lead.find({ _id: { $in: req.body } }).sort({
			'data.date': -1,
		});
		if (archivedLeads.length === 0) {
			console.log('You have not archived any leads yet.');
			return res.status(204);
		} else {
			console.log(
				`Successfully queried archived leads! There were ${archivedLeads.length} leads found.`
			);
			return res.status(200).send({ archivedLeads });
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
