
var assert = require('assert')

var dflow = require('../index.js')

var Output = dflow.Output
var Slot   = dflow.Slot

var output = new Output()

describe('Output', function () {
  describe('constructor:', function () {
    it('requires no argument', function () {
      var output = new Output()
      assert.ok(output instanceof Output)
    })

    describe('arguments:', function () {
      describe('targets', function () {
        it('defaults to []',function () {
          assert.deepEqual(output.getTargets(), [])
        })
      })
    })
  })

  describe('inheritance:', function () {
    it('is a Slot', function () {
      assert.ok(output instanceof Slot)
    })
  })

  describe('accessor', function () {
    describe('getTargets()', function () {
      it('returns output targets')
    })
  })
   
  describe('mutator', function () {
    describe('setTargets()', function () {
      it('returns output targets')
    })
   
    describe('connectTo()', function () {
      it('connects output to an input target')
    })
  })

  describe('method', function () {
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

