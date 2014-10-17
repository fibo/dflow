
var examples = require('./examples/graphs')


var dflow = require('..')

var should = require('should')

var funcs = require('./examples/funcs')
  , graph

describe('example', function () {
  function testExample (name, graph) {
    describe(name, function () {
      it('works', function () {
        dflow.func(funcs, graph).should.be.instanceOf(Function)
      })
    })
  }

  for (var exampleName in examples) {
    var exampleGraph = examples[exampleName]
    testExample(exampleName, exampleGraph)
  }
})

