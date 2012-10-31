
var assert = require('assert');

var dflow = require('../index.js');

var Graph = dflow.Graph;

describe('dflow', function () {
  describe('root', function () {
    var root = process.dflow.root;

    it('is a Graph', function () {
      assert.ok(root instanceof Graph);
    });
  });
});

