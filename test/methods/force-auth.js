'use strict'

const assert = require('assert')
const Payworks = require('../../lib')

let payworks = new Payworks({
  mode: 'AUT',
  merchant: '121221',
  user: 'AB912899',
  password: 'AB912899',
  terminal: '12212ABC'
})

describe('Payworks#forceAuth', function () {
  beforeEach(function () {
    this.params = {
      amount: 189.00,
      entry_mode: 'MANUAL',
      card_number: '4111111111111111',
      card_exp: '1220',
      security_code: '123'
    }
  })

  it('should failed when params are missing', function (done) {
    try {
      payworks.forceAuth()
      done('should throw an error when params are missing')
    } catch (e) {
      done()
    }
  })

  it('should validate params', function (done) {
    let required = [
      'amount',
      'card_number',
      'card_exp',
      'security_code',
      'entry_mode'
    ]
    payworks.on('forceAuth.error', function (err) {
      try {
        assert.equal(err.name, 'ValidationError')

        for (let param of required) {
          // Get error from each path
          let e = err.details.filter(e => e.path === param)
          assert(e.length, `should throws a validation error when the \`${param}\` property is missing`)
          assert.equal(e[0].type, 'any.required')
        }
        done()
      } catch (e) {
        done(e)
      }
    })
    payworks.forceAuth({})
  })

  it('should obtain a result with callbacks', function (done) {
    payworks.forceAuth(this.params, function (error, body, response) {
      if (error) {
        try {
          assert(/^(R|D|T)$/i.test(error.resultado_payw), 'should throw a transactional error')
          return done()
        } catch (e) {
          return done(e)
        }
      }

      assert(body.resultado_payw)
      assert(response.headers)
      assert.equal(response.headers.resultado_payw, body.resultado_payw)
      done()
    })
  })

  it('should obtain a result with yieldables', function * () {
    let body = yield payworks.forceAuth(this.params)
    assert(body.resultado_payw)
  })

  it('should obtain a result with thenables', function * (done) {
    payworks.forceAuth(this.params)
    .then(function (body) {
      assert(body.resultado_payw)
      done()
    })
    .catch(done)
  })

  it('should obtain a result with events', function (done) {
    payworks.on('forceAuth.approved', function () {
      done()
    }).on('forceAuth.declined', function () {
      done()
    }).on('forceAuth.rejected', function () {
      done()
    }).on('forceAuth.notAnswer', function () {
      done()
    })
    payworks.forceAuth(this.params)
  })
})
