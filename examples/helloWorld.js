
module.exports = function () {

    var consoleLog

    var root = require('dflow').root;

    var id1 = root.createSlot('Hello', 'World');
    var id2 = root.createTask(function (a, b) {consoleLog = a + ' ' +b;});

    root.createEdge([id1, id2]);

    root.runTask(); // will print "Hello World"

    consoleLog.should.be.eql('Hello World')
};

