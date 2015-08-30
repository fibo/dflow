
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

function typeofOperator (operand) { return typeof operand }
exports['typeof'] = typeofOperator

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

function emptyArray () { return [] }
exports['[]'] = emptyArray

exports.isArray  = Array.isArray

exports.indexOf = function (a, b) { return a.indexOf(b) }

exports.filter = function (a, b, t) {
  if (typeof t === 'undefined')
    return a.filter(c, t)
  else
    return a.filter(c)
}

exports.forEach = function (a, c) {
  if (typeof t === 'undefined')
    return a.forEach(c, t)
  else
    return a.forEach(c)
}

exports['Array.prototype.join']    = Array.prototype.join
exports['Array.prototype.map']     = Array.prototype.map
exports['Array.prototype.pop']     = Array.prototype.pop
exports['Array.prototype.push']    = Array.prototype.push
exports['Array.prototype.reduce']  = Array.prototype.reduce
exports['Array.prototype.slice']   = Array.prototype.slice
exports['Array.prototype.sort']    = Array.prototype.sort

// console

exports['console.error'] = console.error.bind(console)
exports['console.log']   = console.log.bind(console)

// Function

exports['Function.prototype'] = Function.prototype

// Global

exports['Infinity'] = function () { return Infinity }

exports.NaN = function () { return NaN }

exports['null'] = function () { return null }

// Object

exports['{}'] = function () { return {} }

exports['Object.prototype.defineProperties']     = Object.prototype.defineProperties
exports['Object.prototype.defineProperty']       = Object.prototype.defineProperty
exports['Object.prototype.hasOwnProperty']       = Object.prototype.hasOwnProperty
exports['Object.prototype.isPrototypeOf']        = Object.prototype.isPrototypeOf
exports['Object.prototype.propertyIsEnumerable'] = Object.prototype.propertyIsEnumerable
exports['Object.prototype.toLocaleString']       = Object.prototype.toLocaleString
exports['Object.prototype.toString']             = Object.prototype.toString
exports['Object.prototype.valueOf']              = Object.prototype.valueOf

// String

exports["''"] = function () { return '' }

exports['String.prototype.charAt']            = String.prototype.charAt
exports['String.prototype.charCodeAt']        = String.prototype.charCodeAt
exports['String.prototype.concat']            = String.prototype.concat
exports['String.prototype.indexOf']           = String.prototype.indexOf
exports['String.prototype.lastIndexOf']       = String.prototype.lastIndexOf
exports['String.prototype.repeat']            = String.prototype.repeat
exports['String.prototype.search']            = String.prototype.search
exports['String.prototype.slice']             = String.prototype.slice
exports['String.prototype.split']             = String.prototype.split
exports['String.prototype.substr']            = String.prototype.substr
exports['String.prototype.substring']         = String.prototype.substring
exports['String.prototype.toLocaleLowerCase'] = String.prototype.toLocaleLowerCase
exports['String.prototype.toLocaleUpperCase'] = String.prototype.toLocaleUpperCase
exports['String.prototype.toLowerCase']       = String.prototype.toLowerCase
exports['String.prototype.toUpperCase']       = String.prototype.toUpperCase
exports['String.prototype.trim']              = String.prototype.trim

