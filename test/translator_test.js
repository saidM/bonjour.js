'use strict'

process.env.NODE_ENV = 'test'

const chai = require('chai'),
      expect = chai.expect,
      chaiAsPromised = require('chai-as-promised'),
      translator = require('../lib/translator')

chai.use(chaiAsPromised)

describe('Translator Service', () => {
  describe('getTranslation(locale, key)', () => {
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
})
