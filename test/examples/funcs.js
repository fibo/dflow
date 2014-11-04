
module.exports = {
  'apply': function (fun, thisArg, argsArray) { return fun.apply(thisArg, argsArray) },
  'console.log': console.log.bind(console),
  '+': function plus (a, b) { return a + b },
  '.': function dot (obj, prop) { return obj[prop] },
  'one': function one () { return 1 },
  'function Math.cos': function () { return Math.cos },
  'null': function () { return null }
}

