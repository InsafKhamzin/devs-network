const express = require('express');
const router = express.Router();

// @route Get apu/posts
router.get('/', (req, res) => {
    res.send('Posts route');
});

module.exports = router;