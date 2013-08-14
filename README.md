dflow
=====

dataflow programming for Node.js

[![Build Status](https://travis-ci.org/fibo/dflow.png?branch=master)](https://travis-ci.org/fibo/dflow.png?branch=master)

# Installation

    npm install dflow

# Description

`dflow` is a minimal implementation of dataflow programming.

# Hello world

    var root = require('dflow').root;

    var id1 = root.createArguments('Hello', 'World');
    var id2 = root.createFunction(function (a, b) {console.log(a + ' ' +b);});

    root.createEdge(id1, id2);

    root.runTask(); // will print "Hello World"

