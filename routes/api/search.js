const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Lead = require('../../models/Lead');

// @route       POST api/search
// @description Seach all leads a user has access to
// @access      Private
router.get('/', auth, async (req, res) => {
	try {
		console.log(req.body);
		const { q } = req.query;
		const leads = await Lead.find({ plan: req.body.plan })
			.fuzzySearch(q)
			.select('-plan');
		return res.status(200).send(leads);
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

module.exports = router;
