const AbstractController = require('./AbstractUsersController');
const { ecrappConstants } = require('../../app-common');

// Dom
let models = require('../../app-core/dao/db');

let Promise = require('bluebird');
let _ = require('lodash')
let dateFormat = require('dateformat')

module.exports = class UsersExpenditureController extends AbstractController {
  constructor(logger, services) {
    super(logger, services);
  }

  execute(req, res) {
      let tracer = this.trace(req.processInfo.tracking, null)
      
      return res.render('users/expenditure')
  }

}