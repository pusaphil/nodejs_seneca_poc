'use strict'

const _ = require('lodash')
const restify = require('restify')
const expressValidator = require('express-validator')

class HttpServer {
  bootstrap () {
    return new Promise((resolve) => {
      console.info('Bootstrapping HTTP Server...')

      let server = restify.createServer({
        name: 'server1',
        acceptable: ['application/json']
        // acceptable: ['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data']
      })

      server.pre(restify.plugins.pre.context())
      server.pre(restify.plugins.pre.dedupeSlashes())
      server.pre(restify.plugins.pre.sanitizePath())
      server.pre(restify.plugins.pre.userAgentConnection())

      server.use(restify.plugins.acceptParser(server.acceptable))
      server.use(restify.plugins.queryParser({ mapParams: false }))
      server.use(restify.plugins.bodyParser({
        maxBodySize: 500 * 1024, // 500 KB
        mapParams: false,
        mapFiles: false,
        overrideParams: false
      }))

      server.use(expressValidator())

      server.use((req, res, next) => {
        res.set({
          'Access-Control-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Host, Authorization, Content-Type, Content-Length, Cache-Control',
          'Access-Control-Expose-Headers': 'Request-Id, Response-Time',
          'Access-Control-Allow-Credentials': 'true'
        })

        next()
      })

      server.on('restifyError', (req, res, err, next) => {
        req.log.error(err)
        next()
      })

      console.info('HTTP Server bootstrapped.')

      this.server = server

      resolve(server)
    })
  }

  listen () {
    return new Promise((resolve, reject) => {
      this.server.listen(3000, (err) => {
        if (!_.isNil(err)) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  close () {
    console.info('Closing HTTP Server.')

    return new Promise((resolve) => {
      this.server.removeAllListeners()

      this.server.once('close', () => {
        resolve()
      })

      this.server.close()
    })
  }
}

module.exports = HttpServer
