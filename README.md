# dflow

> Dataflow programming

[![NPM version](https://badge.fury.io/js/dflow.png)](http://badge.fury.io/js/dflow) [![Build Status](https://travis-ci.org/fibo/dflow.png?branch=master)](https://travis-ci.org/fibo/dflow.png?branch=master) [![Dependency Status](https://gemnasium.com/fibo/dflow.png)](https://gemnasium.com/fibo/dflow) [![Coverage Status](https://coveralls.io/repos/fibo/dflow/badge.svg?branch=master)](https://coveralls.io/r/fibo/dflow?branch=master)

[![NPM](https://nodei.co/npm-dl/dflow.png)](https://nodei.co/npm-dl/dflow/)

## Description

*dflow* is a minimal [Dataflow programming](http://en.wikipedia.org/wiki/Dataflow_programming) engine (~250 LOC).

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

> dflow exports a [fun](https://github.com/fibo/dflow/blob/master/src/fun.js) function ☺

It has the following signature.

```
/**
 * Create a dflow function.
 *
 * @param {Object} graph to be executed
 * @param {Object} [additionalFunctions] is a collection of functions
 *
 * @returns {Function} dflowFun that executes the given graph
 */
```

Actually *dflow* exposes also the following functions, available only inside a *dflow* graph:

  * [dflow.builtinFunctions](https://github.com/fibo/dflow/blob/master/src/builtinFunctions.js)
  * [dflow.fun](https://github.com/fibo/dflow/blob/master/src/fun.js)
  * [dflow.validate](https://github.com/fibo/dflow/blob/master/src/validate.js)

## Specification

A *graph* is a collection of *tasks* and *pipes* that can be stored in JSON format.

Every *task* refers to a function which output can be piped as an argument to another other task.

A *graph* has the following properties

  * **task**: collection of function names.
  * **pipe** : connections from the output of a task to an input of another task.
  * **data** : (optional) persistence.
  * **func** : (optional) collection of subgraphs.
  * **view** : (ignored) object containing information used by [flow-view](http://g14n.info/flow-view) to render a graphic representation of the graph.
  * **info** : (to be defined) meta data, like *author*, *version* and, above all, *doc* which is a dflow graph itself.

*dflow* provides few [builtin functions](https://github.com/fibo/dflow/blob/master/src/builtinFunctions.js) and injects the following ones

  * `return`: a task that accepts one argument and behaves like a [Return statement](http://en.wikipedia.org/wiki/Return_statement).
  * `arguments`: task that returns the *arguments* of *dflowFun*.
  * `arguments[0]` ... `arguments[N]`: tasks that return the *arguments[i]* of *dflowFun*.
  * `.foo`: accessor to *graph.data.foo*.
  * `&bar`: returns *bar* function.

Note that optional collection of *additionalFunctions*, in order to avoid conflicts with *injected* functions, must contain function names validated by following the rules:

  * cannot be the name of an injected function: `return`, `arguments`, `arguments[0]` ... `arguments[N]` are reserved names.
  * cannot start with a dot: name `.foo` for an additional function is not allowed.
  * idem for the ampersand: name `&bar` for an additional function is not allowed.

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

### Packaged graph

The main advantage of *dflow* design is that you do not need to write components or plugins to extend it. You can use one of the most powerful JavaScript features: functions. Write your functions or import them from other packages like *JQuery* or *underscore* and you are able to use them as *tasks* and connect them with *pipes*.

Also every *dflow* graph is a function itself, so why not packaging it and put it on [npm](https://npm.im)!?

It is really easy: create your *dflow* graph and save it to a JSON file, *index.json* for instance; then launch `npm init` as usual and when prompted for the *entry point* write *index.json*.

Simple as that, see [packagedGraph](https://github.com/fibo/dflow/tree/master/test/examples/packagedGraph) as an example.

## Support and License

*dflow* is [MIT](http://g14n.info/mit-license) licensed.

It is developed in my spare time and, as far as I know, by now *I am my only user*.

I wrote few times a dataflow engine, the first one was PNI (Perl Node Interface) and the design evolved until I could say confidently that **dflow is here to stay**.

Use cases I can think about *dflow* right now are many, but, the possibilities are I.M.H.O outstanding: from client to server, from JavaScript to cross language, from mono-thread to graphs distributed on a network and, above all, from skilled programmer who write functions code … to artists, genetic engineers, data scientists, etc. that use those functions to create *dflow* graphs and get results nobody could even imagine.

If this is also your vision or you just want to use *dflow*, [contact me](http://g14n.info).

My goal is to say to a *dflow* user:

> Mamma mia! Did you achieve that with dflow?

