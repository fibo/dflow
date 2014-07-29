# dflow

> Dataflow programming

[![NPM version](https://badge.fury.io/js/dflow.png)](http://badge.fury.io/js/dflow) [![Build Status](https://travis-ci.org/fibo/dflow.png?branch=master)](https://travis-ci.org/fibo/dflow.png?branch=master) [![Dependency Status](https://gemnasium.com/fibo/dflow.png)](https://gemnasium.com/fibo/dflow)

# NOTA BENE

`dflow` can run from command line, but, it is intended to be used with a GUI.
See [dflow.it](http://dflow.it), for a **work in progress** demo using [springy](http://getspringy.com).
 

# Description

*dflow* is a very simple, minimal and natural idea that could be implemented in any programming language.

A *dflow* **graph** is a collection of **tasks** and **pipes**. A *graph* is stored in JSON format.
Every task refers to a function which output can be piped as an argument to other tasks.
A *task* can have **input pipes** and **output pipes**.

A *task* can have 
* **parents**
: tasks which output is piped to the task arguments
* **children**
: tasks that has an argument piped from the task output

Every task has a **level** from 0 to n. A task with no input pipes has *level* 0.
A task with *parents* has level = max(level of its parents) + 1

The `dflow.evaluate()` is a filter function that
  * takes a *graph* as argument
  * order its *tasks* by their *level*
  * executes the tasks and store their output
  * return the evaluated *graph*

# Examples

See online [examples](https://github.com/fibo/dflow/blob/master/examples/README.md)

# Installation

With [npm](https://npmjs.org/) do

```bash
$ npm install dflow
```

# License

[MIT][2]

[1]: https://github.com/fibo/fibo-gulptasks
[2]: http://fibo.mit-license.org/

