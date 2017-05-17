var express = require('express');
var router = express.Router();
var controllers = require('../controller');

/************ Users First Page *************/
router.get('/', controllers.UsersDashboardController);

/************ Expenditure management *************/
router.get('/expenditure', controllers.UsersExpenditureController);
router.get('/expenditure/:cmd', controllers.UsersExpenditureController);
router.get('/expenditure/:cmd/:expenditureId', controllers.UsersExpenditureController);
router.post('/expenditure', controllers.UsersExpenditureController);
router.post('/expenditure/:cmd/:expenditureId', controllers.UsersExpenditureController);
router.delete('/expenditure/:expenditureId', controllers.UsersExpenditureController);

/************ Expenses management *************/
router.get('/expenses', controllers.UsersExpensesController);
router.get('/expenses/:cmd', controllers.UsersExpensesController);
router.get('/expenses/:cmd/:expenseId', controllers.UsersExpensesController);
router.post('/expenses', controllers.UsersExpensesController);
router.post('/expenses/:cmd/:expenseId', controllers.UsersExpensesController);
router.delete('/expenses/:expenseId', controllers.UsersExpensesController);

/************ User management *************/
router.get('/user', controllers.UsersUserController);

router.get('/reports', controllers.UsersReportsController);

module.exports = router;
