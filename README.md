# dflow

> Dataflow programming

[![NPM version](https://badge.fury.io/js/dflow.png)](http://badge.fury.io/js/dflow) [![Build Status](https://travis-ci.org/fibo/dflow.png?branch=master)](https://travis-ci.org/fibo/dflow?branch=master) [![Dependency Status](https://gemnasium.com/fibo/dflow.png)](https://gemnasium.com/fibo/dflow) [![Coverage Status](https://coveralls.io/repos/fibo/dflow/badge.svg?branch=master)](https://coveralls.io/r/fibo/dflow?branch=master)

[![NPM](https://nodei.co/npm-dl/dflow.png)](https://nodei.co/npm-dl/dflow/)

*dflow* is a minimal [Dataflow programming](http://en.wikipedia.org/wiki/Dataflow_programming) engine.

**Table Of Contents:**

* [Installation](#installation)
* [Examples](#examples)
* [Editor](#editor)
* [Api](#api)
* [Specification](#specification)
* [Support and license](#support-and-license)

## Installation

With [npm](https://npmjs.org/) do

```bash
$ npm install dflow
```

or install globally if you want *dflow* cli in your path

```bash
$ npm install dflow -g
```

With [bower](http://bower.io/) do

```bash
$ bower install dflow
```

and it will install only the engine, client side.

## Examples

### Hello world

The following simple graph is executed client side by *dflow* engine.

[![HelloWorld](http://g14n.info/dflow/examples/hello-world.png)][2]

### Test page

See [test/page.html](http://g14n.info/dflow/test/page.html) for another working example of *dflow* in a browser context.

[![view on requirebin](http://requirebin.com/badge.png)](http://requirebin.com/?gist=45520011e093d6dfec9f)

### Stream playground

[Node.js Stream Playground](http://ejohn.org/blog/node-js-stream-playground/) first example is

```js
var fs = require("fs");

// Read File
fs.createReadStream("input/people.json")
    // Write File
    .pipe(fs.createWriteStream("output/people.json"));
```

It is ported to script [stream.js](https://github.com/fibo/dflow/blob/master/src/examples/stream-playground/stream.js) which evaluates [graph stream.json](https://github.com/fibo/dflow/blob/master/src/examples/stream-playground/stream.json) using [few custom functions](https://github.com/fibo/dflow/blob/master/src/examples/stream-playground/funcs.js).

### Packaged graph

The main advantage of *dflow* design is that you do not need to write components or plugins to extend it. You can use one of the most powerful JavaScript features: functions. Write your functions or import them from other packages like *JQuery* or *underscore* and you are able to use them as *tasks* and connect them with *pipes*.

Also every *dflow* graph is a function itself, so why not packaging it and put it on [npm](https://npm.im)!?

It is really easy: create your *dflow* graph and save it to a JSON file, *index.json* for instance; then launch `npm init` as usual and when prompted for the *entry point* write *index.json*.

Simple as that, see [packagedGraph](https://github.com/fibo/dflow/tree/master/src/examples/packagedGraph) as an example.

## Editor

Launch *dflow* from command line, and start editing your first graph using your favourite browser.

> Usage: dflow [path/to/graph.json]

If no graph is given, an empty graph named *graph.json* will be created.

Open your browser and go to `http://hostname-where-you-launched-dflow.example.org:3000`.

Double click on the SVG canvas to open a text input where you can write the task name you want to create.

Click on a task to select it: addInput, addOutput and deleteTask buttons will appear.

Drag an output into an input to create a pipe.

Click on a pipe to delete it.

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

`dflow.fun(graph)` returns a *dflowFun* function which has also a *graph* property, to remember that it is a function generated by *dflow*.

Actually *dflow* exposes also the following functions, available only inside a *dflow* graph:

  * [dflow.fun](https://github.com/fibo/dflow/blob/master/src/fun.js)
  * [dflow.isDflowFun](https://github.com/fibo/dflow/blob/master/src/isDflowFun.js)
  * [dflow.validate](https://github.com/fibo/dflow/blob/master/src/validate.js)

## Specification

A *graph* is a collection of *tasks* and *pipes* that can be stored in JSON format.

Every *task* refers to a function which output can be piped as an argument to another task.

A *graph* has the following properties

  * **task**: collection of function names.
  * **pipe**: connections from the output of a task to an input of another task.
  * **data**: (optional) persistence object.
  * **func**: (optional) collection of subgraphs.
  * **view**: (ignored) object containing information used by [flow-view][1] to render a graphic representation of the graph.
  * **info**: (to be defined) meta data, like *author*, *version* and, above all, *doc* which is a dflow graph itself.

*dflow* provides few [builtin functions][3] and injects the following ones

  * `return`: a task that accepts one argument and behaves like a [Return statement](http://en.wikipedia.org/wiki/Return_statement).
  * `arguments`: task that returns the *arguments* of *dflowFun*.
  * `arguments[0]` ... `arguments[N]`: tasks that return the *arguments[i]* of *dflowFun*.
  * `this`: refers the *dflowFun* function.
  * `this.graph`: contains the graph itself.
  * `@foo`: accessor to *graph.data.foo*.
  * `&bar`: returns *bar* function.
  * `.quz`, `.quz()`: returns a dot-operator-like function.
  * any taskName found in global context, walking throw dot operator, is available as a task. For example
    - `isFunction`
    - `Math.cos` 
    - `process.version`: will resolve to a function that returns it

Note that optional collection of *additionalFunctions*, in order to avoid conflicts with *injected* functions, must contain function names validated by following the rules:

  * cannot be the name of an injected function: `return`, `arguments`, `arguments[0]` ... `arguments[N]`, `this` and `this.graph` are reserved names.
  * cannot start with a dot, ampersand or at sign: names `@foo`, `&bar`, `.quz` and `.quz()` for an additional function are not allowed.

## Support and License

*dflow* is [MIT](http://g14n.info/mit-license) licensed.

It is developed in my spare time and, as far as I know, by now *I am my only user*.

I wrote few times a dataflow engine, the first one was PNI (Perl Node Interface) and the design evolved until I could say confidently that **dflow is here to stay**.

Use cases I can think about *dflow* right now are many, but, the possibilities are I.M.H.O. outstanding: from client to server, from JavaScript to cross language, from mono-thread to graphs distributed on a network and, above all, from skilled programmer who implement functions … to artists, genetic engineers, data scientists, etc. that use those functions to create *dflow* graphs and get results nobody could even imagine.

If this is also your vision or you just want to use *dflow*, [contact me](http://g14n.info).

My goal is to say to a *dflow* user:

> Mamma mia! Did you achieve that with dflow?

 [1]: http://g14n.info/flow-view "flow-view"
 [2]: http://g14n.info/dflow/examples/hello-world.html "Hello World"
 [3]: https://github.com/fibo/dflow/blob/master/src/functions/builtin.js "builtin functions"

