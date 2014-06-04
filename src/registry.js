
function addition (a, b) { return a + b }
function subtraction (a, b) { return a - b }
function multiplication (a, b) { return a * b }
function division (a, b) { return a / b }

function modulus (a, b) { return a % b }

function increment (a) { return a++ }
function decrement (a) { return a-- }

function and (a, b) { return a && b }

function or (a, b) { return a || b }

function array () { return Array.prototype.slice.call(arguments, 0) }

var registry = {
  'and'            : and
, '&&'             : and
, 'or'             : or
, '||'             : or
, '.'              : function (obj, propName) { return obj[propName] }
, '+'              : addition
, 'addition'       : addition
, '-'              : subtraction
, 'subtraction'    : subtraction
, '*'              : multiplication
, 'multiplication' : multiplication
, '/'              : division
, 'division'       : division
, '%'              : modulus
, 'modulus'        : modulus
, '++'             : increment
, 'increment'      : increment
, '--'             : decrement
, 'decrement'      : decrement
, '=='             : function (a, b) { return a == b }
, '!='             : function (a, b) { return a != b }
, '==='            : function (a, b) { return a === b }
, '!=='            : function (a, b) { return a !== b }
, 'string'         : function string (x) { if (typeof x === 'string') return x }
, 'number'         : function number (x) { if (typeof x === 'number') return x }
, 'object'         : function object (x) { if (typeof x === 'object') return x }
, 'typeof'         : function _typeof (x) { return typeof x }
, 'undefined'      : function _undefined () { return undefined }
, 'null'           : function _null () { return null }
, '[]'             : array
, 'array'          : array
}

module.exports = registry

