let appCommon = require('../../app-common');
let exception = appCommon.exception;
let AbstractService = require('./AbstractService');

module.exports = class ExpenseService extends AbstractService  {
  constructor(logger, dao) {
    super(logger, dao)
    this.expenseDao = dao.expenseDao;
  }

}