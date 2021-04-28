const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Lead = require('../../models/Lead');

const ITEMS_PER_PAGE = 20;

// @route       POST api/search
// @description Seach all leads a user has access to
// @access      Private
router.post('/', auth, async (req, res) => {
	try {
		const { q, role, dateCreated, page } = req.body;
		let roleFilter = [role.toString()];
		let administrator;
		const administrativeRoles = ['master', 'admin'];
		if (administrativeRoles.indexOf(role) >= 0) {
			administrator = true;
		}
		const leads = await Lead.fuzzySearch({
			query: q,
			prefixOnly: true,
			exact: true,
			...(!administrator && { plan: { $in: roleFilter } }),
			...(!administrator && {
				'data.date': { $gte: dateCreated },
			}),
		})
			.select('-plan')
			.skip((page - 1) * ITEMS_PER_PAGE)
			.limit(ITEMS_PER_PAGE);
		const totalItems = await Lead.fuzzySearch({
			query: q,
			prefixOnly: true,
			exact: true,
			...(!administrator && { plan: { $in: roleFilter } }),
			...(!administrator && {
				'data.date': { $gte: dateCreated },
			}),
		}).countDocuments();
		return res.status(200).send({
			leads,
			page,
			hasNextPage: ITEMS_PER_PAGE * page < totalItems,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
			totalItems,
		});
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

module.exports = router;
