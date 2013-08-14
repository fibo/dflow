
dflow = require '../index'
iper  = require 'iper'

IperNode = iper.IperNode

DflowTask  = dflow.DflowTask
DflowGraph = dflow.DflowGraph

graph = new DflowGraph()

emptyTask = () ->

describe 'DflowTask', ->
  describe 'inheritance', ->
    it 'is an IperNode', ->
      task = new DflowTask(graph, emptyTask)
      task.should.be.instanceOf IperNode

  describe 'constructor', ->
    it 'has signature (graph, task)', ->
      task = new DflowTask(graph, emptyTask)
      task.should.be.instanceOf IperNode

    it 'has signature (graph, {task: task, inputs: {...}, outputs: {...})', ->

  describe 'methods', ->
    describe '#runTask()', ->
      it 'runs task passing a reference to the DflowTask instance', ->
        # checkSelf = (self) ->
        #   self.should.be.instanceOf DflowTask

        # task = new DflowTask(graph, checkSelf)
        # task.runTask()

