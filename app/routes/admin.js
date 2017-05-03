var express = require('express');
var router = express.Router();
var controllers = require('../controller');

/* GET users listing. */
router.get('/', controllers.AdminDashboardController);
router.get('/expendituretype', controllers.AdminExpendituretypeController);
router.get('/expenditure', controllers.AdminExpenditureController);
router.get('/expenses', controllers.AdminExpensesController);
router.get('/reports', controllers.AdminReportsController);
router.get('/users', controllers.AdminUsersController);

module.exports = router;
