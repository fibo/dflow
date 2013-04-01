
var assert = require('assert')

var dflow = require('../index.js')

var Output = dflow.Output
var Slot   = dflow.Slot

var output = new Output()

describe('Output', function () {
  describe('Constructor', function () {
    it('works', function () {
      assert.ok(output instanceof Output)
    })
  })

  describe('Inheritance', function () {
    it('is a Slot', function () {
      assert.ok(output instanceof Slot)
    })
  })

  describe('isON()', function () {
    it('defaults to true', function () {
      assert.ok(output.isON())
    })
  })

  describe('isOFF()', function () {
    it('', function () {
    })
  })

  describe('getTargets()', function () {
    it('', function () {
    })
  })

  describe('connectTo()', function () {
    it('', function () {
    })
  })

  describe('toJSON()', function () {
    it('', function () {
    })
  })
})

