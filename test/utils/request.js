'use strict'

const assert = require('assert')
const request = require('../../lib/utils').request

const params = {
  CMD_TRANS: 'PREAUTH',
  MERCHANT_ID: '121221',
  USER: 'AB912899',
  PASSWORD: 'AB912899',
  TERMINAL_ID: '12212ABC',
  AMOUNT: 189.00,
  ENTRY_MODE: 'MANUAL',
  CARD_NUMBER: '4111111111111111',
  CARD_EXP: '1220'
}

describe('Utils#Request', function () {
  it('should be a function', function () {
    assert.equal(typeof request, 'function')
  })

  it('should make a request', function (done) {
    request(params, function (err, res) {
      if (err) return done(err)

      assert.equal(res.statusCode, 200)
      assert.equal(res.headers.codigo_payw, 'PAYW-3002')
      assert.equal(res.headers.resultado_payw, 'R')

      done()
    })
  })

  it('should make a request with yieldables', function * () {
    let res = yield request(params)

    assert.equal(res.statusCode, 200)
    assert.equal(res.headers.codigo_payw, 'PAYW-3002')
    assert.equal(res.headers.resultado_payw, 'R')
  })

  it('should not make a request without `user` param', function (done) {
    request({
      password: params.PASSWORD,
      merchant_id: params.MERCHANT_ID,
      cmd_trans: params.CMD_TRANS
    }, function (err, res) {
      if (err) {
        assert.equal(err.message, 'USER is required')
        return done()
      }

      done('should throw an error')
    })
  })

  it('should not make a request without `password` param', function (done) {
    request({
      user: params.USER,
      merchant_id: params.MERCHANT_ID,
      cmd_trans: params.CMD_TRANS
    }, function (err, res) {
      if (err) {
        assert.equal(err.message, 'PASSWORD is required')
        return done()
      }

      done('should throw an error')
    })
  })

  it('should not make a request without `merchant_id` param', function (done) {
    request({
      user: params.USER,
      password: params.PASSWORD,
      cmd_trans: params.CMD_TRANS
    }, function (err, res) {
      if (err) {
        assert.equal(err.message, 'MERCHANT_ID is required')
        return done()
      }

      done('should throw an error')
    })
  })

  it('should not make a request without `cmd_trans` param', function (done) {
    request({
      user: params.USER,
      password: params.PASSWORD,
      merchant_id: params.MERCHANT_ID
    }, function (err, res) {
      if (err) {
        assert.equal(err.message, 'CMD_TRANS is required')
        return done()
      }

      done('should throw an error')
    })
  })

  it('should make a request only with valid `cmd_trans`', function (done) {
    request(Object.assign(params, {
      cmd_trans: 'PREAUHT'
    }), function (err) {
      if (!err) return done('should throw an error')
      assert(err)
      assert.equal(err.message, 'CMD_TRANS is invalid')
    })

    request(Object.assign(params, {
      CMD_TRANS: 'AUTHH'
    }), function (err) {
      if (!err) return done('should throw an error')

      assert(err)
      assert.equal(err.message, 'CMD_TRANS is invalid')
    })

    request(Object.assign(params, {
      cmd_trans: 'AUTH'
    }), function (err) {
      if (err) return done('should not throw an error')
    })

    request(Object.assign(params, {
      cmd_trans: 'FORCED_AUTH'
    }), function (err) {
      if (err) return done('should not throw an error')
    })

    request(Object.assign(params, {
      cmd_trans: 'PREAUTH'
    }), function (err) {
      if (err) return done('should not throw an error')
    })

    request(Object.assign(params, {
      cmd_trans: 'REAUTH'
    }), function (err) {
      if (err) return done('should not throw an error')
    })

    request(Object.assign(params, {
      cmd_trans: 'POSTAUTH'
    }), function (err) {
      if (err) return done('should not throw an error')
    })

    request(Object.assign(params, {
      cmd_trans: 'REFUND'
    }), function (err) {
      if (err) return done('should not throw an error')
    })

    request(Object.assign(params, {
      cmd_trans: 'VOID'
    }), function (err) {
      if (err) return done('should not throw an error')
    })

    request(Object.assign(params, {
      cmd_trans: 'REVERSAL'
    }), function (err) {
      if (err) return done('should not throw an error')
    })

    request(Object.assign(params, {
      cmd_trans: 'MCHNT_SETTLEMENT'
    }), function (err) {
      if (err) return done('should not throw an error')
    })

    request(Object.assign(params, {
      cmd_trans: 'GROUP_SETTLEMENT'
    }), function (err) {
      if (err) return done('should not throw an error')
    })

    request(Object.assign(params, {
      cmd_trans: 'VERIFY'
    }), function (err) {
      if (err) return done('should not throw an error')
    })

    request(Object.assign(params, {
      cmd_trans: 'LOCK'
    }), function (err) {
      if (err) return done('should not throw an error')
    })

    request(Object.assign(params, {
      cmd_trans: 'UNLOCK'
    }), function (err) {
      if (err) return done('should not throw an error')
      done()
    })
  })
})
