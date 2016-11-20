'use strict'

const chai = require('chai'),
      expect = chai.expect,
      chaiAsPromised = require('chai-as-promised'),
      translator = require('../lib/translator')

chai.use(chaiAsPromised)

describe('Translator Service', () => {
  describe('getTranslation(locale, key)', () => {
    it('rejects the promise if the match locale/key does not exist', () => {
      return expect(translator.getTranslation('fr', 'unknown.key')).to.be.rejected
    })

    it('resolves the promise if the match locale/key does exist', () => {
      return expect(translator.getTranslation('fr', 'hello.world')).to.be.fulfilled
    })
  })
})
