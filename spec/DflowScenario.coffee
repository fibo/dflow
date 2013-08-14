
dflow = require '../index'

DflowGraph    = dflow.DflowGraph
DflowScenario = dflow.DflowScenario
DflowTask     = dflow.DflowTask

graph = new DflowGraph()

describe 'DflowScenario', ->
  describe 'inheritance', ->
    it 'is a DflowTask', ->
      scenario = new DflowScenario(graph)
      scenario.should.be.instanceOf DflowTask

  describe 'constructor', ->
    it 'has signature (graph)', ->
      scenario = new DflowScenario(graph)
      scenario.should.be.instanceOf DflowScenario

