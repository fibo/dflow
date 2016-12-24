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

// Eval is not allowed at run time

exports.eval = function () {
  throw new Error('eval is not allowed at run time')
}

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

exports['='] = function (a, b) {
  if (no(a)) return

  a = b

  return a
}

/* eslint-disable */
exports['=='] = function (a, b) { return (a == b) }
/* eslint-enable */

exports['==='] = function (a, b) { return (a === b) }

exports['typeof'] = function (a) { return typeof a }

// Array

exports['[]'] = function () { return [] }

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
