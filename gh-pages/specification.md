---
title: Specification
---

# Specification

A *graph* is a collection of *tasks* and *pipes* that can be stored in JSON format.

Every *task* refers to a function which output can be piped as an argument to another task.

A *graph* has the following properties

  * **task**: collection of function names.
  * **pipe**: connections from the output of a task to an input of another task.
  * **data**: (optional) persistence object.
  * **func**: (optional) collection of subgraphs.
  * **view**: (ignored) object containing information used by [flow-view][flow-view] to render a graphic representation of the graph.
  * **info**: (to be defined) meta data, like *author*, *version* and, above all, *doc* which is a dflow graph itself.

*dflow* provides few [builtin functions][builtin-functions] and injects the following ones

  * `return`: a task that accepts one argument and behaves like a [Return statement](http://en.wikipedia.org/wiki/Return_statement).
  * `arguments`: task that returns the *arguments* of *dflowFun*.
  * `arguments[0]` ... `arguments[N]`: tasks that return the *arguments[i]* of *dflowFun*.
  * `this`: refers the *dflowFun* function.
  * `this.graph`: contains the graph itself.
  * `this.graph.data`: returns the graph data content.
  * `@foo`: accessor to *graph.data.foo*.
  * `&bar`: returns *bar* function.
  * `.quz`, `.quz()`: returns a dot-operator-like function.
  * any task found in global context, for example
    - `isFunction`
    - `Math.cos`
    - `process.version`: will resolve to a function that returns it
  * `/subgraph`: returns a function compiled from *subgraph* that is an entry in *func* collection.
  * `'string'`: a quoted string will resolve to a function that returns that string.
  * `123`: any number or float will resolve to a function that returns that number.
  * `// comment`: every task starting with `//` is ignored.

Note that optional collection of *additionalFunctions*, in order to avoid conflicts with *injected* functions, must contain function names validated by following the rules:

  * cannot be the name of an injected function: `return`, `arguments`, `arguments[0]` ... `arguments[N]`, `this` and `this.graph` are reserved names.
  * cannot start with a dot, ampersand or at sign: names `@foo`, `&bar`, `.quz` and `.quz()` for an additional function are not allowed.

[flow-view]: http://g14n.info/flow-view
[builtin-functions]: https://github.com/fibo/dflow/blob/master/src/engine/functions/builtin.js
