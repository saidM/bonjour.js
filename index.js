'use strict'

const Hapi       = require('hapi'),
      server     = new Hapi.Server(),
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

server.route({
  method: 'POST',
  path: '/translations/{locale}/{key}',
  handler: (request, reply) => {
    if (!request.payload) {
      reply({ error: "Missing 'value' parameter" }).code(400)
    } else {
      Translator.create(request.params.locale, request.params.key, request.payload.value)
      .then(data => reply(data).code(202))
      .catch(err => reply({ error: err }).code(409))
    }
  }
})

server.start((err) => {
  if (err) throw err
  console.log('Server running on port 8000...')
})

// Export the server so we can use it in the test suite
module.exports = server

