
dflow = require '../index'
iper  = require 'iper'

DflowScenario = dflow.DflowScenario
IperGraph = iper.IperGraph

describe 'DflowGraph', ->
  it 'is a DflowScenario', ->
    dflow.root.should.be.instanceOf IperGraph

