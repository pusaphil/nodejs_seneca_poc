'use strict'

class Controller {
  constructor (env) {
    this.env = env
  }

  create () {
    return (req, res, next) => {
      console.log('========', this.env.messageBrokerInbound)
      res.json(201, {msg: 'ok'})
      return next(false)
    }
  }
}

module.exports = Controller
