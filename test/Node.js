
var assert = require('assert')
var EventEmitter = require('events').EventEmitter

var dflow = require('../index.js')

var Element = dflow.Element
var Node    = dflow.Node

var node = new Node()

describe('Node', function () {
  describe('Constructor', function () {
    describe('arg task', function () {
      it('defaults to a dummy function')
    })

    it('does not require ins and outs, which default to []', function () {
      var node = new Node()

      assert.deepEqual(node.getIns(), [])
      assert.deepEqual(node.getOuts(), [])
    })
  })

  describe('Inheritance', function () {
    it('is an Element', function () {
      assert.ok(node instanceof Element)
    })
  })

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

  describe('getIns()', function () {
    it('', function () {
    })
  })

  describe('getOuts()', function () {
    it('', function () {
    })
  })

  describe('toJSON()', function () {
    it('', function () {
    })
  })
})

