const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Lead = require('../../models/Lead');

// @route       GET api/search
// @description Seach all leads a user has access to
// @access      Private
router.get('/', auth, async (req, res) => {
	try {
		const { q } = req.query;
		const leads = await Lead.find({}).fuzzySearch(q);
		return res.status(200).send(leads);
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

module.exports = router;
