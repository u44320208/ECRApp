require('dotenv').config();
module.exports = {
  development:{
    graylog:{
        name: 'Graylog',
        level: 'debug',
        silent: false,
        handleExceptions: false,
        prelog: function (msg) {
          return msg.trim();
        },
        graylog: {
          servers: [{ host: process.env.GRAYLOG_HOST, port: process.env.GRAYLOG_PORT }],
          hostname: 'KROK_API_DEV',
          facility: 'krok_api',
          bufferSize: 1400
        },
        staticMeta: { env: 'development' }
      }
  },
  test:{
     graylog:{
        name: 'Graylog',
        level: 'debug',
        silent: false,
        handleExceptions: false,
        prelog: function (msg) {
          return msg.trim();
        },
        graylog: {
          servers: [{ host: process.env.GRAYLOG_HOST, port: process.env.GRAYLOG_PORT }],
          hostname: 'KROK_API_TEST',
          facility: 'krok_api',
          bufferSize: 1400
        },
        staticMeta: { env: 'test' }
      }
  },
  production:{
     graylog:{
        name: 'Graylog',
        level: 'debug',
        silent: false,
        handleExceptions: false,
        prelog: function (msg) {
          return msg.trim();
        },
        graylog: {
          servers: [{ host: process.env.GRAYLOG_HOST, port: process.env.GRAYLOG_PORT }],
          hostname: 'KROK_API_PROD',
          facility: 'krok_api',
          bufferSize: 1400
        },
        staticMeta: { env: 'production' }
      }
  }

}
