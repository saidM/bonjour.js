'use strict'

process.env.NODE_ENV = 'test'

const chai = require('chai'),
      expect = chai.expect,
      chaiAsPromised = require('chai-as-promised'),
      translator = require('../lib/translator'),
      helper = require('./test_helper')

chai.use(chaiAsPromised)

describe('Translator Service', () => {
  before(() => helper.reset())

  describe('get(locale, key)', () => {
    context('when there is a key param', () => {
      it('rejects the promise if the match locale/key does not exist', () => {
        return expect(translator.get('fr', 'unknown.key')).to.be.rejected
      })

      it('resolves the promise if the match locale/key does exist', () => {
        return expect(translator.get('fr', 'hello.world')).to.eventually.become({ locale: 'fr', key: 'hello.world', value: 'Bonjour à tous !' })
      })
    })

    context('when there is no key param', () => {
      it('rejects the promise if the locale param does not exist in the database', () => {
        return expect(translator.get('unknown.locale')).to.be.rejected
      })

      it('resolves the promise if the locale does exist', () => {
        return expect(translator.get('fr')).to.eventually.become([
          { locale: 'fr', key: 'hello.world', value: 'Bonjour à tous !' },
          { locale: 'fr', key: 'how.are.you', value: 'Comment ça va ?' }
        ])
      })
    })
  })

  describe('create(locale, key, value)', () => {
    it('resolves the promise if the translation was added', () => {
      return expect(translator.create('en', 'hello.world', 'Hello World!')).to.eventually.become({ locale: 'en', key: 'hello.world', value: 'Hello World!' })
    })
    
    it('rejects the promise if the match locale/key already exists', () => {
      return expect(translator.create('en', 'hello.world', 'Hello!')).to.be.rejected
    })
  })
  
  describe('update(locale, key, value)', () => {
    it('rejects the promise if the match locale/key does not exist', () => {
      return expect(translator.update('en', 'unknown.key', 'Hello World!')).to.be.rejected
    })
    
    it('resolves the promise if the match locale/key exists and the value was updated', () => {
      return expect(translator.update('fr', 'hello.world', 'Bonjour !')).to.eventually.become({ locale: 'fr', key: 'hello.world', value: 'Bonjour !' })
    })
  })
  
  describe('delete(locale, key)', () => {
    it('rejects the promise if the match locale/key does not exist', () => {
      return expect(translator.destroy('en', 'unknown.key')).to.be.rejected
    })
    
    it('resolves the promise if the match locale/key exists and was removed from the database', () => {
      return expect(translator.destroy('fr', 'hello.world')).to.eventually.become({ locale: 'fr', key: 'hello.world' })
    })
  })
})
