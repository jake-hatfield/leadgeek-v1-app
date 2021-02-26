const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../../middleware/auth');
const Lead = require('../../models/Lead');

// @route       POST api/leads/export
// @description Create new lead
// @access      Private
router.post('/export', auth, async (req, res) => {
	try {
		let newLead = new Lead(req.body.lead);
		await newLead.save();
		console.log('We did it');
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
		let leadCollection;
		if (req.body.activeSubscriptions === 'Pro') {
			leadCollection = 'pro_1_leads';
		}
		let connection = mongoose.connection;
		console.log(connection);
		connection.on('error', console.error.bind(console, 'connection error:'));
		console.log('Retrieving leads');
		connection.once('open', function () {
			connection.db.collection('users', function (err, collection) {
				collection.find({}).toArray(function (err, data) {
					console.log(data);
					return res.status(200).json(data);
				});
			});
		});
		// const feed = await User.findById(req.user.id).select('-password');
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

module.exports = router;
