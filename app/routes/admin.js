var express = require('express');
var router = express.Router();
var controllers = require('../controller');

/* GET users listing. */
router.get('/', controllers.AdminDashboardController);

/************ Expendituretype management *************/
router.get('/expendituretype', controllers.AdminExpendituretypeController);
router.get('/expendituretype/:cmd', controllers.AdminExpendituretypeController);
router.get('/expendituretype/:cmd/:expendituretypeId', controllers.AdminExpendituretypeController);
router.post('/expendituretype', controllers.AdminExpendituretypeController);
router.post('/expendituretype/:cmd/:expendituretypeId', controllers.AdminExpendituretypeController);
router.delete('/expendituretype/:expendituretypeId', controllers.AdminExpendituretypeController);

/************ Expenditure management *************/
router.get('/expenditure', controllers.AdminExpenditureController);
router.get('/expenditure/:cmd', controllers.AdminExpenditureController);
router.get('/expenditure/:cmd/:expenditureId', controllers.AdminExpenditureController);
router.post('/expenditure', controllers.AdminExpenditureController);
router.post('/expenditure/:cmd/:expenditureId', controllers.AdminExpenditureController);
router.delete('/expenditure/:expenditureId', controllers.AdminExpenditureController);

router.get('/expenses', controllers.AdminExpensesController);
router.get('/reports', controllers.AdminReportsController);
router.get('/users', controllers.AdminUsersController);

module.exports = router;
