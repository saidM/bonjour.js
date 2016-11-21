'use strict'

process.env.NODE_ENV = 'test'

const chai = require('chai'),
      expect = chai.expect,
      chaiAsPromised = require('chai-as-promised'),
      translator = require('../lib/translator'),
      store = require('../lib/store')

chai.use(chaiAsPromised)

describe('Translator Service', () => {
  describe('get(locale, key)', () => {
    before(() => {
      console.log('add fixture in db')
      store.create('fr', 'hello.world', 'Bonjour à tous !')
    })

    it('rejects the promise if the match locale/key does not exist', () => {
      return expect(translator.get('fr', 'unknown.key')).to.be.rejected
    })

    it('resolves the promise if the match locale/key does exist', () => {
      const promise = translator.get('fr', 'hello.world')
      
      return Promise.all[
        expect(promise).to.be.fulfilled,
        expect(promise).to.eventually.have.property('value', 'Bonjour à tous !')
      ]
    })
  })

  describe('create(locale, key, value', () => {
    before(() => store.reset(function() { console.log('db reset done') } ))
    
    it('resolves the promise if the translation was added', () => {
      return expect(translator.create('en', 'hello.world', 'Hello World!')).to.be.fulfilled
    })
    
    it('rejects the promise if the match locale/key already exists', () => {
      return expect(translator.create('en', 'hello.world', 'Hello!')).to.be.rejected
    })
  })
})
