'use strict'

const Tracer = require('../configure/logger/tracer')

function getNameFromStack(level) {
  let stack = new Error().stack.toString().split('\n')
  level++
  while (level--) stack.shift()
  let [, name] = (stack.shift() || '').match(/at (.+) .*/)
  return name || 'Unknown'
}

let Tracable = Base => class extends Base {
  _new_tracer_(name, ...tags) {
    return (this._tracer instanceof Tracer) ? this._tracer.trace(name, ...tags) : new Tracer(0, name, ...tags)
  }

  trace(...tags) {
    return this.tracer = this._new_tracer_(getNameFromStack(2), ...tags)
  }

  track(f, ...tags) {
    let tracer = this._new_tracer_(getNameFromStack(2), ...tags)
    let result = f ? f(tracer) : undefined
    tracer.end()
    return result
  }

  set tracer(new_tracer) {
    let old_tracer = this._tracer
    this._tracer = new_tracer
    new_tracer.once('end', () => this._tracer = old_tracer)
  }

  get tracer() {
    return this._tracer
  }

  pushTracer(tracer) {
    this.tracer = tracer
    return this
  }
}

module.exports = Tracable
