var express = require('express');
var router = express.Router();
var controllers = require('../controller');

/* GET users listing. */
router.get('/', controllers.UsersDashboardController);
router.get('/expendituretype', controllers.UsersExpendituretypeController);
router.get('/expenditure', controllers.UsersExpenditureController);
router.get('/expenses', controllers.UsersExpensesController);
router.get('/reports', controllers.UsersReportsController);
router.get('/user', controllers.UsersUserController);

module.exports = router;
