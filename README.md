dflow
=====

dataflow programming for Node.js

[![Build Status](https://travis-ci.org/fibo/dflow.png?branch=master)](https://travis-ci.org/fibo/dflow.png?branch=master) [![NPM version](https://badge.fury.io/js/dflow.png)](http://badge.fury.io/js/dflow)

# Installation

With [npm](https://npmjs.org/) do

```bash
npm install dflow
```

# Description

`dflow` is a minimal implementation of dataflow programming.

# Hello world

    var dflow = require('dflow');
    var DflowScenario = dflow.DflowScenario;

    var df = new DflowScenario();

    var id1 = df.createSlot('Hello', 'World');
    var id2 = df.createTask(function (a, b) {console.log = a + ' ' + b;});

    df.createEdge([id1, id2]);

    df.runTask(); // will print "Hello World"

# Development

See [Development.md](https://github.com/fibo/dflow/blob/master/Development.md)

# License

[MIT](http://fibo.mit-license.org/)

