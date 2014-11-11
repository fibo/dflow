
var dflow = require('dflow')

var graph = require('./stream.json')
var funcs = require('./funcs')

var f = dflow.fun(funcs, graph)

f()

