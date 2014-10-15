
var examples = ['helloWorld', 'sum']

var dflow = require('..')

var expected
  , funcs = require('./examples/funcs')
  , graph

describe('example', function () {
  examples.forEach(function (example) {
    describe(example, function () {
      //expected = require('./expected/' + example + '.json')
      graph = require('./examples/' + example + '.json')
      it('works', function () {
        //evaluate(graph, funcs).should.eql(expected)
        dflow.func(graph, funcs)
      })
    })
  })
})

