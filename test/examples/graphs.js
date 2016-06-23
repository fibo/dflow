var fun = require('engine/fun')
var should = require('should')

var examples = require('examples/graphs')

var context = (typeof window === 'object') ? 'client' : 'server'

describe('example graph', function () {
  function testExample (name, graph) {
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

  for (var exampleName in examples) {
    var exampleGraph = examples[exampleName]

    var graphInfo = exampleGraph.info || {}
    var graphContext = graphInfo.context || 'universal'

    if ((graphContext === context) || (graphContext === 'universal')) {
      testExample(exampleName, exampleGraph)
    }
  }
})
