
var assert = require('assert')

var dflow = require('../index.js')

var Output = dflow.Output
var Slot   = dflow.Slot

var output = new Output()

describe('Output', function () {
  describe('Constructor', function () {
    it('requires no argument', function () {
      var output = new Output()
      assert.ok(output instanceof Output)
    })

    describe('arguments', function () {
      describe('init', function () {
        it('defaults to true',function () {
          assert.ok(output.isON())
        })
      })

      describe('targets', function () {
        it('defaults to []',function () {
          assert.deepEqual(output.getTargets(), [])
        })
      })
    })
  })

  describe('Inheritance', function () {
    it('is a Slot', function () {
      assert.ok(output instanceof Slot)
    })
  })

  describe('Methods', function () {
    describe('isON()', function () {
      it('returns true if output is ON', function () {
        assert.ok(output.isON())
      })
    })
   
    describe('isOFF()', function () {
      it('returns true if output is OFF')
    })
   
    describe('getTargets()', function () {
      it('returns output targets')
    })
   
    describe('connectTo()', function () {
      it('connects output to an input target')
    })
   
    describe('outputToJSON()', function () {
      it('returns output in JSON format')
    })

    describe('toJSON()', function () {
      it('is an alias of outputToJSON', function () {
        assert.ok(output.toJSON === output.outputToJSON)
      })
    })
  })
})

