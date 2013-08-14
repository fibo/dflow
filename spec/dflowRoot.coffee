
dflow = require '../index'

DflowScenario = dflow.DflowScenario

describe 'DflowGraph', ->
  it 'is a DflowScenario', ->
    dflow.root.should.be.instanceOf IperGraph

