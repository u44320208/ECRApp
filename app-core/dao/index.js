const _ = require('lodash')
const { logger } = require('../../app-common')

let names = [
  'ExpendituretypeDao',
  'ExpenditureDao',
  'ExpenseDao'
]

let instances = {}

module.exports = names.reduce((m, name) => {
  m.__defineGetter__(_.camelCase(name), () => {
    if (instances[name]) {
      console.log('re-use an instance of', name)
      return instances[name]
    } else {
      console.log('create new instance of', name)
      let c = { [name]: require('./' + name) }
      return instances[name] = new c[name](logger)
    }
  })
  return m
}, {})

