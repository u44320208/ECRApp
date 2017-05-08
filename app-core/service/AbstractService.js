let { Tracable, exception } = require('../../app-common')

let Promise = require('bluebird')
let _ = require('lodash')

module.exports = class AbstractService extends Tracable(Object) {

  constructor(logger, dao) {
    super()
    this.logger = logger
    this.dao = dao
  }
}