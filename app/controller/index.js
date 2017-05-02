const { logger } = require('../../app-common');
const services = require('../../app-core/service')

let names = [
  'DashBoardController',
  'LoginController',
  'AdminDashboardController',
  'AdminExpendituretypeController',
  'AdminExpenditureController',
  'AdminExpensesController',
  'AdminReportsController',
  'UsersDashboardController'
]

let instances = {}

let getInstance = (name) => {
    if (!instances[name]) {
        let c = {[name]: require('./' + name)}
        instances[name] = new c[name](logger, services)
    }

    return instances[name]
}

let makeHandler = (name) => {
    let handler = (req, res, next) => {
        getInstance(name).processRequest(req, res, next)
    }

    return handler
}

module.exports = names.reduce((m, n) => {
    m[n] = makeHandler(n)
    return m
}, {})
