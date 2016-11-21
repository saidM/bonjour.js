const store = require('../lib/store')

const reset = () => { 
  store.reset(() => {
    // Empty the database
    console.log('DB reset done')

    // Populate the database
    store.create('fr', 'hello.world', 'Bonjour à tous !')

    return Promise.resolve()
  })
}

module.exports = { reset }
