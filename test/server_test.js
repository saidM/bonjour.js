'use strict'

const expect = require('chai').expect,
      request = require('supertest'),
      server = require('../index')

describe('Server', () => {
  after(() => server.stop)

  describe('GET /translations/{locale}/{key}', () => {
    it('returns 404 if the match locale/key does not exist', (done) => {
      request(server.listener).get('/translations/fr/unknown.key').expect(404, done)
    })

    it('returns 200 if the match locale/key does exist', (done) => {
      request(server.listener).get('/translations/fr/hello.world').expect(200, done)
    })
  })
})

