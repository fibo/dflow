
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

function dot (obj, propName) {
  if (typeof propName === 'string') {
    if (typeof obj === 'object')
      return obj[propName]
    else
      // fallback to global object
      return global[obj][propName]
  }
}

module.exports = function (dflow) {
  var register = dflow.register

  register('and', and)
  register('&&', and)

  register('or', or)
  register('||', or)

  register('.', dot)
  register('dot', dot)

  register('+', addition)
  register('addition', addition)

  register('-', subtraction)
  register('subtraction', subtraction)

  register('*', multiplication)
  register('multiplication', multiplication)

  register('/', division)
  register('division', division)

  register('%', modulus)
  register('modulus', modulus)

  register('++', increment)
  register('increment', increment)

  register('--', decrement)
  register('decrement', decrement)

  register('==', function (a, b) { return a == b })
  register('!=', function (a, b) { return a != b })
  register('==='            , function (a, b) { return a === b })
  register('!=='            , function (a, b) { return a !== b })

  register('string', function string (x) { if (typeof x === 'string') return x })
  register('number', function number (x) { if (typeof x === 'number') return x })
  register('object', function object (x) { if (typeof x === 'object') return x })
  register('typeof', function _typeof (x) { return typeof x })
  register('undefined', function _undefined () { return undefined })
  register('null', function _null () { return null })

  register('[]', array)
  register('array', array)

  // console tasks
  var console = global.console

  for (var k in console)
    // Make sure console functions are executed in console context
    register('console.' + k, console[k], console)

}

