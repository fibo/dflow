
// Arithmetic operators

function addition (a, b) { return a + b }
exports['+'] = addition

function multiplication (a, b) { return a * b }
exports['*'] = multiplication

function subtraction (a, b) { return a - b }
exports['-'] = subtraction

function division (a, b) { return a / b }
exports['/'] = division

function modulus (a, b) { return a % b }
exports['%'] = modulus

// Logical operators

function and (a, b) { return a && b }
exports['&&'] = and

function or (a, b) { return a || b }
exports['||'] = or

function not (a) { return ! a }
exports['!'] = not

// Comparison operators

function equalTo (a, b) { return a == b }
exports['=='] = equalTo

function equalValueAndEqualType (a, b) { return a === b }
exports['==='] = equalValueAndEqualType

function notEqual (a, b) { return a != b }
exports['!='] = notEqual

function notEqualValueAndEqualType (a, b) { return a !== b }
exports['!=='] = notEqualValueAndEqualType

function greaterThen (a, b) { return a > b }
exports['>'] = greaterThen

function lessThen (a, b) { return a < b }
exports['<'] = lessThen

function greaterThenOrEqualTo (a, b) { return a >= b }
exports['>='] = greaterThenOrEqualTo

function lessThenOrEqualTo (a, b) { return a <= b }
exports['<='] = lessThenOrEqualTo

// Other operators

function applyMethod (fun, thisArg, argsArray) {
  return fun.apply(thisArg, argsArray)
}
exports.apply = applyMethod

function dot (obj, prop) { return obj[prop] }
exports['.'] = dot

exports['typeof'] = function (a) { return typeof a }

function newOperator () {
  var Obj = arguments[0],
      arg1 = arguments[1],
      arg2 = arguments[2],
      arg3 = arguments[3],
      arg4 = arguments[4],
      arg5 = arguments[5],
      argN = arguments.length - 1

  if (argN === 0) return new Obj()
  if (argN === 1) return new Obj(arg1)
  if (argN === 2) return new Obj(arg1, arg2)
  if (argN === 3) return new Obj(arg1, arg2, arg3)
  if (argN === 4) return new Obj(arg1, arg2, arg3, arg4)
  if (argN === 5) return new Obj(arg1, arg2, arg3, arg4, arg5)
  // If you have a constructor with more than 5 arguments ... think about refactoring or redesign it.
}

exports['new'] = newOperator

// Array

exports['[]'] = function () { return [] }

exports.indexOf = function (a, b) { return a.indexOf(b) }

exports.push = function (a, b) { return a.push(b) }

exports.pop = function (a, b) { return a.pop(b) }

// console

exports['console.error'] = console.error.bind(console)
exports['console.log']   = console.log.bind(console)

// Global

exports['Infinity'] = function () { return Infinity }

exports.NaN = function () { return NaN }

exports['null'] = function () { return null }

// Object

exports['{}'] = function () { return {} }

// Boolean

exports.false = function () { return false }

exports.true = function () { return true }

