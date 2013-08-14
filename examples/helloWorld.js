
module.exports = function () {

    var consoleLog

    var root = require('dflow').root;

    var id1 = root.createArguments('Hello', 'World');
    var id2 = root.createFunction(function (a, b) {consoleLog = a + ' ' +b;});

    root.createEdge(id1, id2);

    root.runTask(); // will print "Hello World"

    // TODO consoleLog.should.be.eql('Hello World')
};

