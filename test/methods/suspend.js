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

describe('Payworks#suspend', function () {
  beforeEach(function () {
    this.params = {
      reference: '91289218'
    }
  })

  it('should failed when params are missing', function (done) {
    payworks.suspend()
      .then((value) => {
        done('should throw an error when params are missing')
      })
      .catch(() => {
        done()
      })
  })

  it('should validate params', function (done) {
    let required = [
      'reference'
    ]

    payworks
    .on('suspend.error', function (err) {
      try {
        assert.equal(err.name, 'ValidationError')

        for (let param of required) {
          // Get error from each path
          let e = err.details.filter(e => e.path === param || e.path === param.toUpperCase())
          assert(e.length, `should throws a validation error when the \`${param}\` property is missing`)
          assert.equal(e[0].type, 'any.required')
        }
        done()
      } catch (e) {
        done(e)
      }
    })
    .suspend({})
  })

  it('should obtain a result with callbacks', function (done) {
    payworks.suspend(this.params, function (error, body, response) {
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
    let body = yield payworks.suspend(this.params)
    assert(body.resultado_payw)
  })

  it('should obtain a result with thenables', function * (done) {
    payworks.suspend(this.params)
    .then(function (body) {
      assert(body.resultado_payw)
      done()
    })
    .catch(done)
  })

  it('should obtain a result with events', function (done) {
    payworks
    .on('suspend.approved', function () {
      done()
    }).on('suspend.declined', function () {
      done()
    }).on('suspend.rejected', function () {
      done()
    }).on('suspend.notAnswer', function () {
      done()
    })
    .suspend(this.params)
  })
})
