'use strict'
const { logger } = require('../../app-common')
require('dotenv').config();

const fs = require("fs")
const path = require("path")
const _ = require('lodash')
const Sequelize = require("sequelize")

const env = process.env.NODE_ENV || "development"

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: {
      max: process.env.DB_POOL_MAX,
      min: process.env.DB_POOL_MIN,
      idle: process.env.DB_POOL_IDLE
    }
  }
)

const domPath = path.join(__dirname, '..', 'dom')

let tracer = logger.trace('sequelize')

const db = fs.readdirSync(domPath)
  .filter(file => (file.indexOf(".") !== 0) && (file !== "index.js"))
  .reduce((m, file) => {
    let import_tracer = tracer.trace('import')
    let modelPath = path.join(domPath, file)
    import_tracer.log('import model : %s', modelPath)
    var model = sequelize.import(modelPath)
    m[model.name] = model
    import_tracer.end()
    return m
  }, {})

_.forEach(db, model => (model.associate) && model.associate(db))

tracer.end()

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
