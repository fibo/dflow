
var dflow = require('..')
  , should = require('should')

var funcs = require('./examples/funcs')
  , examples = require('./examples/graphs')

describe('example', function () {
  function testExample (name, graph) {
    describe(name, function () {
      var f = dflow.func(funcs, graph)
      it('works', function () {
        f.should.be.instanceOf(Function)
      })

      it('returns expected result', function () {
        graph.results.forEach(function (test) {
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
})

