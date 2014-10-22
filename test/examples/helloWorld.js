#!/usr/bin/env node

var dflow = require('dflow')
  , funcs = require('./funcs')
  , graph = require('./graphs/console.log.json')

dflow.func(funcs, graph)('Hello World')

