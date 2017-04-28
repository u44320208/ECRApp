'use strict'

const winston = require('winston');
winston.emitErrs = true;
const WinstonGraylog2 = require('winston-graylog2')
const env = process.env.NODE_ENV || "development"
const graylogOption = require('./../config')[env].graylog


let defaultTransportOptions = {
  file: {
    handleExceptions: true,
    json: true,
    colorize: false,
    maxsize: 5242880, //5MB
    maxFiles: 5
  },
  console: {
    handleExceptions: true,
    json: false,
    colorize: true
  }
}

let transportOptions = {
  bussiness: {
    // file: Object.assign(
    //   {
    //     level: 'debug',
    //     filename: '../../logs/all-logs.log'
    //   },
    //   defaultTransportOptions.file
    // ),

    // console: Object.assign(
    //   {
    //     level: 'debug'
    //   },
    //   defaultTransportOptions.console
    // ),
    graylog: Object.assign(
      graylogOption
    )
  },
  exception: {
    // file: Object.assign(
    //   {
    //     level: 'error',
    //     filename: '../../logs/exception-logs.log'
    //   },
    //   defaultTransportOptions.file
    // ),

    console: Object.assign(
      {
        level: 'error'
      },
      defaultTransportOptions.console
    ),
    graylog: Object.assign(
      graylogOption
    )
  }
}

let make_logger = (transportOption) => {
  return new winston.Logger({
    transports: [
      // new winston.transports.File(transportOption.file),
      new winston.transports.Console(transportOption.console),
      new (WinstonGraylog2)(transportOption.graylog)
    ],
  })
}

module.exports = {
  loggerBussiness: make_logger(transportOptions.bussiness),
  loggerException: make_logger(transportOptions.exception),
  stream: {
    write: (message, encoding) => loggerBussiness.info(message)
  }
}
