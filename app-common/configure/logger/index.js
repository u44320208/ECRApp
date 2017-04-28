'use strict'

var logger = require('./logger');
const Tracer = require('./tracer')
var point = { 's': 's', 'e': 'e', 'b': 'b', 'ex': 'ex' };

let loggerMessage = (methodName, logPoint, processTracking, keyVal, timeSpend, message) => {
  for (let c = 5; c; c--) console.warn(new Error().stack.split('\n')[2].match(/at (.+)/)[1], 'logger module log() function is deprecated, use Tracer or Tracable.trace() instead')


  var message = loggerMessageFormat(methodName, logPoint, processTracking, keyVal, timeSpend, message);

  if (point.ex == logPoint) {
    logger.loggerException.error(message);
    // monitoring log
  } else if (point.b == logPoint) {
    logger.loggerBussiness.debug(message);
  } else {
    logger.loggerBussiness.info(message);
  }
}


function loggerMessageFormat(methodName, logPoint, processTracking, keyVal, timeSpend, message) {
  return methodName + '|' + logPoint + '|' + processTracking + '|' + keyVal + '|' + timeSpend + '|' + message;
}

module.exports = {
  log: loggerMessage,
  point: point,
  trace: (...tags) => new Tracer(0, ...tags)
};
