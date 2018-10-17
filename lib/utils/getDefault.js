'use strict'
const debug = require('./debug')
module.exports = function (params) {
  debug.info('default to payworks', this.default)

  for (let prop in this.default) {
    params[prop] = this.default[prop]
  }
}
