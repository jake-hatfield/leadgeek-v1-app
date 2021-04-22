const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Lead = require('../../models/Lead');

// @route       POST api/search
// @description Seach all leads a user has access to
// @access      Private
router.post('/', auth, async (req, res) => {
	try {
		const { q, plan, dateCreated } = req.body;
		let planFilter = [];
		if (plan === 'bundle' || plan === 'admin') {
			planFilter = ['bundle'];
		} else {
			planFilter = [plan.toString()];
		}
		const leads = await Lead.find({
			plan: { $in: planFilter },
			'data.date': { $gte: dateCreated },
		})
			.fuzzySearch(q)
			.select('-plan');
		return res.status(200).send(leads);
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

module.exports = router;
