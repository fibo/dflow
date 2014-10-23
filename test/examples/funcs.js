
module.exports = {
  'apply': function (fun, thisArg, argsArray) { return fun.apply(thisArg, argsArray) },
  'console.log': console.log.bind(console),
  '+': function plus (a, b) { return a + b },
  'one': function one () { return 1 },
  'funcs[Math.cos]': function () { return Math.cos },
  'null': function () { return null }
}

