'use strict'

const uuid = require('uuid')

module.exports = function(options){

  let seneca = this

  seneca.add('svc:test1,cmd:addUUID', (args, done) => {
    args.uuid = uuid.v4()
    done(null, args)
  })

  seneca.add('svc:test1,cmd:addProcessedTag', (args, done) => {
    setTimeout(() => {
      console.log('addProcessedTag: ', args)
      args.is_processed = true
      done(args)
    }, 5000)
  })

}
