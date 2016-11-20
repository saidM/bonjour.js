'use strict';

const getTranslation = function(locale, key) {
  return new Promise((resolve, reject) => {
    if (key == 'hello.world') resolve({ locale: locale, key: key, translation: 'Bonjour' })
    reject()
  })
}

module.exports = {
  getTranslation: getTranslation
}
