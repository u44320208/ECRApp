var express = require('express');
var router = express.Router();
var controllers = require('../controller');

/************ Users First Page *************/
router.get('/', controllers.UsersDashboardController);

router.get('/expendituretype', controllers.UsersExpendituretypeController);
router.get('/expenditure', controllers.UsersExpenditureController);
router.get('/expenses', controllers.UsersExpensesController);
router.get('/user', controllers.UsersUserController);
router.get('/reports', controllers.UsersReportsController);

module.exports = router;
