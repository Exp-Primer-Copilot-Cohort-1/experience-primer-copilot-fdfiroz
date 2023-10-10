// Create web server

// Import modules
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Comment } = require('../models/Comment');

// @route GET /comments
// @desc Get all comments
// @access Public
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).send(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route POST /comments
// @desc Create a comment
// @access Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Email is invalid').isEmail(),
    check('comment', 'Comment is required').not().isEmpty()
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(errors.array());
    }

    try {
        const { name, email, comment } = req.body;

        // Create comment
        const newComment = new Comment({
            name,
            email,
            comment
        });

        // Save comment
        await newComment.save();

        res.status(200).send(newComment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Export router
module.exports = router;