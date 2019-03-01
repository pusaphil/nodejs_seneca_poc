'use strict'

module.exports = function(options){

  let seneca = this

  seneca.add('svc:test2,cmd:addTimestamp', (args, done) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('svc:test2,cmd:addTimestamp')
        args.created_at = new Date()
        resolve(done(null, args))
      }, 5000)
    }).catch(err => done(err, null))

  })
}
