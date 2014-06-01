# dflow

> Dataflow programming

[![NPM version](https://badge.fury.io/js/dflow.png)](http://badge.fury.io/js/dflow) [![Build Status](https://travis-ci.org//dflow.png?branch=master)](https://travis-ci.org//dflow.png?branch=master) [![Dependency Status](https://gemnasium.com//dflow.png)](https://gemnasium.com//dflow)

# Hello world

```js
var dflow = require('dflow')

// Create a graph with a single task and say "Hello world"

var graph = {
  tasks: [
    {
      name: 'console.log',
      arg: ['Hello', 'world']
    }
  ],
  pipes: []
}

dflow.evaluate(graph)
// Hello world
```

# Installation

With [npm](https://npmjs.org/) do

```bash
$ npm install dflow
```

# Development

Install [fibo/fibo-gulptasks][1] for development tasks automation.

# License

[MIT][2]

[1]: https://github.com/fibo/fibo-gulptasks
[2]: http://fibo.mit-license.org/

