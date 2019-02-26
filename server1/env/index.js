'use strict'

const Http = require('./http')
const MessageBroker = require('./message-broker')

class Env {
  constructor () {
    this.http = new Http()
    this.messageBroker = new MessageBroker()
  }
}

module.exports = Env
