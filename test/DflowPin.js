var DflowGraph, DflowPin, DflowTask, IperNode, dflow, emptyTask, graph, iper, task;

dflow = require('../index');

iper = require('iper');

DflowGraph = dflow.DflowGraph;

DflowPin = dflow.DflowPin;

DflowTask = dflow.DflowTask;

IperNode = iper.IperNode;

graph = new DflowGraph();

emptyTask = function() {};

task = new DflowTask(graph, emptyTask);

describe('DflowPin', function() {
  describe('Inheritance', function() {
    var prop;
    prop = {
      name: 'foo',
      value: 'bar'
    };
    it('is an IperNode', function() {
      var pin;
      pin = new DflowPin(task, prop);
      return pin.should.be.instanceOf(IperNode);
    });
    return it('checks that task is an IperNode', function() {
      return (function() {
        return new DflowPin('not a task', prop);
      }).should.throwError();
    });
  });
  describe('Constructor', function() {
    return it('has signature (task, prop)', function() {});
  });
  return describe('Attribute', function() {
    return describe('#isEmpty', function() {
      return it('is a boolean that indicates if pin value is null', function() {
        var pin, prop;
        prop = {
          name: 'foo'
        };
        pin = new DflowPin(task, prop);
        pin.isEmpty.should.be["true"];
        pin.value = 'bar';
        return pin.isEmpty.should.be["false"];
      });
    });
  });
});
