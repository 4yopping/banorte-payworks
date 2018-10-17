'use strict'

const EventEmitter = require('eventemitter2').EventEmitter2
const debug = require('./utils/debug')
const joi = require('joi')

/**
 * @class
 *
 * @param {Object} options
 */
class Payworks extends EventEmitter {
  constructor (options, optionsEventEmmiter) {
    !optionsEventEmmiter && (optionsEventEmmiter = {
      //
      // set this to `true` to use wildcards. It defaults to `false`.
      //
      wildcard: true,
      //
      // set this to `true` if you want to emit the newListener event. The default value is `true`.
      //
      newListener: false,
      //
      // the maximum amount of listeners that can be assigned to an event, default 10.
      //
      maxListeners: 0
    })
    super(optionsEventEmmiter)
    options = options || {}
    debug.info('options to payworks', options)
    this.user = options.user
    this.password = options.password
    this.merchant_id = options.merchant
    this.terminal_id = options.terminal
    this.default = {}
    this.user && (this.default.user = this.user)
    options.mode && (this.default.mode = options.mode)
    this.password && (this.default.password = this.password)
    this.merchant_id && (this.default.merchant_id = this.merchant_id)
    this.terminal_id && (this.default.terminal_id = this.terminal_id)
    for (let prop in this.default) {
      this.default[prop.toUpperCase()] = this.default[prop] || this.default[prop.toUpperCase()]
      prop !== prop.toUpperCase() && (delete this.default[prop])
    }
    debug.info('setting default', this.default)
  }

  /**
   * Request for an authorization
   *
   * @public
   *
   * @param {Object} params - Request Params
   * @param {number} params.amount - Amount
   * @param {string} params.reference - Reference
   * @param {string} params.entry_code - Entry Code
   * @param {string} params.card_number - Card Number
   * @param {string} params.card_exp - Card Expiry Dates (MM/YY)
   * @param {string} params.security_code - Security Code
   * @param {string} params.mode - Payworks Mode
   * @param {string} params.customer_ref1 - Payment customer reference
   * @param {(Object|undefined)} options - Extra options
   * @param {(string|undefined)} options.user - User
   * @param {(string|undefined)} options.password - Password
   * @param {(string|undefined)} options.merchant - Merchant ID
   * @param {(string|undefined)} options.terminal - Terminal ID
   * @param {(Function|undefined)} callback
   *
   * @return {Promise}
   */
  auth (_params, options, callback) {
    let params = Object.assign({}, _params)
    let schema = {
      mode: joi.string(),
      amount: joi.number().required(),
      control_number: joi.string().max(30).required(),
      initial_deferment: joi.number().max(2),
      payments_number: joi.number(),
      plan_type: joi.string(),
      entry_mode: joi.string().max(20).required(),
      card_number: joi.string().max(20).required(),
      card_exp: joi.string().max(4).required(),
      security_code: joi.string().max(4).required(),
            mode: joi.string(),
            customer_ref1: joi.string()
    }

    let requestOptions = {
      eventPrefixName: 'auth',
      transactionName: 'AUTH'
    }
    if (params.payments_number && !params.plan_type && !params.initial_deferment) throw new Error('No available')
    if (params.plan_type && !params.payments_number && !params.initial_deferment) throw new Error('No available')
    if (params.initial_deferment && !params.payments_number && !params.plan_type) throw new Error('No available')
    return Payworks.request.call(this, requestOptions, schema, params, options, callback)
  }

  /**
   * Request for a force authorization
   *
   * @public
   *
   * @param {Object} params - Request Params
   * @param {number} params.amount - Amount
   * @param {string} params.reference - Reference
   * @param {string} params.entry_code - Entry Code
   * @param {string} params.card_number - Card Number
   * @param {string} params.card_exp - Card Expiry Dates (MM/YY)
   * @param {string} params.security_code - Security Code
   * @param {string} params.mode - Payworks Mode
   * @param {string} params.customer_ref1 - Payment customer reference
   * @param {(Object|undefined)} options - Extra options
   * @param {(string|undefined)} options.user - User
   * @param {(string|undefined)} options.password - Password
   * @param {(string|undefined)} options.merchant - Merchant ID
   * @param {(string|undefined)} options.terminal - Terminal ID
   * @param {(Function|undefined)} callback
   *
   * @return {Promise}
   */
  forceAuth (_params, options, callback) {
    let params = Object.assign({}, _params)
    let schema = {
      mode: joi.string(),
      amount: joi.number().required(),
      control_number: joi.string().max(30).required(),
      entry_mode: joi.string().max(20).required(),
      card_number: joi.string().max(20).required(),
      card_exp: joi.string().max(4).required(),
      security_code: joi.string().max(4).required(),
            mode: joi.string(),
            customer_ref1: joi.string()
    }

    let requestOptions = {
      eventPrefixName: 'forceAuth',
      transactionName: 'FORCED_AUTH'
    }

    return Payworks.request.call(this, requestOptions, schema, params, options, callback)
  }

  /**
   * Request for a preauthorization
   *
   * @public
   *
   * @param {Object} params - Request Params
   * @param {number} params.amount - Amount
   * @param {string} params.reference - Reference
   * @param {string} params.entry_code - Entry Code
   * @param {string} params.card_number - Card Number
   * @param {string} params.card_exp - Card Expiry Dates (MM/YY)
   * @param {string} params.security_code - Security Code
   * @param {string} params.mode - Payworks Mode
   * @param {string} params.customer_ref1 - Payment customer reference
   * @param {(Object|undefined)} options - Extra options
   * @param {(string|undefined)} options.user - User
   * @param {(string|undefined)} options.password - Password
   * @param {(string|undefined)} options.merchant - Merchant ID
   * @param {(string|undefined)} options.terminal - Terminal ID
   * @param {(Function|undefined)} callback
   *
   * @return {Promise}
   */
  preAuth (_params, options, callback) {
    let params = Object.assign({}, _params)
    let schema = {
      mode: joi.string(),
      amount: joi.number().required(),
      control_number: joi.string().max(30).required(),
      entry_mode: joi.string().max(20).required(),
      card_number: joi.string().max(20).required(),
      card_exp: joi.string().max(4).required(),
      security_code: joi.string().max(4).required(),
            mode: joi.string(),
            customer_ref1: joi.string()
    }

    let requestOptions = {
      eventPrefixName: 'preAuth',
      transactionName: 'PREAUTH'
    }

    return Payworks.request.call(this, requestOptions, schema, params, options, callback)
  }

  /**
   * Request for a postauthorization
   *
   * @public
   *
   * @param {Object} params - Request Params
   * @param {number} params.amount - Amount
   * @param {string} params.reference - Reference
   * @param {(Object|undefined)} options - Extra options
   * @param {(string|undefined)} options.user - User
   * @param {(string|undefined)} options.password - Password
   * @param {(string|undefined)} options.merchant - Merchant ID
   * @param {(string|undefined)} options.terminal - Terminal ID
   * @param {(Function|undefined)} callback
   *
   * @return {Promise}
   */
  postAuth (_params, options, callback) {
    let params = Object.assign({}, _params)
    let schema = {
      mode: joi.string(),
      amount: joi.number().required(),
      reference: joi.string().required()
    }

    let requestOptions = {
      eventPrefixName: 'postAuth',
      transactionName: 'POSTAUTH'
    }

    return Payworks.request.call(this, requestOptions, schema, params, options, callback)
  }

  /**
   * Request for a reauthorization
   *
   * @public
   *
   * @param {Object} params - Request Params
   * @param {number} params.amount - Amount
   * @param {string} params.reference - Reference
   * @param {(Object|undefined)} options - Extra options
   * @param {(string|undefined)} options.user - User
   * @param {(string|undefined)} options.password - Password
   * @param {(string|undefined)} options.merchant - Merchant ID
   * @param {(string|undefined)} options.terminal - Terminal ID
   * @param {(Function|undefined)} callback
   *
   * @return {Promise}
   */
  reAuth (_params, options, callback) {
    let params = Object.assign({}, _params)
    let schema = {
      mode: joi.string(),
      amount: joi.number().required(),
      reference: joi.string().required()
    }

    let requestOptions = {
      eventPrefixName: 'reAuth',
      transactionName: 'REAUTH'
    }

    return Payworks.request.call(this, requestOptions, schema, params, options, callback)
  }

  /**
   * Request for a refund
   *
   * @public
   *
   * @param {Object} params - Request Params
   * @param {number} params.amount - Amount
   * @param {string} params.reference - Reference
   * @param {(Object|undefined)} options - Extra options
   * @param {(string|undefined)} options.user - User
   * @param {(string|undefined)} options.password - Password
   * @param {(string|undefined)} options.merchant - Merchant ID
   * @param {(string|undefined)} options.terminal - Terminal ID
   * @param {(Function|undefined)} callback
   *
   * @return {Promise}
   */
  refund (_params, options, callback) {
    let params = Object.assign({}, _params)
    let schema = {
      mode: joi.string(),
      amount: joi.number().required(),
      reference: joi.string().required()
    }

    let requestOptions = {
      eventPrefixName: 'refund',
      transactionName: 'REFUND'
    }

    return Payworks.request.call(this, requestOptions, schema, params, options, callback)
  }

  /**
   * Request for a cancellation
   *
   * @public
   *
   * @param {Object} params - Request Params
   * @param {string} params.reference - Reference
   * @param {(Object|undefined)} options - Extra options
   * @param {(string|undefined)} options.user - User
   * @param {(string|undefined)} options.password - Password
   * @param {(string|undefined)} options.merchant - Merchant ID
   * @param {(string|undefined)} options.terminal - Terminal ID
   * @param {(Function|undefined)} callback
   *
   * @return {Promise}
   */
  cancel (_params, options, callback) {
    let params = Object.assign({}, _params)
    let schema = {
      mode: joi.string(),
      reference: joi.string().required()
    }

    let requestOptions = {
      eventPrefixName: 'cancel',
      transactionName: 'VOID'
    }

    return Payworks.request.call(this, requestOptions, schema, params, options, callback)
  }

  /**
   * Request for a reverse
   *
   * @public
   *
   * @param {Object} params - Request Params
   * @param {string} params.reference - Reference
   * @param {string} params.control_number - Control Number
   * @param {(Object|undefined)} options - Extra options
   * @param {(string|undefined)} options.user - User
   * @param {(string|undefined)} options.password - Password
   * @param {(string|undefined)} options.merchant - Merchant ID
   * @param {(string|undefined)} options.terminal - Terminal ID
   * @param {(Function|undefined)} callback
   *
   * @return {Promise}
   */
  reverse (_params, options, callback) {
    let params = Object.assign({}, _params)
    let schema = {
      mode: joi.string(),
      reference: joi.string().required(),
      control_number: joi.string().max(30)
    }

    let requestOptions = {
      eventPrefixName: 'reverse',
      transactionName: 'REVERSAL'
    }

    return Payworks.request.call(this, requestOptions, schema, params, options, callback)
  }

  /**
   * Request for closing a transaction
   *
   * @public
   *
   * @param {Object} params - Request Params
   * @param {(Object|undefined)} options - Extra options
   * @param {(string|undefined)} options.user - User
   * @param {(string|undefined)} options.password - Password
   * @param {(string|undefined)} options.merchant - Merchant ID
   * @param {(string|undefined)} options.terminal - Terminal ID
   * @param {(Function|undefined)} callback
   *
   * @return {Promise}
   */
  close (_params, options, callback) {
    let params = Object.assign({}, _params)
    let schema = {
      mode: joi.string()
    }

    let requestOptions = {
      eventPrefixName: 'close',
      transactionName: 'MCHNT_SETTLEMENT'
    }

    return Payworks.request.call(this, requestOptions, schema, params, options, callback)
  }

  /**
   * Request for closing a transaction group
   *
   * @public
   *
   * @param {Object} params - Request Params
   * @param {string} params.group - Group
   * @param {(Object|undefined)} options - Extra options
   * @param {(string|undefined)} options.user - User
   * @param {(string|undefined)} options.password - Password
   * @param {(string|undefined)} options.merchant - Merchant ID
   * @param {(string|undefined)} options.terminal - Terminal ID
   * @param {(Function|undefined)} callback
   *
   * @return {Promise}
   */
  closeGroup (_params, options, callback) {
    let params = Object.assign({}, _params)
    let schema = {
      mode: joi.string(),
      group: joi.string().required()
    }

    let requestOptions = {
      eventPrefixName: 'closeGroup',
      transactionName: 'GROUP_SETTLEMENT'
    }

    return Payworks.request.call(this, requestOptions, schema, params, options, callback)
  }

  /**
   * Request for a transaction verification
   *
   * @public
   *
   * @param {Object} params - Request Params
   * @param {string} params.reference - Reference
   * @param {string} params.control_number - Control Number
   * @param {(Object|undefined)} options - Extra options
   * @param {(string|undefined)} options.user - User
   * @param {(string|undefined)} options.password - Password
   * @param {(string|undefined)} options.merchant - Merchant ID
   * @param {(string|undefined)} options.terminal - Terminal ID
   * @param {(Function|undefined)} callback
   *
   * @return {Promise}
   */
  verify (_params, options, callback) {
    let params = Object.assign({}, _params)
    let schema = {
      reference: joi.string(),
      mode: joi.string(),
      control_number: joi.string().max(30)
    }

    let requestOptions = {
      eventPrefixName: 'verify',
      transactionName: 'VERIFY'
    }

    return Payworks.request.call(this, requestOptions, schema, params, options, callback)
  }

  /**
   * Request for suspend a transaction
   *
   * @public
   *
   * @param {Object} params - Request Params
   * @param {string} params.reference - Reference
   * @param {(Object|undefined)} options - Extra options
   * @param {(string|undefined)} options.user - User
   * @param {(string|undefined)} options.password - Password
   * @param {(string|undefined)} options.merchant - Merchant ID
   * @param {(string|undefined)} options.terminal - Terminal ID
   * @param {(Function|undefined)} callback
   *
   * @return {Promise}
   */
  suspend (_params, options, callback) {
    let params = Object.assign({}, _params)
    let schema = {
      mode: joi.string(),
      reference: joi.string().required()
    }

    let requestOptions = {
      eventPrefixName: 'suspend',
      transactionName: 'LOCK'
    }

    return Payworks.request.call(this, requestOptions, schema, params, options, callback)
  }

  /**
   * Request for reactivate a transaction
   *
   * @public
   *
   * @param {Object} params - Request Params
   * @param {string} params.reference - Reference
   * @param {(Object|undefined)} options - Extra options
   * @param {(string|undefined)} options.user - User
   * @param {(string|undefined)} options.password - Password
   * @param {(string|undefined)} options.merchant - Merchant ID
   * @param {(string|undefined)} options.terminal - Terminal ID
   * @param {(Function|undefined)} callback
   *
   * @return {Promise}
   */
  reactivate (_params, options, callback) {
    let params = Object.assign({}, _params)
    let schema = {
      mode: joi.string(),
      reference: joi.string().required()
    }

    let requestOptions = {
      eventPrefixName: 'reactivate',
      transactionName: 'UNLOCK'
    }

    return Payworks.request.call(this, requestOptions, schema, params, options, callback)
  }
}

/**
 * Helper function to make request to Payworks. Works with coroutines or events and promises.
 * Supports schema validation and emits events depending on response.
 *
 * @static
 * @method Payworks#request
 *
 * @param {Object} requestOptions - Request Options
 * @param {Object} schema
 * @param {Object} params - Request Params
 * @param {(Object|undefined)} options - Extra options
 * @param {(string|undefined)} options.user - User
 * @param {(string|undefined)} options.password - Password
 * @param {(string|undefined)} options.merchant - Merchant ID
 * @param {(string|undefined)} options.terminal - Terminal ID
 * @param {(function|undefined)} callback
 *
 * @return {Promise}
 */
Payworks.request = require('./request')

module.exports = Payworks
