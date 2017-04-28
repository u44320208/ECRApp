var MessageFormat = require('messageformat');
var BSErrorMsg = require('../configure/bs_error_msg');

const DEFALUT_ERROR_CODE = '110001'

const compiler = new MessageFormat('en')
let compiledCatalog = {}

function format(code, params) {
  if (!compiledCatalog[code]) {
    compiledCatalog[code] = compiler.compile(BSErrorMsg.messages[code])
  }

  return compiledCatalog[code](params)
}

module.exports = class BSException extends Error {
  constructor(code, message, params) {
    code = code || DEFALUT_ERROR_CODE

    if (params != null && params.length > 0) {
      message = format(code, params);
    }

    super(message)

    this.errorCode = (code || '');
    this.errorMessage = (message || '');
  }
}
