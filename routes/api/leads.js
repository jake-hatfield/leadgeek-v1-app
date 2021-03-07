const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../../middleware/auth');
const Lead = require('../../models/Lead');
const User = require('../../models/User');

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
router.get('/', auth, async (req, res) => {
	try {
		const feed = await Lead.find({});
		if (feed.length <= 0) {
			let message = 'Could not retrieve leads.';
			console.log(message);
			return res.status(404).json({ status: 'failure', message });
		} else {
			console.log(
				`Successfully queried leads! There were ${feed.length} leads found.`
			);
			return res.status(200).json({ feed });
		}
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

// @route       POST api/like-lead
// @description Like a lead
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

module.exports = router;
