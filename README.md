# dflow

> Dataflow programming

[![NPM version](https://badge.fury.io/js/dflow.png)](http://badge.fury.io/js/dflow) [![Build Status](https://travis-ci.org/fibo/dflow.png?branch=master)](https://travis-ci.org/fibo/dflow.png?branch=master) [![Dependency Status](https://gemnasium.com/fibo/dflow.png)](https://gemnasium.com/fibo/dflow)

For more information point your browser to [dflow Homepage](http://g14n.info/dflow).

## Synopsis

> dflow exports `fun` ☺

Say **Hello World** with *dflow*.

```js

var dflow = require('dflow')

// A JSON that represents the execution graph.
//
// arguments[0] ==> console.log
var graph = {
  "task": {
    "1": "arguments[0]",
    "2": "console.log"
  },
  "pipe": {
    "3": [ "1", "2" ]
  }
}

// A collection of functions.
var funcs = {
  'console.log': console.log.bind(console),
  '+': function plus (a, b) { return a + b }
}

// Create a function.
var f = dflow.fun(funcs, graph)

f('Hello World') // prints "Hello World"

```

Use builtin `Math` functions. Graphs could be executed on different *contexts* (read `funcs`).

```js

var dflow = require('dflow')

// A simple graph: arguments[0] ==> cos ==> return
var graph = {
  task: {
    'a': 'arguments[0]',
    'b': 'cos',
    'c': 'return'
  },
  pipe: {
    '1': ['a', 'b'],
    '2': ['b', 'c']
  }
}

// Create a function that run graph on Math context.
var f = dflow.fun(Math, graph)

console.log(f(0.5)) // 0.8775825618903728

```

## Installation

With [npm](https://npmjs.org/) do

```bash
$ npm install dflow
```

## License

[MIT](http://g14n.info/mit-license)

