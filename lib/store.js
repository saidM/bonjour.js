'use strict'

const fs = require('fs'),
      exists = fs.existsSync('translations.db'),
      sqlite3 = require('sqlite3').verbose(),
      db = new sqlite3.Database('translations.db')

class Store {
  constructor() {
    if (!exists) {
      db.run('CREATE TABLE translations (locale VARCHAR(3), key VARCHAR(255), value VARCHAR(255), PRIMARY KEY (locale, key))')
      console.log('create table')
    } else {
      console.log('table exists')
    }
  }

  get(locale, key) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM translations WHERE locale = ? AND key = ?", [locale, key], ((err, row) => {
        if (err) reject(err)
        if (typeof row === 'undefined') reject('Couple locale/key did not return a value')
        resolve(row)
      }))
    })
  }
  
  create(locale, key, value) {
    return new Promise((resolve, reject) => {
      db.run("INSERT INTO translations (locale, key, value) VALUES (?, ?, ?)", [locale, key, value], ((err, row) => {
        if (err) reject(err)
        resolve({ locale, key, value })
      }))
    })
  }

  // Delete all the translations from the database (only used in test environment)
  reset(cb) {
    db.run('DELETE FROM translations', () => {
      cb()
    })
  }
}

module.exports = new Store()
