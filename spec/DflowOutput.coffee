
dflow = require '../index'
iper  = require('iper')

DflowGraph  = dflow.DflowGraph
DflowOutput = dflow.DflowOutput
DflowPin    = dflow.DflowPin
DflowTask   = dflow.DflowTask

graph = new DflowGraph()
emptyTask = () ->
task = new DflowTask(graph, emptyTask)

describe 'DflowOutput', ->
  describe 'Inheritance', ->
    it 'is a DflowPin', ->
      prop =
        name: 'foo'
        value: 2
      output = new DflowOutput(task, prop)
      output.should.be.instanceOf DflowPin

  describe 'Constructor', ->
    it 'has signature (task, prop)', ->
      prop =
        name: 'foo'
        value: 2
      output = new DflowOutput(task, prop)
      output.should.be.instanceOf DflowOutput

