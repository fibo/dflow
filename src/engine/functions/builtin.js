var no = require('not-defined')

// Arithmetic operators

exports['+'] = function (a, b) { return a + b }

exports['*'] = function (a, b) { return a * b }

exports['-'] = function (a, b) { return a - b }

exports['/'] = function (a, b) { return a / b }

exports['%'] = function (a, b) { return a % b }

// Logical operators

exports['&&'] = function (a, b) { return a && b }

exports['||'] = function (a, b) { return a || b }

exports['!'] = function (a) { return !a }

// Comparison operators

exports['==='] = function (a, b) { return a === b }

exports['!=='] = function (a, b) { return a !== b }

exports['>'] = function (a, b) { return a > b }

exports['<'] = function (a, b) { return a < b }

exports['>='] = function (a, b) { return a >= b }

exports['<='] = function (a, b) { return a <= b }

// Other operators

exports.apply = function (fun, thisArg, argsArray) {
  if (no(fun)) return

  return fun.apply(thisArg, argsArray)
}

// TODO try to import it in the editor, it seems to complain with
// TypeError: Cannot read property '' of undefined(…)
exports['.'] = function (obj, prop) {
  if (no(obj) || no(prop)) return

  return obj[prop]
}

exports['='] = function (a, b) { return (a = b) }

exports['typeof'] = function (a) { return typeof a }

exports['new'] = function (Obj, arg1, arg2, arg3, arg4, arg5) {
  if (no(Obj)) return

  var argN = arguments.length - 1

  if (argN === 0) return new Obj()
  if (argN === 1) return new Obj(arg1)
  if (argN === 2) return new Obj(arg1, arg2)
  if (argN === 3) return new Obj(arg1, arg2, arg3)
  if (argN === 4) return new Obj(arg1, arg2, arg3, arg4)
  if (argN === 5) return new Obj(arg1, arg2, arg3, arg4, arg5)
  // If you have a constructor with more than 5 arguments ... think about refactoring or redesign it.
}

// Array

exports['[]'] = function () { return [] }

exports.indexOf = function (a, b) { return a.indexOf(b) }

exports.push = function (a, b) { return a.push(b) }

exports.pop = function (a, b) { return a.pop(b) }

// console

exports['console.error'] = console.error.bind(console)
exports['console.log'] = console.log.bind(console)

// Global

exports['Infinity'] = function () { return Infinity }

exports.NaN = function () { return NaN }

exports['null'] = function () { return null }

// Object

exports['{}'] = function () { return {} }

// Boolean

exports.false = function () { return false }

exports.true = function () { return true }

// Date

exports.now = function () { return new Date() }
