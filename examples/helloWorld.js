
module.exports = function () {

    var consoleLog

    var dflow = require('dflow');
    var DflowScenario = dflow.DflowScenario;

    var df = new DflowScenario();

    var id1 = df.createSlot('Hello', 'World');
    var id2 = df.createTask(function (a, b) {consoleLog = a + ' ' + b;});

    df.createEdge([id1, id2]);

    df.runTask(); // will print "Hello World"

    // TODO consoleLog.should.be.eql('Hello World')
};

