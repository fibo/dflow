// Do not use dynamic imports, for example importing the whole graph folder;
// use explicit imports instead, otherwise browserify will not include graphs.
exports['apply'] = require('./apply.json')
exports.createParagraph = require('./createParagraph.json')
exports.dateParse = require('./dateParse.json')
exports.dotOperator = require('./dotOperator.json')
exports['hello-world'] = require('./hello-world.json')
exports.indexOf = require('./indexOf.json')
exports['new'] = require('./new.json')
exports.or = require('./or.json')
exports.sum = require('./sum.json')
exports.welcome = require('./welcome.json')
