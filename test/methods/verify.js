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

describe('Payworks#verify', function () {
  beforeEach(function () {
    this.params = {
      reference: 'ABC1928',
      control_number: '129821921'
    }
  })

  it('should obtain a result with callbacks', function (done) {
    payworks.verify(this.params, function (error, body, response) {
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
    let body = yield payworks.verify(this.params)
    assert(body.resultado_payw)
  })

  it('should obtain a result with thenables', function * (done) {
    payworks.verify(this.params)
    .then(function (body) {
      assert(body.resultado_payw)
      done()
    })
    .catch(done)
  })

  it('should obtain a result with events', function (done) {
    payworks
    .on('verify.approved', function () {
      done()
    }).on('verify.declined', function () {
      done()
    }).on('verify.rejected', function () {
      done()
    }).on('verify.notAnswer', function () {
      done()
    })
    .verify(this.params)
  })
})
