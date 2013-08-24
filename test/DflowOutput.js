var DflowGraph, DflowOutput, DflowPin, DflowTask, dflow, emptyTask, graph, iper, task;

dflow = require('../index');

iper = require('iper');

DflowGraph = dflow.DflowGraph;

DflowOutput = dflow.DflowOutput;

DflowPin = dflow.DflowPin;

DflowTask = dflow.DflowTask;

graph = new DflowGraph();

emptyTask = function() {};

task = new DflowTask(graph, emptyTask);

describe('DflowOutput', function() {
  describe('Inheritance', function() {
    return it('is a DflowPin', function() {
      var output, prop;
      prop = {
        name: 'foo',
        value: 2
      };
      output = new DflowOutput(task, prop);
      return output.should.be.instanceOf(DflowPin);
    });
  });
  return describe('Constructor', function() {
    return it('has signature (task, prop)', function() {
      var output, prop;
      prop = {
        name: 'foo',
        value: 2
      };
      output = new DflowOutput(task, prop);
      return output.should.be.instanceOf(DflowOutput);
    });
  });
});
