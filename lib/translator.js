'use strict';

const store = require('./store')

const get = function(locale, key) {
  return store.get(locale, key)
}

const create = function(locale, key, value) {
  return store.create(locale, key, value)
}

const update = function(locale, key, value) {
  return store.update(locale, key, value)
}

const destroy = function(locale, key) {
  return store.destroy(locale, key)
}

module.exports = { get, create, update, destroy }
