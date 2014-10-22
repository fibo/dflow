# dflow

> Dataflow programming

[![NPM version](https://badge.fury.io/js/dflow.png)](http://badge.fury.io/js/dflow) [![Build Status](https://travis-ci.org/fibo/dflow.png?branch=master)](https://travis-ci.org/fibo/dflow.png?branch=master) [![Dependency Status](https://gemnasium.com/fibo/dflow.png)](https://gemnasium.com/fibo/dflow)

## Synopsis

```js
var dflow = require('dflow');

// A JSON that represents the execution graph.
var graph = {
  "task": {
    "1": { "func": "arguments[0]" },
    "2": { "func": "console.log" }
  },
  "pipe": {
    "3": { "from": "1", "to": "2", "arg": 0 }
  }
};

// A collection of functions.
var funcs = {
  'console.log': console.log.bind(console),
  '+': function plus (a, b) { return a + b }
};

// Create a function
var f = dflow.func(funcs, graph);

f('Hello World'); // prints "Hello World"
```

For more information point your browser to [dflow Homepage](http://www.g14n.info/dflow).

## Installation

With [npm](https://npmjs.org/) do

```bash
$ npm install dflow
```

## License

[MIT](http://www.g14n.info/mit-license)

