let appCommon = require('../../app-common');
let exception = appCommon.exception;
let AbstractService = require('./AbstractService');

module.exports = class ExpenditureService extends AbstractService  {
  constructor(logger, dao) {
    super(logger, dao)
    this.expenditureDao = dao.expenditureDao;
  }

}