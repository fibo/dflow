
dflow = require '../index'
iper  = require('iper')

DflowGraph  = dflow.DflowGraph
DflowOutput = dflow.DflowOutput
DflowTask   = dflow.DflowTask

IperNode = iper.IperNode

graph = new DflowGraph()
emptyTask = () ->
task = new DflowTask(graph, emptyTask)

describe 'DflowOutput', ->
  describe 'Inheritance', ->
    it 'is an IperNode', ->
      output = new DflowOutput(task)
      output.should.be.instanceOf IperNode

    it 'checks that task is an IperNode', ->
      (() ->
         new DflowOutput('not a task', data)
      ).should.throwError()

  describe 'Constructor', ->
    it 'has signature (task)', ->
      # data = 'foo'
      # meta =
      #   name: 'example input'
      # input = new DflowInput(task, data, meta)
      # input.should.be.instanceOf DflowInput

