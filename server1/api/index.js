'use strict'

const glob = require('globby')

class API {
  bootstrap (env) {

    return glob([`${__dirname}/**/router.js`]).then((routes) => {
      return Promise.each(routes, (route) => {
        let Router = require(route)
        let router = new Router(env)

        return router.bootstrap()
      })
    })
  }
}

module.exports = API
