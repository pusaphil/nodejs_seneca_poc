'use strict'

const MessageBroker = require(global.appPath + '/env/message-broker')

class Controller {
  constructor (env) {
    this.env = env
  }

  create () {
    return (req, res, next) => {
      console.log(`--> ${JSON.stringify(req.body, null, 4)}`)
      console.log(`${global.appPath} | ${typeof this.env.messageBrokerOutbound}`)

      let {msgBrkrInstance, err, resp} = this.callAddTimestamp(req.body).then(
        (result) => {
          let respBody = this.removeDollarSignVars(result)
          res.json(201, respBody)
          return next(false)
        }
      ).catch(
        (err) => {
          console.log(`!!!! ${JSON.stringify(err, null, 4)}`)

          if (typeof this.env.messageBrokerOutbound !== 'undefined') {
            this.env.messageBrokerOutbound.close()
          }

          let msgBrkr = new MessageBroker()

          msgBrkr.bootstrapOutbound().then(newEnv => {
            console.log('**new inbound ready..')
            console.log(`** ${newEnv}`)
            this.returnNext(res, next, newEnv, {msg: err.msg})
          })

        }
      )
    }
  }

  returnNext (res, next, newMsgBrkr, resBody) {
    // Reassign value of new initialized Seneca connection to this.env.messageBrokerOutbound
    this.env.messageBrokerOutbound = newMsgBrkr

    // Return response
    res.json(500, resBody)
    return next(false)

  }

  callAddTimestamp (reqBody) {
    return new Promise(
      (resolve, reject) => {
        this.env.messageBrokerOutbound.act('svc:test2,cmd:addTimestamp', reqBody, function (err, result){
          if (err) reject(err)

          resolve(result)
        })
      }
    )
  }

  removeDollarSignVars (result) {
    Object.keys(result).forEach((key) => {
      if (String(key).indexOf('$') > 0) {
        delete result[key]
      }
    })

    return result
  }
}

module.exports = Controller
