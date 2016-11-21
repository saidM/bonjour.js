'use strict'

const expect = require('chai').expect,
      request = require('supertest'),
      server = require('../index'),
      helper = require('./test_helper')

describe('Server', () => {
  before(() => helper.reset())
  after(() => server.stop)

  describe('GET /translations/{locale}/{key}', () => {
    it('returns 404 if the match locale/key does not exist', (done) => {
      request(server.listener).get('/translations/fr/unknown.key').expect(404, done)
    })

    it('returns 200 if the match locale/key does exist', (done) => {
      request(server.listener).get('/translations/fr/hello.world').expect(200, done)
    })
  })
  
  describe('POST /translations/{locale}/{key}', () => {
    it("returns 400 if the 'value' param is missing", (done) => {
      request(server.listener).post('/translations/fr/unknown.key').expect(400, done)
    })
    
    it('returns 409 if the match locale/key already exists in the database', (done) => {
      request(server.listener).post('/translations/fr/hello.world').field('value', 'Bonjour').expect(409, done)
    })

    it('returns 202 if the translation was added to the database', (done) => {
      request(server.listener).post('/translations/ar/hello.world').field('value', 'Salam').expect(202, done)
    })
  })
  
  describe('PUT /translations/{locale}/{key}', () => {
    it("returns 400 if the 'value' param is missing", (done) => {
      request(server.listener).put('/translations/fr/unknown.key').expect(400, done)
    })
    
    it('returns 404 if the match locale/key does not already exists in the database', (done) => {
      request(server.listener).put('/translations/unknown.locale/hello.world').field('value', 'Bonjour').expect(404, done)
    })
    
    it('returns 200 if the translation was updated in the database', (done) => {
      request(server.listener).put('/translations/fr/hello.world').field('value', 'Bonjour2').expect(200, done)
    })
  })
})

