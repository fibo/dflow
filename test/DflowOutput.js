
var dflow = require('../index')
  , should = require('should')

var DflowInput  = dflow.DflowInput
  , DflowOutput = dflow.DflowOutput
  , DflowSlot   = dflow.DflowSlot

describe('DflowOutput', function () {
  describe('Inheritance', function () {
    it('is a DflowSlot', function () {
      var output = new DflowOutput()

      output.should.be.instanceOf(DflowSlot)
    })
  })

  describe('Attribute', function () {
    describe('#edges', function () {
      var output = new DflowOutput()
    })
  })

  describe('Method', function () {
    describe('#connectTo()', function () {
      var output = new DflowOutput()
    })

    describe('#isConnected()', function () {
      var output = new DflowOutput()
    })
  })
})

