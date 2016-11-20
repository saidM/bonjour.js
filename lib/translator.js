'use strict';

const store = require('./store')

const get = function(locale, key) {
  return store.get(locale, key)
}

module.exports = { get }
