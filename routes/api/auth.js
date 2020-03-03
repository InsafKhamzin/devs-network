const express = require('express');
const router = express.Router();

// @route Get apu/auth
router.get('/', (req, res) => {
    res.send('Auth route');
});

module.exports = router;