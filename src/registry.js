
function and (a, b) { return a && b }
function or (a, b) { return a || b }

var registry = {
  'and'       : and
, '&&'        : and
, 'or'        : or
, '||'        : or
, '*'         : function (a, b) { return a * b }
, '/'         : function (a, b) { return a / b }
, '-'         : function (a, b) { return a - b }
, '+'         : function (a, b) { return a + b }
, '=='        : function (a, b) { return a == b }
, '!='        : function (a, b) { return a != b }
, '==='       : function (a, b) { return a === b }
, '!=='       : function (a, b) { return a !== b }
, 'string'    : function string (x) { if (typeof x === 'string') return x }
, 'number'    : function number (x) { if (typeof x === 'number') return x }
, 'object'    : function object (x) { if (typeof x === 'object') return x }
, 'typeof'    : function _typeof (x) { return typeof x }
, 'undefined' : function _undefined () { return undefined }
, 'null'      : function _null () { return null }
}

module.exports = registry

