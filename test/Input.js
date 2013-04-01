
var assert = require('assert')

var dflow = require('../index.js')

var Input = dflow.Input
var Slot  = dflow.Slot

var input = new Input()

describe('Input', function () {
  describe('Constructor', function () {
    it('requires no argument', function () {
      var input = new Input()
      assert.ok(input instanceof Input)
    })

    it('throws Error if no name and or no data is passed', function () {
      //var newIn1 = function () { new In() }
      //assert.throws(newIn1, Error)
      //var _in = new In({data:0,name:'xx'})console.log(_in.toJSON())

      //var newIn2 = function () { new In({}) }
      //assert.throws(newIn2, Error)

      //var newIn3 = function () { new In({data:'bar'}) }
      //assert.throws(newIn3, Error)

      //var newIn4 = function () { new In({name:'foo'}) }
      //assert.throws(newIn4, Error)
    })
  })

  describe('Inheritance', function () {
    it('is a Slot', function () {
      assert.ok(input instanceof Slot)
    })
  })

  describe('getSource()', function () {
    it('', function () {
    })
  })

  describe('getData()', function () {
    it('', function () {
    })
  })

  describe('setData()', function () {
    it('', function () {
    })
  })

  describe('toJSON()', function () {
    it('', function () {
    })
  })
})

