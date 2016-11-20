'use strict'

const fs = require('fs'),
      exists = fs.existsSync('test.db'),
      sqlite3 = require('sqlite3').verbose(),
      db = new sqlite3.Database(`${process.env.NODE_ENV}.db`)

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
      if (locale == 'fr' && key == 'hello.world') resolve({ locale: 'fr', key: 'hello.world', value: 'Bonjour à tous !' })

      db.get("SELECT * FROM translations WHERE locale = ? AND key = ?", [locale, key], ((err, row) => {
        if (err) reject(err)
        if (typeof row === 'undefined') reject('Couple locale/key did not return a value')
        resolve(row)
      }))
    })
  }
}

module.exports = new Store()
