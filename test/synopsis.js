
var assert = require('assert');

describe('synopsis', function () {
    require('../index.js');

    process.dflow.root.addNode({
      task: function () {
        console.log('hello world');
      }
    });

    process.dflow.root.emit('task');
});


