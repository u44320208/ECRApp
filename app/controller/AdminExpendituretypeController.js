const AbstractController = require('./AbstractPublicController');
const { iamsmConstants } = require('../../app-common');

// Dom
let models = require('../../app-core/dao/db');

let Promise = require('bluebird');
let _ = require('lodash')
let dateFormat = require('dateformat')

module.exports = class AdminExpendituretypeController extends AbstractController {
  constructor(logger, services) {
    super(logger, services);
  }

  execute(req, res) {
      res.send('AdminExpendituretypeController');
  }

}