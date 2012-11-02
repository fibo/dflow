
var pkg = require('../package.json');
var info = {
  version: pkg.version
};

module.exports = {
  info: info

, elements: []

, addElement: function (element) {
    var elements = this.elements;

    var id = elements.length;

    elements.push(element);

    return id;
  }

, getElementById: function (id) { return this.elements[id]; }
};

