'use strict'

const Controller = require('./controller')

class Router {
  constructor (env) {
    this.env = env
    this.controller = new Controller(env)
  }

  bootstrap () {
    console.log('---------> ', this.env.httpServer)
    return new Promise(resolve => {
      this.env.httpServer.post({
        name: `test1-add`,
        path: '/'
      },
        this.controller.create()
      )

      resolve()
    })
  }
}

module.exports = Router
