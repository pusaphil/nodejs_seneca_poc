'use strict'

const MessageBroker = require(global.appPath + '/env/message-broker')

class Controller {
  constructor (env) {
    this.env = env
  }

  create () {
    return (req, res, next) => {
      console.log(`--> ${JSON.stringify(req.body, null, 4)}`)
      console.log(`${global.appPath}`)
      this.env.messageBrokerOutbound.act('svc:test2,cmd:addTimestamp', req.body, function (err, result){
        if (err) {
          res.json(500, {msg: err})
          let msgBrkr = new MessageBroker()
          this.env.messageBrokerInbound = msgBrkr.bootstrapInbound().then((newInboundMsgBroker) => {
             return newInboundMsgBroker
          })
        }

        Object.keys(result).forEach((key) => {
          if (String(key).indexOf('$') > 0) {
            delete result[key]
          }
        })
        res.json(201, result)
        return next(false)

      })
    }
  }
}

module.exports = Controller
