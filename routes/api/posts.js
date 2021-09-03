const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route       POST api/posts
// @description Create a post
// @access      Private
router.post(
	'/',
	[auth, [check('text', 'Comment text is required').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select('-password');

			const newPost = new Post({
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			});

			const post = await newPost.save();

			res.json(post);
		} catch (error) {
			console.log(error.message);
			res.status(500).send('Server error');
		}
	}
);

// @route       GET api/posts
// @description Get all posts
// @access      Private
router.get('/', auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({
			date: -1,
		});
		res.json(posts);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

// @route       GET api/posts/:id
// @description Get post by ID
// @access      Private
router.get('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}
		res.json(post);
	} catch (error) {
		console.error(error.message);
		if (error.kind === 'ObjectId') {
			return res.status(404).json({ message: 'Post not found' });
		}
		res.status(500).send('Server Error');
	}
});

// @route       DELETE api/posts/:id
// @description Delete a post
// @access      Private
router.delete('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		// check if the user trying to delete is the owner of the post
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}
		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ message: 'User not authorized' });
		}
		await post.remove();
		res.json({ message: 'Post removed' });
	} catch (error) {
		console.error(error.message);
		if (error.kind === 'ObjectId') {
			return res.status(404).json({ message: 'Post not found' });
		}
		res.status(500).send('Server Error');
	}
});

// @route       PUT api/posts/like/:id
// @description Like a post
// @access      Private
router.put('/like/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		// check if the post has already been liked
		if (
			post.likes.filter((like) => like.user.toString() === req.user.id).length >
			0
		) {
			return res.status(400).json({ message: 'Post already liked' });
		}
		post.likes.unshift({ user: req.user.id });
		await post.save();
		return res.json(post.likes);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

// @route       PUT api/posts/unlike/:id
// @description Unlike a post
// @access      Private
router.put('/unlike/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		// check if the post has already been liked
		if (
			post.likes.filter((like) => like.user.toString() === req.user.id)
				.length === 0
		) {
			return res.status(400).json({ message: 'Post has not yet been liked' });
		}
		// get remove index
		const removeIndex = post.likes
			.map((like) => like.user.toString())
			.indexOf(req.user.id);
		post.likes.splice(removeIndex, 1);
		await post.save();
		return res.json(post.likes);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

// @route       POST api/posts/comment/:id
// @description Comment on a post
// @access      Private
router.post(
	'/comment/:id',
	[auth, [check('text', 'Comment text is required').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select('-password');
			const post = await Post.findById(req.params.id);

			const newComment = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			};

			post.comments.unshift(newComment);
			await post.save();

			return res.json(post.comments);
		} catch (error) {
			console.log(error.message);
			res.status(500).send('Server error');
		}
	}
);

// @route       DELETE api/posts/comment/:id/:comment_id
// @description Delete a comment
// @access      Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		// pull out the comment from the post
		const comment = post.comments.find(
			(comment) => comment.id === req.params.comment_id
		);
		if (!comment) {
			return res.status(404).json({ message: 'Comment does not exist' });
		}
		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ message: 'User not authorized' });
		}
		const removeIndex = post.comments
			.map((comment) => comment.user.toString())
			.indexOf(req.user.id);
		post.comments.splice(removeIndex, 1);
		await post.save();
		return res.json(post.comments);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
