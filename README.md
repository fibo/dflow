# dflow

> Is a minimal [Dataflow programming][4] engine.

**Table Of Contents:**

* [Installation](#installation)
* [Examples](#examples)
* [Editor](#editor)
* [Api](#api)
* [Specification](#specification)
* [Support and license](#support-and-license)

[![NPM version](https://badge.fury.io/js/dflow.png)](http://badge.fury.io/js/dflow) [![Build Status](https://travis-ci.org/fibo/dflow.png?branch=master)](https://travis-ci.org/fibo/dflow?branch=master) [![Dependency Status](https://gemnasium.com/fibo/dflow.png)](https://gemnasium.com/fibo/dflow) [![Coverage Status](https://coveralls.io/repos/fibo/dflow/badge.svg?branch=master)](https://coveralls.io/r/fibo/dflow?branch=master) [![Test page](https://img.shields.io/badge/test-page-blue.svg)](http://g14n.info/dflow/test)

[![Whatchers](https://img.shields.io/github/watchers/fibo/dflow.svg?style=social&label=Watch)](https://github.com/fibo/dflow/watchers) [![Stargazers](https://img.shields.io/github/stars/fibo/dflow.svg?style=social&label=Star)](https://github.com/fibo/dflow/stargazers) [![Forks](https://img.shields.io/github/forks/fibo/dflow.svg?style=social&label=Forks)](https://github.com/fibo/dflow/network/members)

[![NPM](https://nodei.co/npm-dl/dflow.png)](https://nodei.co/npm-dl/dflow/)

[![Throughput Graph](https://graphs.waffle.io/fibo/dflow/throughput.svg)](https://waffle.io/fibo/dflow)

## Status

*dflow* is beta software: the engine is pretty much stable, the editor is usable but with an ugly webpage and collaborative editing feature is  buggy (: but I am proud and they will be fixed in version **1.0** :).
Next step: start using *dflow*, improve editor look&feel, add more examples using the editor and go for a stable version.

## Installation

### Client side

If you have some [graphs](#specification) ready to run on client side, you can install dflow engine with [bower](http://bower.io/)

```bash
$ bower install dflow
```

### Server side

If you are new to *dflow*, you probably want to try the [editor](#editor), so you need to install globally to get *dflow* cli in your path.
With [npm](https://npmjs.org/) do

```bash
$ npm install dflow -g
```

However, if you need to require the *dflow* engine in your package, or you need to browserify it, or even you want to use the *dflow* cli in your npm scripts, or whatever, you can install *dflow* locally with

```bash
$ npm install dflow
```

If you want start hacking on dflow run

```bash
$ git clone https://github.com/fibo/dflow.git
$ cd dflow
$ npm install
$ npm start
```

which will clone repo, install deps, and start the *dflow* cli.
Then point your browser to *http://localhost:3000* and edit your *graph.json*.
Note that opening another browser window on *http://localhost:3000* you can try the **collaborative editing** feature, powered by [Socket.IO](http://socket.io/)!

## Examples

### Hello world

The following simple graph is executed client side by *dflow* engine.

[![HelloWorld](http://g14n.info/dflow/examples/hello-world.png)][2]

### Client side

See [example/client-side.html](http://g14n.info/dflow/examples/client-side.html) for another working example of *dflow* in a browser context.

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

```
Usage: dflow [options] [path/to/graph.json]

  -h, --help          print this message and exit
  -p, --port          server port number, defaults to 3000
  -v, --verbose       print events on stdout
  --version           print current version and exit

For more info point your browser to http://g14n.info/dflow
```

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
By the way, I got a stimulating feedback by [Stamplay](https://stamplay.com/)'s founder, who it is pretty much interested in using *dflow* maybe in the future. **Grazie** Giuliano, I hope you all the best.

I wrote few times a [Dataflow engine][4], the first one was PNI (Perl Node Interface) and the design evolved until I could say confidently that **dflow is here to stay**.

Use cases I can think about *dflow* right now are many, but, the possibilities are I.M.H.O. outstanding: from client to server, from JavaScript to cross language, from mono-thread to graphs distributed on a network and, above all, from skilled programmer who implement functions … to artists, genetic engineers, data scientists, etc. that use those functions to create *dflow* graphs and get results nobody could even imagine.

If this is also your vision or you just want to use *dflow*, [contact me](http://g14n.info).

My goal is to say to a *dflow* user:

> Mamma mia! Did you achieve that with dflow?

 [1]: http://g14n.info/flow-view "flow-view"
 [2]: http://g14n.info/dflow/examples/hello-world.html "Hello World"
 [3]: https://github.com/fibo/dflow/blob/master/src/functions/builtin.js "builtin functions"
 [4]: http://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"

