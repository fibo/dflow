
dflow = require '../index'

DflowGraph    = dflow.DflowGraph
DflowScenario = dflow.DflowScenario
DflowTask     = dflow.DflowTask

graph = new DflowGraph()

describe 'DflowScenario', ->
  describe 'Inheritance', ->
    it 'is a DflowTask', ->
      scenario = new DflowScenario(graph)
      scenario.should.be.instanceOf DflowTask

  describe 'Constructor', ->
    it 'has signature (graph)', ->
      scenario = new DflowScenario(graph)
      scenario.should.be.instanceOf DflowScenario

