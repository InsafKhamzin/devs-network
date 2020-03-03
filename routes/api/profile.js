const express = require('express');
const router = express.Router();

// @route Get apu/profile
router.get('/', (req, res) => {
    res.send('Profile route');
});

module.exports = router;