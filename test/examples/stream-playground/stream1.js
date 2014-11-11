
var dflow = require('dflow')

var graph = require('./stream.json')
var funcs = require('./funcs')

var f = dflow.fun(funcs, graph)

f()

/*
var fs = require("fs");

// Read File
fs.createReadStream("input/people.json")
    // Write File
    .pipe(fs.createWriteStream("output/people.json"));
*/

