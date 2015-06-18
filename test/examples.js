
var dflow  = require('dflow'),
    should = require('should')

var examples = require('../src/examples')

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

          // result.should.be.ok will throw if result is undefined
          var gotExpected = (result == test.expected)

          gotExpected.should.be.ok
        })
      })
    })
  }

  for (var exampleName in examples) {
    var exampleGraph = examples[exampleName]
    testExample(exampleName, exampleGraph)
  }

  describe('packagedGraph', function () {
    it('is a dflow graph packages with npm', function () {
      var graph = require('./examples/packagedGraph')

      var sum = dflow.fun(graph)

      sum(2, 2).should.be.eql(4)
    })
  })
})

