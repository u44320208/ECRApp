var { Tracable } = require('../../app-common')

module.exports = class AbstractDao extends Tracable(Object) {
  constructor(logger) {
    super()
    this.logger = logger
  }
}
