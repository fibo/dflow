var fun = require('engine/fun')
var should = require('should')

var graphs = require('./graphs/index')

describe('graph', function () {
  function testGraph (name, graph) {
    describe(name, function () {
      var f = fun(graph)

      it('works', function () {
        f.should.be.instanceOf(Function)
      })

      it('returns expected results', function () {
        graph.data.results.forEach(function (test) {
          var result = f.apply(null, test.args)

          should.deepEqual(result, test.expected)
        })
      })
    })
  }

  for (var graphName in graphs) {
    var graph = graphs[graphName]

    testGraph(graphName, graph)
  }
})
