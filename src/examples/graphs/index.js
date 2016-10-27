// Do not use dynamic imports, for example importing the whole graph folder;
// use explicit imports instead, otherwise browserify will not include graphs.
exports['apply'] = require('./apply.json')
exports.createParagraph = require('./createParagraph.json')
exports.dateParse = require('./dateParse.json')

exports['hello-world'] = require('./hello-world.json')
exports.indexOf = require('./indexOf.json')

exports.sum = require('./sum.json')
exports.or = require('./or.json')
exports.welcome = require('./welcome.json')

// TODO
// it works but I get an error when comparing results
// AssertionError: expected 2016-02-01 00:00:00.000 -0500 deepEqual '2016-02-01 00:00:00.000 -0500'
// exports['new'] = require('./new.json')

// TODO fix it! exports.dotOperator = require('./dotOperator.json')
