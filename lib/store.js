'use strict'

const fs = require('fs'),
      _ = require('lodash'),
      exists = fs.existsSync('translations.db'),
      sqlite3 = require('sqlite3').verbose(),
      db = new sqlite3.Database('translations.db')

class Store {
  constructor() {
    // Create the table if it does not exist already
    if (!exists) db.run('CREATE TABLE translations (locale VARCHAR(3), key VARCHAR(255), value VARCHAR(255), PRIMARY KEY (locale, key))')
  }

  get(locale, key = null) {
    return new Promise((resolve, reject) => {
      const query = (key == null) ? 'SELECT * FROM translations WHERE locale = ?' : 'SELECT * FROM translations WHERE locale = ? AND key = ?'
      const queryParams = (key == null) ? [locale] : [locale, key]

      db.all(query, queryParams, ((err, row) => {
        if (err) reject(err)

        if (row.length == 0) return reject('No results returned')

        if (key == null) {
          // Return all the translations as a Hash (scheme: hello.world: 'bonjour')
          const hash = _.fromPairs(row.map((item) => {
            return ([item.key, item.value])
          }))

          resolve(hash)
        } else {
          // Set the translation key as the object key
          const obj = {}
          obj[row[0].key] = row[0].value

          resolve(obj)
        }
      }))
    })
  }
  
  create(locale, key, value) {
    return new Promise((resolve, reject) => {
      db.run("INSERT INTO translations (locale, key, value) VALUES (?, ?, ?)", [locale, key, value], ((err, row) => {
        if (err) reject(err)

        const obj = {}
        obj[key] = value
        resolve(obj)
      }))
    })
  }
  
  update(locale, key, value) {
    // Does the couple locale/key exist in the database?
    return this.get(locale, key)
    .then(() => {
      // Try to update it
      return new Promise((resolve, reject) => {
        db.run("UPDATE translations SET value = ? WHERE locale = ? AND key = ?", [value, locale, key], ((err, row) => {
          if (err) reject(err)
          
          const obj = {}
          obj[key] = value
          resolve(obj)
        }))
      })
    })
    .catch(() => Promise.reject('Couple locale/key does not exist in the database'))
  }

  destroy(locale, key) {
    // Does the couple locale/key exist in the database?
    return this.get(locale, key)
    .then(() => {
      return new Promise((resolve, reject) => {
        db.run('DELETE FROM translations WHERE locale = ? AND key = ?', [locale, key], ((err, row) => {
          if (err) reject(err)
          resolve({ deleted: true })
        }))
      })
    })
    .catch(() => Promise.reject('Couple locale/key does not exist in the database'))
  }

  // Delete all the translations from the database (only used in test environment)
  reset(cb) {
    db.run('DELETE FROM translations', () => {
      cb()
    })
  }
}

module.exports = new Store()
