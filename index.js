'use strict'

const Hapi = require('hapi'),
      server = new Hapi.Server(),
      Translator = require('./lib/translator')

server.connection({
  host: 'localhost',
  port: 8000
})

server.route({
  method: 'GET',
  path: '/translations/{locale}/{key}',
  handler: (request, reply) => {
    Translator.get(request.params.locale, request.params.key)
    .then(data => reply(data))
    .catch(err => reply({ error: err }).code(404))
  }
})

server.start((err) => {
  if (err) throw err
  console.log('Server running on port 8000...')
})

module.exports = server

