
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

  describe('levelOfTask', function () {
    it('assigns a level to each task'/*, function () {
      var graph = require('../examples/graphs/graph2.json')

      dflow.levelOfTask(graph , graph.tasks[0]).should.eql(0)
      dflow.levelOfTask(graph , graph.tasks[1]).should.eql(1)
      dflow.levelOfTask(graph , graph.tasks[4]).should.eql(2)
      //FIXME dflow.levelOfTask(graph , graph.tasks[3]).should.eql(0)
    }*/)
  })
})

