
var dflow = require('../index')

var emptyGraph = dflow.emptyGraph()

describe('evaluate', function () {
  it('does not change empty graphs', function () {
    var graph = dflow.evaluate(emptyGraph)

    graph.should.eql(emptyGraph)
  })
})
