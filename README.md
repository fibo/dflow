dflow
=====

dataflow programming for Node.js

[![Build Status](https://travis-ci.org/fibo/dflow.png?branch=master)](https://travis-ci.org/fibo/dflow.png?branch=master)

# Installation

    npm install dflow

# Description

`dflow` is a minimal implementation of dataflow programming.

# Hello world

    var dflow = require('dflow');

    var DflowGraph = dflow.DflowGraph;

    var graph = new DflowGraph();

    var id1 = graph.createNode('Hello World');
    var id2 = graph.createNode(function (msg) {console.log(msg);});

    graph.createEdge(id1, id2);

    graph.run();

