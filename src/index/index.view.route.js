const express = require('express');

const router = express.Router();



/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index/views/index', { message: null });
});


module.exports = router;
