let appCommon = require('../../app-common');
let exception = appCommon.exception;
let AbstractService = require('./AbstractService');

module.exports = class ExpendituretypeService extends AbstractService  {
  constructor(logger, dao) {
    super(logger, dao)
    this.expendituretypeDao = dao.expendituretypeDao;
  }

}