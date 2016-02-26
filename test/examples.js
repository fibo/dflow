var dflow = require('dflow')
var should = require('should')

var examples = require('../src/examples')

var context = (typeof window === 'object') ? 'client' : 'server'

describe('example', function () {
  function testExample (name, graph) {
    describe(name, function () {
      var f = dflow.fun(graph)

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

    if (graphContext === context) {
      testExample(exampleName, exampleGraph)
    }
  }

  describe('packagedGraph', function () {
    it('is a dflow graph packages with npm', function () {
      var graph = require('../src/examples/packagedGraph')

      var sum = dflow.fun(graph)

      sum(2, 2).should.be.eql(4)
    })
  })
})
