let Promise = require('bluebird');
let Sequelize = require("sequelize");
let _ = require('lodash')

//let { redisAdpt } = require('../adapt-client/')

// app-common
let appCommon = require('../../app-common');
let logger = appCommon.logger;
var exception = appCommon.exception;

// dom
let models = require('../dao/db');
//let dom = require('../dom');

// extend
let AbstractDao = require('./AbstractDao');

//  class/object Definition
/*
// 2017-05-08 .................. create ExpendituretypeDao.js
*/
module.exports = class ExpendituretypeDao extends AbstractDao {

  constructor(logger) {
    super(logger)
  }

}