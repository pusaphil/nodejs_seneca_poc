'use strict'

global.Promise = require('bluebird')
global.appPath = __dirname

const _ = require('lodash')

const API = require('./api')
const Env = require('./env')

let env = new Env()

let gracefulExit = function () {
  return Promise.all([
    env.http.close()
  ]).timeout(3000)
}

let Api = new API()

module.exports = Promise.props({
  httpServer: env.http.bootstrap(),
  messageBrokerOutbound: env.msgBrkr.bootstrapOutbound()

}).then(environment => {
  return Api.bootstrap(environment).then(() => {
    return Promise.resolve(environment)
  })
}).then((environment) => {
  return env.http.listen().then(() => {
    console.log('server starting..')

    return Promise.resolve()
  })
}).catch((err) => {
  console.log('!!!! ERROR...', err)

  throw err
})

_.forEach(['SIGHUP', 'SIGINT', 'SIGTERM'], (signal) => {
  process.once(signal, () => {
    console.log(`Executing ${signal} listener...`)

    gracefulExit().then(() => {
      console.log('Graceful exit done. Terminating process...')
      process.exit(1)
    }).catch(Promise.TimeoutError, () => {
      console.log.warn('Graceful exit timeout. Force terminating process...')
      process.exit(1)
    }).catch((err) => {
      console.log.error(err)

      setTimeout(() => {
        process.exit(1)
      }, 5000)
    })
  })
})
