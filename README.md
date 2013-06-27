dflow
=====

dataflow programming for node.js

# Installation

    npm install dflow

# Description

`dflow` is a minimal implementation of dataflow programming.

## Synopsis

    require('dflow');

    process.dflow.root.pushNode({
      task: function () {
        console.log('hello world');
      }
    });

    process.dflow.root.emit('task');

# Documentation

See the [Wiki] (https://github.com/fibo/dflow/wiki).

# Development

## Grunt tasks

    grunt

    grunt bower:install

## Testing

Install mocha globally

    npm install mocha -g

Then run tests

    npm test

( and say hello to the nyan cat :)

