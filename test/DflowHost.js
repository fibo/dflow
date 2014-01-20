
var dflow = require('../index')

var DflowHost    = dflow.DflowHost
  , DflowPackage = dflow.DflowPackage

var host = new DflowHost()

describe('DflowHost', function () {
  describe('Constructor', function () {
    it('has signature `()`', function () {
      host.should.be.instanceOf(DflowHost)
    })
  })

  describe('Attributes', function () {
  })

  describe('Methods', function () {})
})


