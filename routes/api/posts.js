const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const ObjectId = require('mongoose').Types.ObjectId;

const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route POST api/posts
// @desc Create a post
router.post('/',
    [
        auth,
        [
            check('text', 'Text is required').notEmpty()
        ]
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const user = await User.findById(req.user.id);

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });
            const post = await newPost.save();
            res.json(post);
        } catch (error) {
            console.error(error.message);
            res.send('Server Error');
        }
    });

// @route GET api/posts
// @desc Get all posts
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.send('Server Error');
    }
});

// @route GET api/posts/:id
// @desc Get by id
router.get('/:id', auth, async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: 'Invalid post id' })
        }
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error(error.message);
        res.send('Server Error');
    }
});

// @route DELETE api/posts/:id
// @desc Delete post by id
router.delete('/:id', auth, async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: 'Invalid post id' })
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        if (req.user.id !== post.user.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await post.remove();
        res.json({ msg: "Post removed" });
    } catch (error) {
        console.error(error.message);
        res.send('Server Error');
    }
});

// @route PUT api/posts/like/:id
// @desc Like/Unlike post
router.put('/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        const likedBeforeIdx = post.likes
            .findIndex(like => like.user.toString() === req.user.id);

        if (likedBeforeIdx === -1) {
            //add like
            post.likes.unshift({ user: req.user.id });
        } else {
            //remove like
            post.likes.splice(likedBeforeIdx, 1);
        }
        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.send('Server Error');
    }
});

// @route POST api/posts/comment/:id
// @desc Comment on a post
router.post('/:id/comment',
    [
        auth,
        [
            check('text', 'Text is required').notEmpty()
        ]
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            if (!ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ msg: 'Invalid post id' })
            }
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(400).json({ msg: 'Post not found' });
            }

            const user = await User.findById(req.user.id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment);

            await post.save();
            res.json(post.comments);
        } catch (error) {
            console.error(error.message);
            res.send('Server Error');
        }
    });

// @route DELETE api/posts/comment/:id
// @desc Delete comment
router.delete('/:id/comment/:comment_id', auth, async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: 'Invalid post id' })
        }
        if (!ObjectId.isValid(req.params.comment_id)) {
            return res.status(400).json({ msg: 'Invalid comment id' })
        }
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const comment = post.comments
            .find(comment => comment._id.toString() === req.params.comment_id);
        if(!comment){
            return res.status(404).json({ msg: 'Comment not found' });
        }

        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await post.comments.remove(comment._id);
        await post.save();
        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.send('Server Error');
    }
});

module.exports = router;