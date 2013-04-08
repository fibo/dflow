
var assert = require('assert')

var dflow = require('../index.js')

var Input  = dflow.Input
var Output = dflow.Output
var Slot   = dflow.Slot

var input = new Input()

describe('Input', function () {
  describe('Constructor', function () {
    it('requires no argument', function () {
      var input = new Input()
      assert.ok(input instanceof Input)
    })

    describe('arguments', function () {
      describe('source', function () {
        it('defaults to undefined',function () {
          assert.ok(typeof input.getSource() === 'undefined')
        })

        it('must be an Output'/*, function () {
          assert.throws( function () {
            var arg = {}
            arg.source = 'notAnOutput'
            var input = new Input(arg)
          }, TypeError)
        }*/)
      })
    })
  })

  describe('Inheritance', function () {
    it('is a Slot', function () {
      assert.ok(input instanceof Slot)
    })
  })

  describe('Methods', function () {
    describe('getData()', function () {
      it('delegates to source.getData')
    })

    describe('getSource()', function () {
      it('returns the input source', function () {
        var arg = {}
        var output = new Output()
        arg.source = output
        var input = new Input(arg)
        assert.ok(output === input.getSource()) 
      })
    })

    describe('isConnected()', function () {
      it('returns true if input has no source', function () {
        var output = new Output()
        var input = new Input()
        assert.ok(! input.isConnected())
        input.setSource(output)
        assert.ok(input.isConnected())
      })
    })

    describe('setSource()', function () {
      it('sets input source', function () {
        var output = new Output()
        var input = new Input()
        input.setSource(output)
        assert.ok(output === input.getSource())
      })

      it('emits source')
    })

    describe('inputToJSON()', function () {
      it('returns input in JSON format', function () {
        var json = {}
        var arg = {}
        var output = new Output()
        arg.source = output
        arg.data = json.data = 'xxx'
        arg.name = json.name = 'input1'
        var input = new Input(arg)
        json.id = input.getId()
        json.sourceId = output.getId()
        assert.deepEqual(json, input.inputToJSON())
      })
    })

    describe('toJSON()', function () {
      it('is an alias of inputToJSON', function () {
        assert.ok(input.toJSON === input.inputToJSON)
      })
    })
  })
})

