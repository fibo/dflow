
var assert = require('assert');

var dflow = require('../index.js');
var pkg = require('../package.json');

var Graph = dflow.Graph;

var df = process.dflow;

describe('process.dflow', function () {
  describe('info', function () {
    var info = df.info;

    describe('version', function () {
      it('holds the package version number', function () {
        assert.equal(info.version, pkg.version);
      });
    });
  });

  describe('root', function () {
    var root = df.root;

    it('is a Graph', function () {
      assert.ok(root instanceof Graph);
    });

    it('has id = 0', function () {
      assert.equal(root.getId(), 0);
      assert.ok(df.getElementById(0) === root);
    });
  });
});

