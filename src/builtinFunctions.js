
function typeofOperator (operand) { return typeof operand }

exports['typeof'] = typeofOperator

//function method0 (obj, method) { return obj[method]() }

//function method1 (obj, method, arg1) { return obj[method](arg1) }

//function method2 (obj, method, arg1, arg2) { return obj[method](arg1, arg2) }

//exports['method2'] = method2

function applyMethod (fun, thisArg, argsArray) { return fun.apply(thisArg, argsArray) }

exports.apply = applyMethod

function nullValue () { return null }

exports['null'] = nullValue

function dot (obj, prop) { return obj[prop] }

exports['.'] = dot

// Arithmetic operators.

function addition (a, b) { return a + b }

exports['+'] = addition

function multiplication (a, b) { return a * b }

exports['*'] = multiplication

function subtraction (a, b) { return a - b }

exports['-'] = subtraction

function division (a, b) { return a / b }

exports['/'] = division

// Logical operators.

function and (a, b) { return a && b }

exports['&&'] = and

function or (a, b) { return a || b }

exports['||'] = or

// console.

exports['console.log'] = console.log.bind(console)

// Math.

exports['Math.cos'] = Math.cos
exports['Math.sin'] = Math.sin

