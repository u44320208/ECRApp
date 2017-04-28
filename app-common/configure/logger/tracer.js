'use strict'
const EventEmitter = require('events')
const util = require('util')
const logger = require('./logger')

let write = (type, level, text) => {
  switch (type) {
    case Tracer.TRACE_ERROR:
      logger.loggerException.error(`<error:${level}> ${text}`)
      break

    case Tracer.TRACE_MESSAGE:
      logger.loggerBussiness.info(`<trace:${level}> ${text}`)
      break

    case Tracer.TRACE_BEGIN:
      logger.loggerBussiness.info(`<begin:${level}> ${text}`)
      break

    case Tracer.TRACE_END:
      logger.loggerBussiness.info(`<end:${level}>   ${text}`)
      break
  }
}

let format = (fmt, args) => util.format(fmt, ...args)

let log = (type, level, tags, fmt, args) => {
  let tags_line = tags.map(e => '' + e)
  let text = '';

  if (fmt instanceof Error) {
    let err = fmt
    type = Tracer.TRACE_ERROR
    tags_line.push(`${err.name}: ${err.message}`)
  } else if (fmt) {
    tags_line.push(format(fmt, args))
  }

  write(type, level, tags_line.join('|'))
}

class Tracer extends EventEmitter {
  static get TRACE_ERROR() { return -1 }
  static get TRACE_BEGIN() { return 0 }
  static get TRACE_END() { return 1 }
  static get TRACE_MESSAGE() { return 2 }

  constructor(level, ...tags) {
    super()
    this.parent = null
    this.level = level
    this.tags = tags
    this.timeStart = Date.now()
    this.write_log(Tracer.TRACE_BEGIN)
  }

  write_log(type, fmt = '', args) {
    log(type, this.level, this.tags, fmt, args)
    return this
  }

  end(fmt = '', ...args) {
    log(Tracer.TRACE_END, this.level, this.tags.concat([(Date.now() - this.timeStart) / 1e3]), fmt, args)
    this.emit('end')
    return this.parent
  }

  endDetach(fmt = '', ...args) {
    return this.end.bind(this, fmt, ...args)
  }

  log(fmt = '', ...args) {
    this.write_log(Tracer.TRACE_MESSAGE, fmt, args)
    return this
  }

  error(err) {
    this.log(err)
    return err
  }

  trace(...tags) {
    let inst = new Tracer(this.level + 1, ...tags)
    inst.parent = this
    return inst
  }

  flush() {
    let inst = this
    while (inst) inst = inst.end()
  }

  flushDetach() {
    return this.flush.bind(this)
  }
}

module.exports = Tracer
