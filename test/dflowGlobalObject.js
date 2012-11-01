
var assert = require('assert');

var dflow = require('../index.js');
var pkg = require('../package.json');

var Graph = dflow.Graph;

describe('process.dflow', function () {
  describe('version', function () {
    it('holds the package version number', function () {
      assert.equal(process.dflow.version, pkg.version);
    });
  });

  describe('root', function () {
    var root = process.dflow.root;

    it('is a Graph', function () {
      assert.ok(root instanceof Graph);
    });

    it('has id = 0', function () {
      assert.equal(root.getId(), 0);
    });
  });
});

