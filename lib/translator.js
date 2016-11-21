'use strict';

const store = require('./store')

const get = function(locale, key) {
  return store.get(locale, key)
}

const create = function(locale, key, value) {
  return store.create(locale, key, value)
}

module.exports = { get, create }
