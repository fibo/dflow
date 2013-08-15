
dflow = require '../index'
iper  = require('iper')

DflowGraph = dflow.DflowGraph

IperGraph = iper.IperGraph

graph = new DflowGraph()

describe 'DflowGraph', ->
  describe 'Inheritance', ->
    it 'is an IperGraph', ->
      graph = new IperGraph()
      graph.should.be.instanceOf IperGraph

  describe 'Constructor', ->
    it 'has signature ()', ->
      graph = new DflowGraph()
      graph.should.be.instanceOf DflowGraph

