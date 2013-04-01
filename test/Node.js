
var assert = require('assert')
var EventEmitter = require('events').EventEmitter

var dflow = require('../index.js')

var Element = dflow.Element
var Node    = dflow.Node

var node = new Node()

describe('Node', function () {
  describe('Constructor', function () {
    it('requires no argument', function () {
      var node = new Node()
      assert.ok(node instanceof Node)
    })

    describe('arguments', function () {
      describe('task', function () {
        it('defaults to an empty function')
      })

      describe('inputs', function () {
        it('defaults to []', function () {
          assert.deepEqual(node.getInputs(), [])
        })
      })

      describe('outputs', function () {
        it('defaults to []', function () {
          assert.deepEqual(node.getOutputs(), [])
        })
      })
    })
  })

  describe('Inheritance', function () {
    it('is an Element', function () {
      assert.ok(node instanceof Element)
    })
  })

  describe('Events', function () {})

  describe('Methods', function () {
    describe('getId()', function () {
      it('', function () {
        var node = new Node()
        var id = node.getId()
        assert.ok(typeof id == 'number')
      })
    })

    describe('hasRunTask()', function () {
      it('returns true if node run its task', function () {
        var node = new Node()
        node.emit('task')
        assert.ok(node.hasRunTask())
      })
    })

    describe('getInputs()', function () {
      it('returns the node inputs')
    })

    describe('getOutputs()', function () {
      it('returns the node outputs')
    })

    describe('nodeToJSON()', function () {
      it('returns the node in JSON format')
    })

    describe('toJSON()', function () {
      it('is an alias of nodeToJSON', function () {
        assert.ok(node.toJSON === node.nodeToJSON)
      })
    })
  })
})

