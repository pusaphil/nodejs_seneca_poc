'use strict'

global.Promise = require('bluebird')

const seneca = require('seneca')

let initSeneca = () => {
  return new Promise((resolve) => {
    let this_seneca = seneca()

    this_seneca.use('./env/plugin')
    this_seneca.use('seneca-amqp-transport', { amqp: { listener: { queues: { options: { durable: false } } } } })
    this_seneca.listen({
      type: 'amqp',
      url: 'amqp://guest:guest@rabbitmq:5672',
      pin: [
        'svc:test2,cmd:addTimestamp',
      ]
    })
    this_seneca.ready(() => {
      console.log('Receiver ready..')
      console.log(this_seneca)
      resolve(this_seneca)
    })
    this_seneca.on('error', () => {
      console.log('panic mode!')
    })
  })
}

let globalSeneca = initSeneca().catch((err) => {
  console.log('-------------------' + err)
})

/*process.on('exit', () => {
  console.log('-------------------')
  console.log()
  // setTimeout(() => {
  //  console.log('!!!')
  globalSeneca = initSeneca()
  // }, 1000)
})*/
