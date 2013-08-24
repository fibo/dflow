var DflowGraph, DflowInput, DflowPin, DflowTask, dflow, emptyTask, graph, iper, task;

dflow = require('../index');

iper = require('iper');

DflowGraph = dflow.DflowGraph;

DflowInput = dflow.DflowInput;

DflowPin = dflow.DflowPin;

DflowTask = dflow.DflowTask;

graph = new DflowGraph();

emptyTask = function() {};

task = new DflowTask(graph, emptyTask);

describe('DflowInput', function() {
  describe('Inheritance', function() {
    return it('is a DflowPin', function() {
      var input, prop;
      prop = {
        value: 1,
        name: 'foo'
      };
      input = new DflowInput(task, prop);
      return input.should.be.instanceOf(DflowPin);
    });
  });
  return describe('Constructor', function() {
    return it('has signature (task, prop)', function() {
      var input, prop;
      prop = {
        value: 1,
        name: 'foo'
      };
      input = new DflowInput(task, prop);
      return input.should.be.instanceOf(DflowPin);
    });
  });
});
