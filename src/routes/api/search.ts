// packages
import { Request, Response, Router } from 'express';

// models
const auth = require('@middleware/auth');
const Lead = require('@models/Lead');

// router
const router = Router();

// global var
const ITEMS_PER_PAGE = 15;

// @route       POST api/search
// @description Seach all leads a user has access to
// @access      Private
router.post('/', auth, async (req: Request, res: Response) => {
	try {
		const { query, role, dateCreated, page, itemLimit } = req.body;
		let roleFilter = [role.toString()];
		let administrator;
		const administrativeRoles = ['master', 'admin'];
		if (administrativeRoles.indexOf(role) >= 0) {
			administrator = true;
		}
		const leads = await Lead.fuzzySearch({
			query,
			prefixOnly: true,
			exact: true,
			...(!administrator && { plan: { $in: roleFilter } }),
			...(!administrator && {
				'data.date': { $gte: dateCreated },
			}),
		})
			.select('-plan')
			.skip((page - 1) * (itemLimit || ITEMS_PER_PAGE))
			.limit(itemLimit || ITEMS_PER_PAGE);
		const totalItems = await Lead.fuzzySearch({
			query,
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
			hasNextPage: (itemLimit || ITEMS_PER_PAGE) * page < totalItems,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(totalItems / (itemLimit || ITEMS_PER_PAGE)),
			totalItems,
		});
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('Server error');
	}
});

module.exports = router;