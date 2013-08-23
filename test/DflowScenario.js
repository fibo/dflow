var DflowGraph, DflowScenario, DflowTask, dflow, graph;

dflow = require('../index');

DflowGraph = dflow.DflowGraph;

DflowScenario = dflow.DflowScenario;

DflowTask = dflow.DflowTask;

graph = new DflowGraph();

describe('DflowScenario', function() {
  describe('Inheritance', function() {
    return it('is a DflowTask', function() {
      var scenario;
      scenario = new DflowScenario(graph);
      return scenario.should.be.instanceOf(DflowTask);
    });
  });
  return describe('Constructor', function() {
    it('has signature (graph)', function() {
      var scenario;
      scenario = new DflowScenario(graph);
      return scenario.should.be.instanceOf(DflowScenario);
    });
    return it('has signature ()', function() {
      var scenario;
      scenario = new DflowScenario();
      scenario.should.be.instanceOf(DflowScenario);
      return console.log(scenario.createSlot);
    });
  });
});
