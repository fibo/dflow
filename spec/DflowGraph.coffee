
dflow = require '../index'
iper  = require('iper')

DflowGraph = dflow.DflowGraph

IperGraph = iper.IperGraph

graph = new DflowGraph()

describe 'DflowGraph', ->
  describe 'inheritance', ->
    it 'is an IperGraph', ->
      graph = new IperGraph()
      graph.should.be.instanceOf IperGraph

  describe 'constructor', ->
    it 'has signature ()', ->
      graph = new DflowGraph()
      graph.should.be.instanceOf DflowGraph

