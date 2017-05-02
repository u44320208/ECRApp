var express = require('express');
var router = express.Router();
var controllers = require('../controller');

/* GET home page. */
router.get('/', controllers.DashBoardController);

router.get('/login', controllers.LoginController);
router.post('/login', controllers.LoginController);

module.exports = router;
