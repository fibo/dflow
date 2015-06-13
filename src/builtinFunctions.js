
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

function typeofOperator (operand) { return typeof operand }
exports['typeof'] = typeofOperator

function applyMethod (fun, thisArg, argsArray) { return fun.apply(thisArg, argsArray) }
exports.apply = applyMethod

function dot (obj, prop) { return obj[prop] }
exports['.'] = dot

// Array

exports['Array.isArray']  = Array.isArray

exports['Array.prototype.filter']  = Array.prototype.filter
exports['Array.prototype.forEach'] = Array.prototype.forEach
exports['Array.prototype.indexOf'] = Array.prototype.indexOf
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

// Date

exports['Date.now']   = Date.now
exports['Date.parse'] = Date.parse

// Function

exports['Function.prototype'] = Function.prototype

// Global

function infinity () { return Infinity }
exports['Infinity'] = infinity

exports.isFinite = isFinite

exports.isNaN = isNaN

function nan () { return NaN }
exports.NaN = nan

function nullValue () { return null }
exports['null'] = nullValue

// JSON

exports['JSON.parse']     = JSON.parse
exports['JSON.stringify'] = JSON.stringify

// Math

function MathE () { return Math.E }
exports['Math.E'] = MathE

function MathLN2 () { return Math.LN2 }
exports['Math.LN2'] = MathLN2

function MathLN10 () { return Math.LN10 }
exports['Math.LN10'] = MathLN10

function MathLOG2 () { return Math.LOG2 }
exports['Math.LOG2'] = MathLOG2

function MathLOG10 () { return Math.LOG10 }
exports['Math.LOG10'] = MathLOG10

function MathPI () { return Math.PI }
exports['Math.PI'] = MathPI

function MathSQRT1_2 () { return Math.SQRT1_2 }
exports['Math.SQRT1_2'] = MathSQRT1_2

function MathSQRT2 () { return Math.SQRT2 }
exports['Math.SQRT2'] = MathSQRT2

exports['Math.abs']    = Math.abs
exports['Math.acos']   = Math.acos
exports['Math.acosh']  = Math.acosh
exports['Math.asin']   = Math.asin
exports['Math.asinh']  = Math.asinh
exports['Math.atan']   = Math.atan
exports['Math.atanh']  = Math.atanh
exports['Math.atan2']  = Math.atan2
exports['Math.cbrt']   = Math.cbrt
exports['Math.ceil']   = Math.ceil
exports['Math.clz32']  = Math.clz32
exports['Math.cos']    = Math.cos
exports['Math.cosh']   = Math.cosh
exports['Math.exp']    = Math.exp
exports['Math.expm1']  = Math.expm1
exports['Math.floor']  = Math.floor
exports['Math.fround'] = Math.fround
exports['Math.hypot']  = Math.hypot
exports['Math.imul']   = Math.imul
exports['Math.log']    = Math.log
exports['Math.logip']  = Math.logip
exports['Math.log10']  = Math.log10
exports['Math.log2']   = Math.log2
exports['Math.max']    = Math.max
exports['Math.min']    = Math.min
exports['Math.pow']    = Math.pow
exports['Math.random'] = Math.random
exports['Math.round']  = Math.round
exports['Math.sign']   = Math.sign
exports['Math.sin']    = Math.sin
exports['Math.sinh']   = Math.sinh
exports['Math.sqrt']   = Math.sqrt
exports['Math.tan']    = Math.tan
exports['Math.tanh']   = Math.tanh
exports['Math.trunc']  = Math.trunc

// Number

function epsilon () { return Number.EPSILON }
exports['Number.EPSILON'] = epsilon

function min_value () { return Number.MIN_VALUE }
exports['Number.MIN_VALUE'] = min_value

function max_value () { return Number.MAX_VALUE }
exports['Number.MAX_VALUE'] = max_value

// Object

exports['Object.keys'] = Object.keys

exports['Object.prototype.defineProperty'] = Object.prototype.defineProperty

// String

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

