var dflow = require('dflow')
var graph = require('../graphs/new.json')

var newDate = dflow.fun(graph)

console.log(newDate(2016, 1, 1))
