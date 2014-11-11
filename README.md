# dflow

> Dataflow programming

[![NPM version](https://badge.fury.io/js/dflow.png)](http://badge.fury.io/js/dflow) [![Build Status](https://travis-ci.org/fibo/dflow.png?branch=master)](https://travis-ci.org/fibo/dflow.png?branch=master) [![Dependency Status](https://gemnasium.com/fibo/dflow.png)](https://gemnasium.com/fibo/dflow)

## Description

*dflow* is a minimal [Dataflow programming](http://en.wikipedia.org/wiki/Dataflow_programming) engine.

For a **work in progress** editor, see [dflow.it](http://dflow.it).

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

## Concept

A *dflow* **graph** is a collection of **tasks** and **pipes** that can be stored in JSON format.

Every task refers to a function which output can be piped as an argument to another other task.

A **context** is a collection of functions.

`dflow.fun(context, graph)` returns a function **f** that executes the *graph* on given *context*.

Note that *dflow* is **context agnostic**. For example a *context* can be one of the following:

  * [process](http://nodejs.org/api/process.html).
  * [window](https://developer.mozilla.org/en-US/docs/Web/API/Window).
  * Any object: properties of *function* type will be used.

In order to mimic common functions behaviour, dflow provides few built-in tasks:

  * `return`: a task that accepts one argument and behaves like a [Return statement](http://en.wikipedia.org/wiki/Return_statement). 
  * `arguments`: task that returns the *arguments* of *f*. 
  * `arguments[0]` ... `arguments[N]`: tasks that return the *arguments[i]* of *f*. 
  * `.foo`: accessor/mutator to *graph.data.foo*.
  * `&bar`: returns *context.bar* function.

## Examples

### page.html

See [test/page.html](https://github.com/fibo/dflow/blob/master/test/page.html) for a working example of *dflow* in a browser context.

### Stream playground

[Node.js Stream Playground](http://ejohn.org/blog/node-js-stream-playground/) first example is

```js
var fs = require("fs");

// Read File
fs.createReadStream("input/people.json")
    // Write File
    .pipe(fs.createWriteStream("output/people.json"));
```

Given this [context](https://github.com/fibo/dflow/blob/master/test/examples/stream-playground/funcs.js), the [stream.json graph](https://github.com/fibo/dflow/blob/master/test/examples/stream-playground/stream.json) is evaluated by [stream.js](https://github.com/fibo/dflow/blob/master/test/examples/stream-playground/stream.js) and works.

### Sample graphs

The following examples use a context defined in [test/examples/funcs.js](https://github.com/fibo/dflow/blob/master/test/examples/funcs.js).

Every example has a *graph* and a set of expected *results* that are used by [test/examples.js](https://github.com/fibo/dflow/blob/master/test/examples.js)

#### empty

[graph](https://github.com/fibo/dflow/blob/master/test/examples/graphs/empty.json)
[results](https://github.com/fibo/dflow/blob/master/test/examples/graphs/empty-results.json)

Just an empty graph, `{}` for instance. It is expected that *dflow* has nothing to do.

#### sum

[graph](https://github.com/fibo/dflow/blob/master/test/examples/graphs/sum.json)
[results](https://github.com/fibo/dflow/blob/master/test/examples/graphs/sum-results.json)

Takes two operands as arguments and returns its sum.

#### apply

[graph](https://github.com/fibo/dflow/blob/master/test/examples/graphs/apply.json)
[results](https://github.com/fibo/dflow/blob/master/test/examples/graphs/apply-results.json)

Implements the apply operator.

#### dotOperator

[graph](https://github.com/fibo/dflow/blob/master/test/examples/graphs/dotOperator.json)
[results](https://github.com/fibo/dflow/blob/master/test/examples/graphs/dotOperator-results.json)

Like the `.` opretor, takes an object and a prop as arguments and returns `object[prop]` value.

## License

[MIT](http://g14n.info/mit-license)

