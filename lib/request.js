'use strict'

const assert = require('assert')
const co = require('co')
const request = require('./utils').request
const validate = require('./utils').validate
const debug = require('./utils/debug')
const getDefault = require('./utils/getDefault')

/**
 * Helper function to make request to Payworks. Works with coroutines or events and promises.
 * Supports schema validation and emits events depending on response.
 *
 * @param {string} options
 * @param {string} options.eventPrefixName
 * @param {string} options.transactionName
 * @param {Object} schema
 * @param {Object} params
 * @param {(function|undefined)} callback
 *
 * @return {PromiseEmitter}
 */
module.exports = function (requestOptions, schema, params, options, callback) {
  debug.info('params to payworks', params)
  assert(params)
  assert(params instanceof Object)
  assert(schema)
  assert(schema instanceof Object);
  (typeof options === 'function') && (callback = options) && (options = {});
  (typeof options !== 'function') && (options = options || {})

  callback = typeof callback === 'function' ? callback : function noop () {}

  return co.call(this, function * () {
    for (let prop in schema) {
      schema[prop.toUpperCase()] = schema[prop] || schema[prop.toUpperCase()]
      if (prop !== prop.toUpperCase()) delete schema[prop]
    }
    for (let prop in params) {
      params[prop.toUpperCase()] = params[prop] || params[prop.toUpperCase()]
      prop !== prop.toUpperCase() && (delete params[prop])
    }
    params = yield validate(params, schema)
    params.cmd_trans = requestOptions.transactionName
      // Replace auth variables
    options.user && (params.user = options.user)
    options.password && (params.password = options.password)
    options.merchant && (params.merchant_id = options.merchant)
    options.terminal && (params.terminal_id = options.terminal)
    for (let prop in params) {
      if (prop !== prop.toUpperCase()) {
        params[prop.toUpperCase()] = params[prop] || params[prop.toUpperCase()]
        prop !== prop.toUpperCase() && (delete params[prop])
      }
    }
    getDefault.call(this, params)
    debug.info('request to payworks', params)
    return yield request(params)
  })
    .then((res) => {
      let code = res.headers.codigo_payw
      let result = res.headers.resultado_payw
      code && (this.emit(code, res.headers))

      if (/^(D|R|T)$/i.test(result)) {
        Object.assign(res.headers, {method: requestOptions.eventPrefixName})
        setImmediate(callback, res.headers, null, res);
        (result === 'D') && (this.emit(`${requestOptions.eventPrefixName}.declined`, res.headers));
        (result === 'R') && (this.emit(`${requestOptions.eventPrefixName}.rejected`, res.headers));
        (result === 'T') && (this.emit(`${requestOptions.eventPrefixName}.notAnswer`, res.headers))
      } else {
        setImmediate(callback, null, res.headers, res);
        (result === 'A') && (this.emit(`${requestOptions.eventPrefixName}.approved`, res.headers))
      }
      return res.headers
    })
    .catch((err) => {
      setImmediate(callback, err, null, null)
      this.emit(`${requestOptions.eventPrefixName}.error`, err)
      return Promise.reject(err)
    })
}
