#!/usr/bin/env node

var dflow = require('../..')
  , funcs = require('./funcs')
  , graph = require('./graphs/console.log.json')

console.log(process.argv)
dflow.func(funcs, graph)('Hello World')

