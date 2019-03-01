'use strict'

module.exports = function(options){

  let seneca = this

  seneca.add('svc:test1,cmd:addUUID', (args, done) => {
    setTimeout(() => {
      args.uuid = uuid.v4()
      done(null, args)
    }, 1000)
  })

  seneca.add('svc:test1,cmd:addProcessedTag', (args, done) => {
    setTimeout(() => {
      console.log('addProcessedTag: ', args)
      args.is_processed = true
      done(args)
    }, 4000)
  })
}
