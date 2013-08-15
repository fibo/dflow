var DflowScenario, IperGraph, dflow, iper;

dflow = require('../index');

iper = require('iper');

DflowScenario = dflow.DflowScenario;

IperGraph = iper.IperGraph;

describe('DflowGraph', function() {
  return it('is a DflowScenario', function() {
    return dflow.root.should.be.instanceOf(IperGraph);
  });
});
