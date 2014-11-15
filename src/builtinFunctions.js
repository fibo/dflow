
function applyMethod (fun, thisArg, argsArray) { return fun.apply(thisArg, argsArray) }

exports['apply'] = applyMethod

function nullValue () { return null }

exports['null'] = nullValue

function dot (obj, prop) { return obj[prop] }

exports['.'] = dot

// Arithmetic operators.

function multiplication (a, b) { return a * b }

exports['*'] = multiplication

function addition (a, b) { return a + b }

exports['+'] = addition

// console.

exports['console.log'] = console.log.bind(console)

// Math.

exports['Math.cos'] = Math.cos

