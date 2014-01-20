
var dflow = require('../index')

var DflowGraph = dflow.DflowGraph
  , DflowHost  = dflow.DflowHost

var host = new DflowHost()
var graph = new DflowGraph(host)

describe('DflowGraph', function () {
  describe('Constructor', function () {
    it('has signature `(host)`', function () {
      graph.should.be.instanceOf(DflowGraph)
    })
  })

  describe('Attributes', function () {
    describe('#host', function () {
      it('is a DflowHost', function () {
        graph.host.should.be.instanceOf(DflowHost)
      })
    })
  })

  describe('Methods', function () {})
})

