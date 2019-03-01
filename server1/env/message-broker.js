'use strict'

const seneca = require('seneca')

class MessageBroker {

/*  bootstrapInbound () {
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
        ],
        heartbeat: 10
      })
      this_seneca.ready(() => {
        console.log('inbound ready..')
        resolve(this_seneca)
      })
    })
  }*/

  bootstrapOutbound () {
    return new Promise((resolve) => {
      console.log(`${Date.now()}`)
      let this_seneca = seneca()
      this_seneca.use('seneca-amqp-transport', { amqp: { listener: { queues: { options: { durable: false } } } } })
      this_seneca.client({
        type: 'amqp',
        url: 'amqp://guest:guest@rabbitmq:5672',
        pin: [
          // 'svc:test3,cmd:addRandomText',
          'svc:test2,cmd:addTimestamp',
        ],
        heartbeat: 10
      })
      this_seneca.ready(() => {
        console.log(`${Date.now()} outbound ready..`)
        resolve(this_seneca)
      })
    })
  }

}

module.exports = MessageBroker
