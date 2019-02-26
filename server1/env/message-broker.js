'use strict'

const seneca = require('seneca')

class MessageBroker {

  bootstrapInbound () {
    return new Promise((resolve) => {
      let this_seneca = seneca()
      this_seneca.use('./plugin')
      this_seneca.use('seneca-amqp-transport', { amqp: { listener: { queues: { options: { durable: false } } } } })
      this_seneca.listen({
        type: 'amqp',
        url: 'amqp://guest:guest@rabbitmq:5672',
        pin: [
          'svc:test1,cmd:addUUID',
          'svc:test1,cmd:addProcessedTag',
        ]
      })
      this_seneca.ready(() => {
        resolve(this_seneca)
      })
    })
  }

  bootstrapOutbound () {
    return new Promise((resolve) => {
      let this_seneca = seneca()
      this_seneca.use('seneca-amqp-transport', { amqp: { listener: { queues: { options: { durable: false } } } } })
      this_seneca.client({
        type: 'amqp',
        url: 'amqp://guest:guest@rabbitmq:5672',
        pin: [
          // 'svc:test3,cmd:addRandomText',
          'svc:test2,cmd:addTimestamp',
        ]
      })
      this_seneca.ready(() => {
        resolve(this_seneca)
      })
    })
  }

}

module.exports = MessageBroker
