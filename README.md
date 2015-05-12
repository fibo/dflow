# dflow

> Dataflow programming

[![NPM version](https://badge.fury.io/js/dflow.png)](http://badge.fury.io/js/dflow) [![Build Status](https://travis-ci.org/fibo/dflow.png?branch=master)](https://travis-ci.org/fibo/dflow.png?branch=master) [![Dependency Status](https://gemnasium.com/fibo/dflow.png)](https://gemnasium.com/fibo/dflow) [![Coverage Status](https://coveralls.io/repos/fibo/dflow/badge.svg?branch=master)](https://coveralls.io/r/fibo/dflow?branch=master)

## Description

*dflow* is a minimal [Dataflow programming](http://en.wikipedia.org/wiki/Dataflow_programming) engine.

## Installation

With [npm](https://npmjs.org/) do

```bash
$ npm install dflow
```

With [bower](http://bower.io/) do

```bash
$ bower install dflow
```

## Synopsis

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

// Create a dflow function.
var f = dflow.fun(graph)

f('Hello World') // prints "Hello World"

```

## Api

> dflow exports a `fun` function ☺

See [Api](https://g14n.info/dflow/api) for defailts.

## Concept

A *graph* is a collection of *tasks* and *pipes* that can be stored in JSON format.

Every *task* refers to a function which output can be piped as an argument to another other task.

A *graph* has the following properties

  * task: collection of function names.
  * pipe: connections from the output of a task to an input of another task.
  * data: (optional) persistence.
  * func: (optional) collection of subgraphs.

*dflow* provides few [builtin functions](https://github.com/fibo/dflow/blob/master/src/builtinFunctions.js) and injects the following ones

  * `return`: a task that accepts one argument and behaves like a [Return statement](http://en.wikipedia.org/wiki/Return_statement). 
  * `arguments`: task that returns the *arguments* of *dflowFun*. 
  * `arguments[0]` ... `arguments[N]`: tasks that return the *arguments[i]* of *dflowFun*. 
  * `.foo`: accessor to *graph.data.foo*.
  * `&bar`: returns *bar* function.

## Examples

### page.html

See [test/page.html](http://g14n.info/dflow/test/page.html) for a working example of *dflow* in a browser context.

### Stream playground

[Node.js Stream Playground](http://ejohn.org/blog/node-js-stream-playground/) first example is

```js
var fs = require("fs");

// Read File
fs.createReadStream("input/people.json")
    // Write File
    .pipe(fs.createWriteStream("output/people.json"));
```

It is ported to script [stream.js](https://github.com/fibo/dflow/blob/master/test/examples/stream-playground/stream.js) which evaluates [graph stream.json](https://github.com/fibo/dflow/blob/master/test/examples/stream-playground/stream.json) using [few custom functions](https://github.com/fibo/dflow/blob/master/test/examples/stream-playground/funcs.js).

### Sample graphs

Every example has a *graph* and a set of expected *results* that are required by [test/examples.js](https://github.com/fibo/dflow/blob/master/test/examples.js).

#### sum

* [graph](https://github.com/fibo/dflow/blob/master/test/examples/graphs/sum.json)
* [results](https://github.com/fibo/dflow/blob/master/test/examples/graphs/sum-results.json)

Takes two operands as arguments and returns its sum.

#### apply

* [graph](https://github.com/fibo/dflow/blob/master/test/examples/graphs/apply.json)
* [results](https://github.com/fibo/dflow/blob/master/test/examples/graphs/apply-results.json)

Implements the apply operator.

#### dotOperator

* [graph](https://github.com/fibo/dflow/blob/master/test/examples/graphs/dotOperator.json)
* [results](https://github.com/fibo/dflow/blob/master/test/examples/graphs/dotOperator-results.json)

Like the `.` operator, takes an object and a prop as arguments and returns `object[prop]` value.

## License

[MIT](http://g14n.info/mit-license.html)

