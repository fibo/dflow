
var dflow = require('../index')

var emptyGraph = new dflow.Graph()
  , emptyLayout = {
    boxes: [],
    lines: []
  }

describe('algorithm', function () {
  describe('evaluate', function () {
    it('does not change empty graphs', function () {
      var graph = dflow.evaluate(emptyGraph)

      graph.should.eql(emptyGraph)
    })
  })

  describe('arrange', function () {
    it('return an empty layout for an empty graph', function () {
      dflow.arrange(emptyGraph).should.eql(emptyLayout)
    })

    it('sort out a graph layout', function () {
      var graph = require('../examples/graphs/orOperator.json')

      var layout = dflow.arrange(graph)

      layout.boxes.should.be.Array
      layout.boxes.length.should.eql(graph.tasks.length)

      layout.lines.should.be.Array
      layout.lines.length.should.eql(graph.pipes.length)
    })
  })

  describe('levelOfTask', function () {
    it('assigns a level to each task')
  })
})

