var express = require('express');
var router = express.Router();
var controllers = require('../controller');

/* GET users listing. */
router.get('/', controllers.AdminDashboardController);

module.exports = router;
