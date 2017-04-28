var express = require('express');
var router = express.Router();
var controllers = require('../controller');

/* GET users listing. */
router.get('/', controllers.UsersDashboardController);

module.exports = router;
