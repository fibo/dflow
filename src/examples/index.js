// Do not use dynamic imports, for example importing the whole graph folder;
// use explicit imports instead, otherwise browserify will not include graphs.
exports.apply = require('./graph/apply.json')
exports.createParagraph = require('./graph/createParagraph.json')
exports.dateParse = require('./graph/dateParse.json')
exports.dotOperator = require('./graph/dotOperator.json')
exports['hello-world'] = require('./graph/hello-world.json')
exports.indexOf = require('./graph/indexOf.json')
exports['new'] = require('./graph/new.json')
exports.or = require('./graph/or.json')
exports.sum = require('./graph/sum.json')
exports.welcome = require('./graph/welcome.json')
