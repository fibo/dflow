(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],2:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    this.length = 0
    this.parent = undefined
  }

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(array)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
} else {
  // pre-set for values that may exist in the future
  Buffer.prototype.length = undefined
  Buffer.prototype.parent = undefined
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":1,"ieee754":4,"isarray":3}],3:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],4:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],5:[function(require,module,exports){
module.exports=function(x){return typeof x==='undefined'}

},{}],6:[function(require,module,exports){
module.exports = function format(msg) {
  var args = arguments;
  for(var i = 1, l = args.length; i < l; i++) {
    msg = msg.replace(/%s/, args[i]);
  }
  return msg;
}

},{}],7:[function(require,module,exports){
var getType = require('should-type');
var format = require('./format');
var hasOwnProperty = Object.prototype.hasOwnProperty;

function makeResult(r, path, reason, a, b) {
  var o = {result: r};
  if(!r) {
    o.path = path;
    o.reason = reason;
    o.a = a;
    o.b = b;
  }
  return o;
}

var EQUALS = makeResult(true);

function typeToString(t) {
  return t.type + (t.cls ? '(' + t.cls + (t.sub ? ' ' + t.sub : '') + ')' : '');
}



var REASON = {
  PLUS_0_AND_MINUS_0: '+0 is not equal to -0',
  DIFFERENT_TYPES: 'A has type %s and B has type %s',
  NAN_NUMBER: 'NaN is not equal to any number',
  EQUALITY: 'A is not equal to B',
  EQUALITY_PROTOTYPE: 'A and B have different prototypes',
  WRAPPED_VALUE: 'A wrapped value is not equal to B wrapped value',
  FUNCTION_SOURCES: 'function A is not equal to B by source code value (via .toString call)',
  MISSING_KEY: '%s has no key %s',
  CIRCULAR_VALUES: 'A has circular reference that was visited not in the same time as B',
  SET_MAP_MISSING_KEY: 'Set/Map missing key',
  MAP_VALUE_EQUALITY: 'Values of the same key in A and B is not equal'
};


function eqInternal(a, b, opts, stackA, stackB, path, fails) {
  var r = EQUALS;

  function result(comparison, reason) {
    if(arguments.length > 2) {
      var args = Array.prototype.slice.call(arguments, 2);
      reason = format.apply(null, [reason].concat(args));
    }
    var res = makeResult(comparison, path, reason, a, b);
    if(!comparison && opts.collectAllFails) {
      fails.push(res);
    }
    return res;
  }

  function checkPropertyEquality(property) {
    return eqInternal(a[property], b[property], opts, stackA, stackB, path.concat([property]), fails);
  }

  function checkAlso(a1, b1) {
    return eqInternal(a1, b1, opts, stackA, stackB, path, fails);
  }

  // equal a and b exit early
  if(a === b) {
    // check for +0 !== -0;
    return result(a !== 0 || (1 / a == 1 / b) || opts.plusZeroAndMinusZeroEqual, REASON.PLUS_0_AND_MINUS_0);
  }

  var l, p;

  var typeA = getType(a),
    typeB = getType(b);

  var key;

  // if objects has different types they are not equal
  var typeDifferent = typeA.type !== typeB.type || typeA.cls !== typeB.cls;

  if(typeDifferent || ((opts.checkSubType && typeA.sub !== typeB.sub) || !opts.checkSubType)) {
    return result(false, REASON.DIFFERENT_TYPES, typeToString(typeA), typeToString(typeB));
  }

  //early checks for types
  switch(typeA.type) {
    case 'number':
      // NaN !== NaN
      return (a !== a) ? result(b !== b, REASON.NAN_NUMBER)
        : result(a === b, REASON.EQUALITY);

    case 'boolean':
    case 'string':
      return result(a === b, REASON.EQUALITY);

    case 'function':
      // functions are compared by their source code
      r = checkAlso(a.toString(), b.toString());
      if(!r.result) {
        r.reason = REASON.FUNCTION_SOURCES;
        if(!opts.collectAllFails) return r;
      }

      break;//check user properties

    case 'object':
      // additional checks for object instances
      switch(typeA.cls) {
        // check regexp flags
        // TODO add es6 flags
        case 'regexp':
          p = ['source', 'global', 'multiline', 'lastIndex', 'ignoreCase'];
          while(p.length) {
            r = checkPropertyEquality(p.shift());
            if(!r.result && !opts.collectAllFails) return r;
          }
          break;//check user properties

        //check by timestamp only (using .valueOf)
        case 'date':
          if(+a !== +b) {
            r = result(false, REASON.EQUALITY);
            if(!r.result && !opts.collectAllFails) return r;
          }
          break;//check user properties

        //primitive type wrappers
        case 'number':
        case 'boolean':
        case 'string':
          //check their internal value
          r = checkAlso(a.valueOf(), b.valueOf());
          if(!r.result) {
            r.reason = REASON.WRAPPED_VALUE;
            if(!opts.collectAllFails) return r;
          }
          break;//check user properties

        //node buffer
        case 'buffer':
          //if length different it is obviously different
          r = checkPropertyEquality('length');
          if(!r.result && !opts.collectAllFails) return r;

          l = a.length;
          while(l--) {
            r = checkPropertyEquality(l);
            if(!r.result && !opts.collectAllFails) return r;
          }

          //we do not check for user properties because
          //node Buffer have some strange hidden properties
          return EQUALS;

        case 'error':
          //check defined properties
          p = ['name', 'message'];
          while(p.length) {
            r = checkPropertyEquality(p.shift());
            if(!r.result && !opts.collectAllFails) return r;
          }

          break;//check user properties

        case 'array':
        case 'arguments':
        case 'typed-array':
          r = checkPropertyEquality('length');
          if(!r.result && !opts.collectAllFails) return r;

          break;//check user properties

        case 'array-buffer':
          r = checkPropertyEquality('byteLength');
          if(!r.result && !opts.collectAllFails) return r;

          break;//check user properties

        case 'map':
        case 'set':
          r = checkPropertyEquality('size');
          if(!r.result && !opts.collectAllFails) return r;

          stackA.push(a);
          stackB.push(b);

          var itA = a.entries();
          var nextA = itA.next();

          while(!nextA.done) {
            key = nextA.value[0];
            //first check for primitive key if we can do light check
            //using .has and .get
            if(getType(key).type != 'object') {
              if(b.has(key)) {
                if(typeA.cls == 'map') {
                  //for map we also check its value to be equal
                  var value = b.get(key);
                  r = checkAlso(nextA.value[1], value);
                  if(!r.result) {
                    r.a = nextA.value;
                    r.b = value;
                    r.reason = REASON.MAP_VALUE_EQUALITY;

                    if(!opts.collectAllFails) break;
                  }
                }

              } else {
                r = result(false, REASON.SET_MAP_MISSING_KEY);
                r.a = key;
                r.b = key;

                if(!opts.collectAllFails) break;
              }
            } else {
              //heavy check
              //we search by iterator for key equality using equal
              var itB = b.entries();
              var nextB = itB.next();

              while(!nextB.done) {
                //first check for keys
                r = checkAlso(nextA.value[0], nextB.value[0]);

                if(!r.result) {
                  r.reason = REASON.SET_MAP_MISSING_KEY;
                  r.a = key;
                  r.b = key;
                } else {
                  if(typeA.cls == 'map') {
                    r = checkAlso(nextA.value[1], nextB.value[1]);

                    if(!r.result) {
                      r.a = nextA.value;
                      r.b = nextB.value;
                      r.reason = REASON.MAP_VALUE_EQUALITY;
                    }
                  }

                  if(!opts.collectAllFails) break;
                }

                nextB = itB.next();
              }
            }

            if(!r.result && !opts.collectAllFails) break;

            nextA = itA.next();
          }

          stackA.pop();
          stackB.pop();

          if(!r.result) {
            r.reason = REASON.SET_MAP_MISSING_ENTRY;
            if(!opts.collectAllFails) return r;
          }

          break; //check user properties
      }
  }

  // compare deep objects and arrays
  // stacks contain references only
  //

  l = stackA.length;
  while(l--) {
    if(stackA[l] == a) {
      return result(stackB[l] == b, REASON.CIRCULAR_VALUES);
    }
  }

  // add `a` and `b` to the stack of traversed objects
  stackA.push(a);
  stackB.push(b);

  for(key in b) {
    if(hasOwnProperty.call(b, key)) {
      r = result(hasOwnProperty.call(a, key), REASON.MISSING_KEY, 'A', key);
      if(!r.result && !opts.collectAllFails) break;

      if(r.result) {
        r = checkPropertyEquality(key);
        if(!r.result && !opts.collectAllFails) break;
      }
    }
  }

  if(r.result || opts.collectAllFails) {
    // ensure both objects have the same number of properties
    for(key in a) {
      if(hasOwnProperty.call(a, key)) {
        r = result(hasOwnProperty.call(b, key), REASON.MISSING_KEY, 'B', key);
        if(!r.result && !opts.collectAllFails) return r;
      }
    }
  }

  stackA.pop();
  stackB.pop();

  if(!r.result && !opts.collectAllFails) return r;

  var prototypesEquals = false, canComparePrototypes = false;

  if(opts.checkProtoEql) {
    if(Object.getPrototypeOf) {//TODO should i check prototypes for === or use eq?
      prototypesEquals = Object.getPrototypeOf(a) === Object.getPrototypeOf(b);
      canComparePrototypes = true;
    }

    if(canComparePrototypes && !prototypesEquals) {
      r = result(prototypesEquals, REASON.EQUALITY_PROTOTYPE);
      r.showReason = true;
      if(!r.result && !opts.collectAllFails) {
        return r;
      }
    }
  }

  return EQUALS;
}

var defaultOptions = {
  checkProtoEql: true,
  checkSubType: true,
  plusZeroAndMinusZeroEqual: false
};

function eq(a, b, opts) {
  opts = opts || {};
  if(typeof opts.checkProtoEql !== 'boolean') {
    opts.checkProtoEql = defaultOptions.checkProtoEql;
  }
  if(typeof opts.checkSubType !== 'boolean') {
    opts.checkSubType = defaultOptions.checkSubType;
  }
  if(typeof opts.plusZeroAndMinusZeroEqual !== 'boolean') {
    opts.plusZeroAndMinusZeroEqual = defaultOptions.plusZeroAndMinusZeroEqual;
  }

  var fails = [];
  var r = eqInternal(a, b, opts, [], [], [], fails);
  return opts.collectAllFails ? fails : r;
}

module.exports = eq;

eq.r = REASON;

},{"./format":6,"should-type":10}],8:[function(require,module,exports){
var getType = require('should-type');
var util = require('./util');

function genKeysFunc(f) {
  return function(value) {
    var k = f(value);
    k.sort();
    return k;
  };
}


function Formatter(opts) {
  opts = opts || {};

  this.seen = [];
  this.keys = genKeysFunc(opts.keys === false ? Object.getOwnPropertyNames : Object.keys);

  this.maxLineLength = typeof opts.maxLineLength === 'number' ? opts.maxLineLength : 60;
  this.propSep = opts.propSep || ',';

  this.isUTCdate = !!opts.isUTCdate;
}

Formatter.prototype = {
  constructor: Formatter,

  format: function(value) {
    var t = getType(value);
    var name1 = t.type, name2 = t.type;
    if(t.cls) {
      name1 += '_' + t.cls;
      name2 += '_' + t.cls;
    }
    if(t.sub) {
      name2 += '_' + t.sub;
    }
    var f = this['_format_' + name2] || this['_format_' + name1] || this['_format_' + t.type] || this.defaultFormat;
    return f.call(this, value).trim();
  },

  _formatObject: function(value, opts) {
    opts = opts || {};
    var mainKeys = opts.keys || this.keys(value);

    var len = 0;

    var formatPropertyValue = opts.formatPropertyValue || this.formatPropertyValue;
    var formatPropertyName = opts.formatPropertyName || this.formatPropertyName;
    var keyValueSep = opts.keyValueSep || ': ';
    var keyFilter = opts.keyFilter || function() { return true; };

    this.seen.push(value);
    var keys = [];

    mainKeys.forEach(function(key) {
      if(!keyFilter(key)) return;

      var fName = formatPropertyName.call(this, key);

      var f = (fName ? fName + keyValueSep : '') + formatPropertyValue.call(this, value, key);
      len += f.length;
      keys.push(f);
    }, this);
    this.seen.pop();

    (opts.additionalProperties || []).forEach(function(keyValue) {
      var f = keyValue[0] + keyValueSep + this.format(keyValue[1]);
      len += f.length;
      keys.push(f);
    }, this);

    var prefix = opts.prefix || Formatter.constructorName(value) || '';
    if(prefix.length > 0) prefix += ' ';

    var lbracket, rbracket;
    if(Array.isArray(opts.brackets)) {
      lbracket = opts.brackets && opts.brackets[0];
      rbracket = opts.brackets && opts.brackets[1];
    } else {
      lbracket = '{';
      rbracket = '}';
    }

    var rootValue = opts.value || '';

    if(keys.length === 0)
      return rootValue || (prefix + lbracket + rbracket);

    if(len <= this.maxLineLength) {
      return prefix + lbracket + ' ' + (rootValue ? rootValue + ' ' : '') + keys.join(this.propSep + ' ') + ' ' + rbracket;
    } else {
      return prefix + lbracket + '\n' + (rootValue ? '  ' + rootValue + '\n' : '') + keys.map(util.addSpaces).join(this.propSep + '\n') + '\n' + rbracket;
    }
  },

  formatObject: function(value, prefix, props) {
    props = props || this.keys(value);

    var len = 0;

    this.seen.push(value);
    props = props.map(function(prop) {
      var f = this.formatProperty(value, prop);
      len += f.length;
      return f;
    }, this);
    this.seen.pop();

    if(props.length === 0) return '{}';

    if(len <= this.maxLineLength) {
      return '{ ' + (prefix ? prefix + ' ' : '') + props.join(this.propSep + ' ') + ' }';
    } else {
      return '{' + '\n' + (prefix ? '  ' + prefix + '\n' : '') + props.map(util.addSpaces).join(this.propSep + '\n') + '\n' + '}';
    }
  },

  formatPropertyName: function(name) {
    return name.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/) ? name : this.format(name);
  },

  formatProperty: function(value, prop) {
    var desc = Formatter.getPropertyDescriptor(value, prop);

    var propName = this.formatPropertyName(prop);

    var propValue = desc.get && desc.set ?
      '[Getter/Setter]' : desc.get ?
      '[Getter]' : desc.set ?
      '[Setter]' : this.seen.indexOf(desc.value) >= 0 ?
      '[Circular]' :
      this.format(desc.value);

    return propName + ': ' + propValue;
  },

  formatPropertyValue: function(value, prop) {
    var desc = Formatter.getPropertyDescriptor(value, prop);

    var propValue = desc.get && desc.set ?
      '[Getter/Setter]' : desc.get ?
      '[Getter]' : desc.set ?
      '[Setter]' : this.seen.indexOf(desc.value) >= 0 ?
      '[Circular]' :
      this.format(desc.value);

    return propValue;
  }
};

Formatter.add = function add(type, cls, sub, f) {
  var args = Array.prototype.slice.call(arguments);
  f = args.pop();
  Formatter.prototype['_format_' + args.join('_')] = f;
};

Formatter.formatObjectWithPrefix = function formatObjectWithPrefix(f) {
  return function(value) {
    var prefix = f.call(this, value);
    var props = this.keys(value);
    if(props.length == 0) return prefix;
    else return this.formatObject(value, prefix, props);
  };
};

var functionNameRE = /^\s*function\s*(\S*)\s*\(/;

Formatter.functionName = function functionName(f) {
  if(f.name) {
    return f.name;
  }
  var matches = f.toString().match(functionNameRE);
  if (matches === null) {
    // `functionNameRE` doesn't match arrow functions.
    return '';
  }
  var name = matches[1];
  return name;
};

Formatter.constructorName = function(obj) {
  while (obj) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, 'constructor');
    if (descriptor !== undefined &&
        typeof descriptor.value === 'function') {

        var name = Formatter.functionName(descriptor.value);
        if(name !== '') {
          return name;
        }
    }

    obj = Object.getPrototypeOf(obj);
  }
};

Formatter.getPropertyDescriptor = function(obj, value) {
  var desc;
  try {
    desc = Object.getOwnPropertyDescriptor(obj, value) || {value: obj[value]};
  } catch(e) {
    desc = {value: e};
  }
  return desc;
};

Formatter.generateFunctionForIndexedArray = function generateFunctionForIndexedArray(lengthProp, name, padding) {
  return function(value) {
    var max = this.byteArrayMaxLength || 50;
    var length = value[lengthProp];
    var formattedValues = [];
    var len = 0;
    for(var i = 0; i < max && i < length; i++) {
      var b = value[i] || 0;
      var v = util.pad0(b.toString(16), padding);
      len += v.length;
      formattedValues.push(v);
    }
    var prefix = value.constructor.name || name || '';
    if(prefix) prefix += ' ';

    if(formattedValues.length === 0)
      return prefix + '[]';

    if(len <= this.maxLineLength) {
      return prefix + '[ ' + formattedValues.join(this.propSep + ' ') + ' ' + ']';
    } else {
      return prefix + '[\n' + formattedValues.map(util.addSpaces).join(this.propSep + '\n') + '\n' + ']';
    }
  };
};

Formatter.add('undefined', function() { return 'undefined' });
Formatter.add('null', function() { return 'null' });
Formatter.add('boolean', function(value) { return value ? 'true': 'false' });
Formatter.add('symbol', function(value) { return value.toString() });

['number', 'boolean'].forEach(function(name) {
  Formatter.add('object', name, function(value) {
    return this._formatObject(value, {
      additionalProperties: [['[[PrimitiveValue]]', value.valueOf()]]
    });
  });
});

Formatter.add('object', 'string', function(value) {
  var realValue = value.valueOf();

  return this._formatObject(value, {
    keyFilter: function(key) {
      //skip useless indexed properties
      return !(key.match(/\d+/) && parseInt(key, 10) < realValue.length);
    },
    additionalProperties: [['[[PrimitiveValue]]', realValue]]
  });
});

Formatter.add('object', 'regexp', function(value) {
  return this._formatObject(value, {
    value: String(value)
  });
});

Formatter.add('number', function(value) {
  if(value === 0 && 1 / value < 0) return '-0';
  return String(value);
});

Formatter.add('string', function(value) {
  return '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
      .replace(/'/g, "\\'")
      .replace(/\\"/g, '"') + '\'';
});

Formatter.add('object', function(value) {
  return this._formatObject(value);
});

Formatter.add('object', 'arguments', function(value) {
  return this._formatObject(value, {
    prefix: 'Arguments',
    formatPropertyName: function(key) {
      if(!key.match(/\d+/)) {
        return this.formatPropertyName(key);
      }
    },
    brackets: ['[', ']']
  });
});

Formatter.add('object', 'array', function(value) {
  return this._formatObject(value, {
    formatPropertyName: function(key) {
      if(!key.match(/\d+/)) {
        return this.formatPropertyName(key);
      }
    },
    brackets: ['[', ']']
  });
});


function formatDate(value, isUTC) {
  var prefix = isUTC ? 'UTC' : '';

  var date = value['get' + prefix + 'FullYear']() +
    '-' +
    util.pad0(value['get' + prefix + 'Month']() + 1, 2) +
    '-' +
    util.pad0(value['get' + prefix + 'Date'](), 2);

  var time = util.pad0(value['get' + prefix + 'Hours'](), 2) +
    ':' +
    util.pad0(value['get' + prefix + 'Minutes'](), 2) +
    ':' +
    util.pad0(value['get' + prefix + 'Seconds'](), 2) +
    '.' +
    util.pad0(value['get' + prefix + 'Milliseconds'](), 3);

  var to = value.getTimezoneOffset();
  var absTo = Math.abs(to);
  var hours = Math.floor(absTo / 60);
  var minutes = absTo - hours * 60;
  var tzFormat = (to < 0 ? '+' : '-') + util.pad0(hours, 2) + util.pad0(minutes, 2);

  return date + ' ' + time + (isUTC ? '' : ' ' + tzFormat);
}

Formatter.add('object', 'date', function(value) {
  return this._formatObject(value, { value: formatDate(value, this.isUTCdate) });
});

Formatter.add('function', function(value) {
  return this._formatObject(value, {
    additionalProperties: [['name', Formatter.functionName(value)]]
  });
});

Formatter.add('object', 'error', function(value) {
  return this._formatObject(value, {
    prefix: value.name,
    additionalProperties: [['message', value.message]]
  });
});

Formatter.add('object', 'buffer', Formatter.generateFunctionForIndexedArray('length', 'Buffer', 2));

Formatter.add('object', 'array-buffer', Formatter.generateFunctionForIndexedArray('byteLength', 'ArrayBuffer', 2));

Formatter.add('object', 'typed-array', 'int8', Formatter.generateFunctionForIndexedArray('length', 'Int8Array', 2));
Formatter.add('object', 'typed-array', 'uint8', Formatter.generateFunctionForIndexedArray('length', 'Uint8Array', 2));
Formatter.add('object', 'typed-array', 'uint8clamped', Formatter.generateFunctionForIndexedArray('length', 'Uint8ClampedArray', 2));

Formatter.add('object', 'typed-array', 'int16', Formatter.generateFunctionForIndexedArray('length', 'Int16Array', 4));
Formatter.add('object', 'typed-array', 'uint16', Formatter.generateFunctionForIndexedArray('length', 'Uint16Array', 4));

Formatter.add('object', 'typed-array', 'int32', Formatter.generateFunctionForIndexedArray('length', 'Int32Array', 8));
Formatter.add('object', 'typed-array', 'uint32', Formatter.generateFunctionForIndexedArray('length', 'Uint32Array', 8));

//TODO add float32 and float64

Formatter.add('object', 'promise', function() {
  return '[Promise]';//TODO it could be nice to inspect its state and value
});

Formatter.add('object', 'xhr', function() {
  return '[XMLHttpRequest]';//TODO it could be nice to inspect its state
});

Formatter.add('object', 'html-element', function(value) {
  return value.outerHTML;
});

Formatter.add('object', 'html-element', '#text', function(value) {
  return value.nodeValue;
});

Formatter.add('object', 'html-element', '#document', function(value) {
  return value.documentElement.outerHTML;
});

Formatter.add('object', 'host', function() {
  return '[Host]';
});

Formatter.add('object', 'set', function(value) {
  var iter = value.values();
  var len = 0;

  this.seen.push(value);

  var props = [];

  var next = iter.next();
  while(!next.done) {
    var val = next.value;
    var f = this.format(val);
    len += f.length;
    props.push(f);

    next = iter.next();
  }

  this.seen.pop();

  if(props.length === 0) return 'Set {}';

  if(len <= this.maxLineLength) {
    return 'Set { ' + props.join(this.propSep + ' ') + ' }';
  } else {
    return 'Set {\n' + props.map(util.addSpaces).join(this.propSep + '\n') + '\n' + '}';
  }
});

Formatter.add('object', 'map', function(value) {
  var iter = value.entries();
  var len = 0;

  this.seen.push(value);

  var props = [];

  var next = iter.next();
  while(!next.done) {
    var val = next.value;
    var fK = this.format(val[0]);
    var fV = this.format(val[1]);

    var f;
    if((fK.length + fV.length + 4) <= this.maxLineLength) {
      f = fK + ' => ' + fV;
    } else {
      f = fK + ' =>\n' + fV;
    }

    len += fK.length + fV.length + 4;
    props.push(f);

    next = iter.next();
  }

  this.seen.pop();

  if(props.length === 0) return 'Map {}';

  if(len <= this.maxLineLength) {
    return 'Map { ' + props.join(this.propSep + ' ') + ' }';
  } else {
    return 'Map {\n' + props.map(util.addSpaces).join(this.propSep + '\n') + '\n' + '}';
  }
});

Formatter.prototype.defaultFormat = Formatter.prototype._format_object;

function defaultFormat(value, opts) {
  return new Formatter(opts).format(value);
}

defaultFormat.Formatter = Formatter;
module.exports = defaultFormat;

},{"./util":9,"should-type":10}],9:[function(require,module,exports){
function addSpaces(v) {
  return v.split('\n').map(function(vv) { return '  ' + vv; }).join('\n');
}

function pad(str, value, filler) {
  str = String(str)
  var isRight = false;

  if(value < 0) {
    isRight = true;
    value = -value;
  }

  if(str.length < value) {
    var padding = new Array(value - str.length + 1).join(filler);
    return isRight ? str + padding : padding + str;
  } else{
    return str;
  }
}

module.exports = {
  addSpaces: addSpaces,
  pad: pad,
  pad0: function(str, value) {
    return pad(str, value, '0');
  }
};

},{}],10:[function(require,module,exports){
(function (Buffer){
var toString = Object.prototype.toString;

var types = require('./types');

/**
 * Simple data function to store type information
 * @param {string} type Usually what is returned from typeof
 * @param {string} cls  Sanitized @Class via Object.prototype.toString
 * @param {string} sub  If type and cls the same, and need to specify somehow
 * @private
 * @example
 *
 * //for null
 * new Type('null');
 *
 * //for Date
 * new Type('object', 'date');
 *
 * //for Uint8Array
 *
 * new Type('object', 'typed-array', 'uint8');
 */
function Type(type, cls, sub) {
  this.type = type;
  this.cls = cls;
  this.sub = sub;
}

/**
 * Function to store type checks
 * @private
 */
function TypeChecker() {
  this.checks = [];
}

TypeChecker.prototype = {
  add: function(func) {
    this.checks.push(func);
    return this;
  },

  addTypeOf: function(type, res) {
    return this.add(function(obj, tpeOf) {
      if(tpeOf === type) {
        return new Type(res);
      }
    });
  },

  addClass: function(cls, res, sub) {
    return this.add(function(obj, tpeOf, objCls) {
      if(objCls === cls) {
        return new Type(types.OBJECT, res, sub);
      }
    });
  },

  getType: function(obj) {
    var typeOf = typeof obj;
    var cls = toString.call(obj);

    for(var i = 0, l = this.checks.length; i < l; i++) {
      var res = this.checks[i].call(this, obj, typeOf, cls);
      if(typeof res !== 'undefined') return res;
    }

  }
};

var main = new TypeChecker();

//TODO add iterators

main
  .addTypeOf(types.NUMBER, types.NUMBER)
  .addTypeOf(types.UNDEFINED, types.UNDEFINED)
  .addTypeOf(types.STRING, types.STRING)
  .addTypeOf(types.BOOLEAN, types.BOOLEAN)
  .addTypeOf(types.FUNCTION, types.FUNCTION)
  .addTypeOf(types.SYMBOL, types.SYMBOL)
  .add(function(obj, tpeOf) {
    if(obj === null) return new Type(types.NULL);
  })
  .addClass('[object String]', types.STRING)
  .addClass('[object Boolean]', types.BOOLEAN)
  .addClass('[object Number]', types.NUMBER)
  .addClass('[object Array]', types.ARRAY)
  .addClass('[object RegExp]', types.REGEXP)
  .addClass('[object Error]', types.ERROR)
  .addClass('[object Date]', types.DATE)
  .addClass('[object Arguments]', types.ARGUMENTS)
  .addClass('[object Math]')
  .addClass('[object JSON]')
  .addClass('[object ArrayBuffer]', types.ARRAY_BUFFER)
  .addClass('[object Int8Array]', types.TYPED_ARRAY, 'int8')
  .addClass('[object Uint8Array]', types.TYPED_ARRAY, 'uint8')
  .addClass('[object Uint8ClampedArray]', types.TYPED_ARRAY, 'uint8clamped')
  .addClass('[object Int16Array]', types.TYPED_ARRAY, 'int16')
  .addClass('[object Uint16Array]', types.TYPED_ARRAY, 'uint16')
  .addClass('[object Int32Array]', types.TYPED_ARRAY, 'int32')
  .addClass('[object Uint32Array]', types.TYPED_ARRAY, 'uint32')
  .addClass('[object Float32Array]', types.TYPED_ARRAY, 'float32')
  .addClass('[object Float64Array]', types.TYPED_ARRAY, 'float64')
  .addClass('[object DataView]', types.DATA_VIEW)
  .addClass('[object Map]', types.MAP)
  .addClass('[object WeakMap]', types.WEAK_MAP)
  .addClass('[object Set]', types.SET)
  .addClass('[object WeakSet]', types.WEAK_SET)
  .addClass('[object Promise]', types.PROMISE)
  .addClass('[object Blob]', types.BLOB)
  .addClass('[object File]', types.FILE)
  .addClass('[object FileList]', types.FILE_LIST)
  .addClass('[object XMLHttpRequest]', types.XHR)
  .add(function(obj) {
    if((typeof Promise === types.FUNCTION && obj instanceof Promise) ||
        (typeof obj.then === types.FUNCTION)) {
          return new Type(types.OBJECT, types.PROMISE);
        }
  })
  .add(function(obj) {
    if(typeof Buffer !== 'undefined' && obj instanceof Buffer) {
      return new Type(types.OBJECT, types.BUFFER);
    }
  })
  .add(function(obj) {
    if(typeof Node !== 'undefined' && obj instanceof Node) {
      return new Type(types.OBJECT, types.HTML_ELEMENT, obj.nodeName);
    }
  })
  .add(function(obj) {
    // probably at the begginging should be enough these checks
    if(obj.Boolean === Boolean && obj.Number === Number && obj.String === String && obj.Date === Date) {
      return new Type(types.OBJECT, types.HOST);
    }
  })
  .add(function() {
    return new Type(types.OBJECT);
  });

/**
 * Get type information of anything
 *
 * @param  {any} obj Anything that could require type information
 * @return {Type}    type info
 */
function getGlobalType(obj) {
  return main.getType(obj);
}

getGlobalType.checker = main;
getGlobalType.TypeChecker = TypeChecker;
getGlobalType.Type = Type;

Object.keys(types).forEach(function(typeName) {
  getGlobalType[typeName] = types[typeName];
});

module.exports = getGlobalType;

}).call(this,require("buffer").Buffer)
},{"./types":11,"buffer":2}],11:[function(require,module,exports){
var types = {
  NUMBER: 'number',
  UNDEFINED: 'undefined',
  STRING: 'string',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
  FUNCTION: 'function',
  NULL: 'null',
  ARRAY: 'array',
  REGEXP: 'regexp',
  DATE: 'date',
  ERROR: 'error',
  ARGUMENTS: 'arguments',
  SYMBOL: 'symbol',
  ARRAY_BUFFER: 'array-buffer',
  TYPED_ARRAY: 'typed-array',
  DATA_VIEW: 'data-view',
  MAP: 'map',
  SET: 'set',
  WEAK_SET: 'weak-set',
  WEAK_MAP: 'weak-map',
  PROMISE: 'promise',

// node buffer
  BUFFER: 'buffer',

// dom html element
  HTML_ELEMENT: 'html-element',
  HTML_ELEMENT_TEXT: 'html-element-text',
  DOCUMENT: 'document',
  WINDOW: 'window',
  FILE: 'file',
  FILE_LIST: 'file-list',
  BLOB: 'blob',

  HOST: 'host',

  XHR: 'xhr'
};

module.exports = types;

},{}],12:[function(require,module,exports){
var should = require('./lib/should');

var defaultProto = Object.prototype;
var defaultProperty = 'should';

//Expose api via `Object#should`.
try {
  var prevShould = should.extend(defaultProperty, defaultProto);
  should._prevShould = prevShould;
} catch(e) {
  //ignore errors
}

module.exports = should;

},{"./lib/should":29}],13:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('./util');

/**
 * should AssertionError
 * @param {Object} options
 * @constructor
 * @memberOf should
 * @static
 */
var AssertionError = function AssertionError(options) {
  util.merge(this, options);

  if (!options.message) {
    Object.defineProperty(this, 'message', {
        get: function() {
          if (!this._message) {
            this._message = this.generateMessage();
            this.generatedMessage = true;
          }
          return this._message;
        },
        configurable: true,
        enumerable: false
      }
    );
  }

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      if (this.stackStartFunction) {
        // try to strip useless frames
        var fn_name = util.functionName(this.stackStartFunction);
        var idx = out.indexOf('\n' + fn_name);
        if (idx >= 0) {
          // once we have located the function frame
          // we need to strip out everything before it (and its line)
          var next_line = out.indexOf('\n', idx + 1);
          out = out.substring(next_line + 1);
        }
      }

      this.stack = out;
    }
  }
};


var indent = '    ';
function prependIndent(line) {
  return indent + line;
}

function indentLines(text) {
  return text.split('\n').map(prependIndent).join('\n');
}


// assert.AssertionError instanceof Error
AssertionError.prototype = Object.create(Error.prototype, {
  name: {
    value: 'AssertionError'
  },

  generateMessage: {
    value: function() {
      if (!this.operator && this.previous) {
        return this.previous.message;
      }
      var actual = util.format(this.actual);
      var expected = 'expected' in this ? ' ' + util.format(this.expected) : '';
      var details = 'details' in this && this.details ? ' (' + this.details + ')' : '';

      var previous = this.previous ? '\n' + indentLines(this.previous.message) : '';

      return 'expected ' + actual + (this.negate ? ' not ' : ' ') + this.operator + expected + details + previous;
    }
  }
});

module.exports = AssertionError;

},{"./util":30}],14:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var AssertionError = require('./assertion-error');

/**
 * should Assertion
 * @param {*} obj Given object for assertion
 * @constructor
 * @memberOf should
 * @static
 */
function Assertion(obj) {
  this.obj = obj;

  this.anyOne = false;
  this.negate = false;

  this.params = {actual: obj};
}

Assertion.prototype = {
  constructor: Assertion,

  /**
   * Base method for assertions.
   *
   * Before calling this method need to fill Assertion#params object. This method usually called from other assertion methods.
   * `Assertion#params` can contain such properties:
   * * `operator` - required string containing description of this assertion
   * * `obj` - optional replacement for this.obj, it usefull if you prepare more clear object then given
   * * `message` - if this property filled with string any others will be ignored and this one used as assertion message
   * * `expected` - any object used when you need to assert relation between given object and expected. Like given == expected (== is a relation)
   * * `details` - additional string with details to generated message
   *
   * @memberOf Assertion
   * @category assertion
   * @param {*} expr Any expression that will be used as a condition for asserting.
   * @example
   *
   * var a = new should.Assertion(42);
   *
   * a.params = {
   *  operator: 'to be magic number',
   * }
   *
   * a.assert(false);
   * //throws AssertionError: expected 42 to be magic number
   */
  assert: function(expr) {
    if (expr) {
      return this;
    }

    var params = this.params;

    if ('obj' in params && !('actual' in params)) {
      params.actual = params.obj;
    } else if (!('obj' in params) && !('actual' in params)) {
      params.actual = this.obj;
    }

    params.stackStartFunction = params.stackStartFunction || this.assert;
    params.negate = this.negate;

    params.assertion = this;

    throw new AssertionError(params);
  },

  /**
   * Shortcut for `Assertion#assert(false)`.
   *
   * @memberOf Assertion
   * @category assertion
   * @example
   *
   * var a = new should.Assertion(42);
   *
   * a.params = {
   *  operator: 'to be magic number',
   * }
   *
   * a.fail();
   * //throws AssertionError: expected 42 to be magic number
   */
  fail: function() {
    return this.assert(false);
  }
};



/**
 * Assertion used to delegate calls of Assertion methods inside of Promise.
 * It has almost all methods of Assertion.prototype
 *
 * @param {Promise} obj
 */
function PromisedAssertion(/* obj */) {
  Assertion.apply(this, arguments);
}

/**
 * Make PromisedAssertion to look like promise. Delegate resolve and reject to given promise.
 *
 * @private
 * @returns {Promise}
 */
PromisedAssertion.prototype.then = function(resolve, reject) {
  return this.obj.then(resolve, reject);
};

/**
 * Way to extend Assertion function. It uses some logic
 * to define only positive assertions and itself rule with negative assertion.
 *
 * All actions happen in subcontext and this method take care about negation.
 * Potentially we can add some more modifiers that does not depends from state of assertion.
 *
 * @memberOf Assertion
 * @static
 * @param {String} name Name of assertion. It will be used for defining method or getter on Assertion.prototype
 * @param {Function} func Function that will be called on executing assertion
 * @example
 *
 * Assertion.add('asset', function() {
 *      this.params = { operator: 'to be asset' }
 *
 *      this.obj.should.have.property('id').which.is.a.Number()
 *      this.obj.should.have.property('path')
 * })
 */
Assertion.add = function(name, func) {
  Object.defineProperty(Assertion.prototype, name, {
    enumerable: true,
    configurable: true,
    value: function() {
      var context = new Assertion(this.obj, this, name);
      context.anyOne = this.anyOne;

      try {
        func.apply(context, arguments);
      } catch (e) {
        // check for fail
        if (e instanceof AssertionError) {
          // negative fail
          if (this.negate) {
            this.obj = context.obj;
            this.negate = false;
            return this;
          }

          if (context !== e.assertion) {
            context.params.previous = e;
          }

          // positive fail
          context.negate = false;
          context.fail();
        }
        // throw if it is another exception
        throw e;
      }

      // negative pass
      if (this.negate) {
        context.negate = true; // because .fail will set negate
        context.params.details = 'false negative fail';
        context.fail();
      }

      // positive pass
      if (!this.params.operator) {
        this.params = context.params; // shortcut
      }
      this.obj = context.obj;
      this.negate = false;
      return this;
    }
  });

  Object.defineProperty(PromisedAssertion.prototype, name, {
    enumerable: true,
    configurable: true,
    value: function() {
      var args = arguments;
      this.obj = this.obj.then(function(a) {
        return a[name].apply(a, args);
      });

      return this;
    }
  });
};

/**
 * Add chaining getter to Assertion like .a, .which etc
 *
 * @memberOf Assertion
 * @static
 * @param  {string} name   name of getter
 * @param  {function} [onCall] optional function to call
 */
Assertion.addChain = function(name, onCall) {
  onCall = onCall || function() {};
  Object.defineProperty(Assertion.prototype, name, {
    get: function() {
      onCall.call(this);
      return this;
    },
    enumerable: true
  });

  Object.defineProperty(PromisedAssertion.prototype, name, {
    enumerable: true,
    configurable: true,
    get: function() {
      this.obj = this.obj.then(function(a) {
        return a[name];
      });

      return this;
    }
  });
};

/**
 * Create alias for some `Assertion` property
 *
 * @memberOf Assertion
 * @static
 * @param {String} from Name of to map
 * @param {String} to Name of alias
 * @example
 *
 * Assertion.alias('true', 'True')
 */
Assertion.alias = function(from, to) {
  var desc = Object.getOwnPropertyDescriptor(Assertion.prototype, from);
  if (!desc) throw new Error('Alias ' + from + ' -> ' + to + ' could not be created as ' + from + ' not defined');
  Object.defineProperty(Assertion.prototype, to, desc);

  var desc2 = Object.getOwnPropertyDescriptor(PromisedAssertion.prototype, from);
  if (desc2) {
    Object.defineProperty(PromisedAssertion.prototype, to, desc2);
  }
};
/**
 * Negation modifier. Current assertion chain become negated. Each call invert negation on current assertion.
 *
 * @name not
 * @property
 * @memberOf Assertion
 * @category assertion
 */
Assertion.addChain('not', function() {
  this.negate = !this.negate;
});

/**
 * Any modifier - it affect on execution of sequenced assertion to do not `check all`, but `check any of`.
 *
 * @name any
 * @property
 * @memberOf Assertion
 * @category assertion
 */
Assertion.addChain('any', function() {
  this.anyOne = true;
});

module.exports = Assertion;
module.exports.PromisedAssertion = PromisedAssertion;

},{"./assertion-error":13}],15:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var Formatter = require('should-format').Formatter;

var config = {
  checkProtoEql: false,

  getFormatter: function(opts) {
    return new Formatter(opts || config);
  }
};

module.exports = config;

},{"should-format":8}],16:[function(require,module,exports){
// implement assert interface using already written peaces of should.js

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var Assertion = require('./../assertion');

var _deepEqual = require('should-equal');

var pSlice = Array.prototype.slice;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.
/**
 * Node.js standard [`assert.fail`](http://nodejs.org/api/assert.html#assert_assert_fail_actual_expected_message_operator).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual Actual object
 * @param {*} expected Expected object
 * @param {string} message Message for assertion
 * @param {string} operator Operator text
 */
function fail(actual, expected, message, operator, stackStartFunction) {
  var a = new Assertion(actual);
  a.params = {
    operator: operator,
    expected: expected,
    message: message,
    stackStartFunction: stackStartFunction || fail
  };

  a.fail();
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.
/**
 * Node.js standard [`assert.ok`](http://nodejs.org/api/assert.html#assert_assert_value_message_assert_ok_value_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} value
 * @param {string} [message]
 */
function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

/**
 * Node.js standard [`assert.equal`](http://nodejs.org/api/assert.html#assert_assert_equal_actual_expected_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);
/**
 * Node.js standard [`assert.notEqual`](http://nodejs.org/api/assert.html#assert_assert_notequal_actual_expected_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);
/**
 * Node.js standard [`assert.deepEqual`](http://nodejs.org/api/assert.html#assert_assert_deepequal_actual_expected_message).
 * But uses should.js .eql implementation instead of Node.js own deepEqual.
 *
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected).result) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};


// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);
/**
 * Node.js standard [`assert.notDeepEqual`](http://nodejs.org/api/assert.html#assert_assert_notdeepequal_actual_expected_message).
 * But uses should.js .eql implementation instead of Node.js own deepEqual.
 *
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected).result) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);
/**
 * Node.js standard [`assert.strictEqual`](http://nodejs.org/api/assert.html#assert_assert_strictequal_actual_expected_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
/**
 * Node.js standard [`assert.notStrictEqual`](http://nodejs.org/api/assert.html#assert_assert_notstrictequal_actual_expected_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof expected == 'string') {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ')' : '.') +
  (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected && !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);
/**
 * Node.js standard [`assert.throws`](http://nodejs.org/api/assert.html#assert_assert_throws_block_error_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {Function} block
 * @param {Function} [error]
 * @param {String} [message]
 */
assert.throws = function(/*block, error, message*/) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
/**
 * Node.js standard [`assert.doesNotThrow`](http://nodejs.org/api/assert.html#assert_assert_doesnotthrow_block_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {Function} block
 * @param {String} [message]
 */
assert.doesNotThrow = function(/*block, message*/) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

/**
 * Node.js standard [`assert.ifError`](http://nodejs.org/api/assert.html#assert_assert_iferror_value).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {Error} err
 */
assert.ifError = function(err) {
  if (err) {
    throw err;
  }
};

},{"./../assertion":14,"should-equal":7}],17:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');
var assert = require('./_assert');
var AssertionError = require('../assertion-error');

module.exports = function(should) {
  var i = should.format;

  /*
   * Expose assert to should
   *
   * This allows you to do things like below
   * without require()ing the assert module.
   *
   *    should.equal(foo.bar, undefined);
   *
   */
  util.merge(should, assert);

  /**
   * Assert _obj_ exists, with optional message.
   *
   * @static
   * @memberOf should
   * @category assertion assert
   * @alias should.exists
   * @param {*} obj
   * @param {String} [msg]
   * @example
   *
   * should.exist(1);
   * should.exist(new Date());
   */
  should.exist = should.exists = function(obj, msg) {
    if (null == obj) {
      throw new AssertionError({
        message: msg || ('expected ' + i(obj) + ' to exist'), stackStartFunction: should.exist
      });
    }
  };

  should.not = {};
  /**
   * Asserts _obj_ does not exist, with optional message.
   *
   * @name not.exist
   * @static
   * @memberOf should
   * @category assertion assert
   * @alias should.not.exists
   * @param {*} obj
   * @param {String} [msg]
   * @example
   *
   * should.not.exist(null);
   * should.not.exist(void 0);
   */
  should.not.exist = should.not.exists = function(obj, msg) {
    if (null != obj) {
      throw new AssertionError({
        message: msg || ('expected ' + i(obj) + ' to not exist'), stackStartFunction: should.not.exist
      });
    }
  };
};

},{"../assertion-error":13,"../util":30,"./_assert":16}],18:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {
  /**
   * Assert given object is exactly `true`.
   *
   * @name true
   * @memberOf Assertion
   * @category assertion bool
   * @alias Assertion#True
   * @param {string} [message] Optional message
   * @example
   *
   * (true).should.be.true();
   * false.should.not.be.true();
   *
   * ({ a: 10}).should.not.be.true();
   */
  Assertion.add('true', function(message) {
    this.is.exactly(true, message);
  });

  Assertion.alias('true', 'True');

  /**
   * Assert given object is exactly `false`.
   *
   * @name false
   * @memberOf Assertion
   * @category assertion bool
   * @alias Assertion#False
   * @param {string} [message] Optional message
   * @example
   *
   * (true).should.not.be.false();
   * false.should.be.false();
   */
  Assertion.add('false', function(message) {
    this.is.exactly(false, message);
  });

  Assertion.alias('false', 'False');

  /**
   * Assert given object is thuthy according javascript type conversions.
   *
   * @name ok
   * @memberOf Assertion
   * @category assertion bool
   * @example
   *
   * (true).should.be.ok();
   * ''.should.not.be.ok();
   * should(null).not.be.ok();
   * should(void 0).not.be.ok();
   *
   * (10).should.be.ok();
   * (0).should.not.be.ok();
   */
  Assertion.add('ok', function() {
    this.params = { operator: 'to be truthy' };

    this.assert(this.obj);
  });
};

},{}],19:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {
  /**
   * Simple chaining. It actually do nothing.
   *
   * @memberOf Assertion
   * @name be
   * @property {should.Assertion} be
   * @alias Assertion#an
   * @alias Assertion#of
   * @alias Assertion#a
   * @alias Assertion#and
   * @alias Assertion#have
   * @alias Assertion#has
   * @alias Assertion#with
   * @alias Assertion#is
   * @alias Assertion#which
   * @alias Assertion#the
   * @alias Assertion#it
   * @category assertion chaining
   */
  ['an', 'of', 'a', 'and', 'be', 'has', 'have', 'with', 'is', 'which', 'the', 'it'].forEach(function(name) {
    Assertion.addChain(name);
  });
};

},{}],20:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');
var eql = require('should-equal');

module.exports = function(should, Assertion) {
  var i = should.format;

  /**
   * Assert that given object contain something that equal to `other`. It uses `should-equal` for equality checks.
   * If given object is array it search that one of elements was equal to `other`.
   * If given object is string it checks if `other` is a substring - expected that `other` is a string.
   * If given object is Object it checks that `other` is a subobject - expected that `other` is a object.
   *
   * @name containEql
   * @memberOf Assertion
   * @category assertion contain
   * @param {*} other Nested object
   * @example
   *
   * [1, 2, 3].should.containEql(1);
   * [{ a: 1 }, 'a', 10].should.containEql({ a: 1 });
   *
   * 'abc'.should.containEql('b');
   * 'ab1c'.should.containEql(1);
   *
   * ({ a: 10, c: { d: 10 }}).should.containEql({ a: 10 });
   * ({ a: 10, c: { d: 10 }}).should.containEql({ c: { d: 10 }});
   * ({ a: 10, c: { d: 10 }}).should.containEql({ b: 10 });
   * // throws AssertionError: expected { a: 10, c: { d: 10 } } to contain { b: 10 }
   * //            expected { a: 10, c: { d: 10 } } to have property b
   */
  Assertion.add('containEql', function(other) {
    this.params = {operator: 'to contain ' + i(other)};

    this.is.not.null().and.not.undefined();

    var obj = this.obj;

    if (typeof obj == 'string') {
      this.assert(obj.indexOf(String(other)) >= 0);
    } else if (util.isIndexable(obj)) {
      this.assert(util.some(obj, function(v) {
        return eql(v, other).result;
      }));
    } else {
      this.have.properties(other);
    }
  });

  /**
   * Assert that given object is contain equally structured object on the same depth level.
   * If given object is an array and `other` is an array it checks that the eql elements is going in the same sequence in given array (recursive)
   * If given object is an object it checks that the same keys contain deep equal values (recursive)
   * On other cases it try to check with `.eql`
   *
   * @name containDeepOrdered
   * @memberOf Assertion
   * @category assertion contain
   * @param {*} other Nested object
   * @example
   *
   * [ 1, 2, 3].should.containDeepOrdered([1, 2]);
   * [ 1, 2, [ 1, 2, 3 ]].should.containDeepOrdered([ 1, [ 2, 3 ]]);
   *
   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({a: 10});
   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({b: {c: 10}});
   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({b: {d: [1, 3]}});
   */
  Assertion.add('containDeepOrdered', function(other) {
    this.params = {operator: 'to contain ' + i(other)};

    var obj = this.obj;
    if (typeof obj == 'string') {// expect other to be string
      this.is.equal(String(other));
    } else if (util.isIndexable(obj) && util.isIndexable(other)) {
      for (var objIdx = 0, otherIdx = 0, objLength = util.length(obj), otherLength = util.length(other); objIdx < objLength && otherIdx < otherLength; objIdx++) {
        try {
          should(obj[objIdx]).containDeepOrdered(other[otherIdx]);
          otherIdx++;
        } catch (e) {
          if (e instanceof should.AssertionError) {
            continue;
          }
          throw e;
        }
      }

      this.assert(otherIdx === otherLength);
    } else if (obj != null && other != null && typeof obj == 'object' && typeof other == 'object') {// object contains object case
      util.forEach(other, function(value, key) {
        should(obj[key]).containDeepOrdered(value);
      });

      // if both objects is empty means we finish traversing - and we need to compare for hidden values
      if (util.isEmptyObject(other)) {
        this.eql(other);
      }
    } else {
      this.eql(other);
    }
  });

  /**
   * The same like `Assertion#containDeepOrdered` but all checks on arrays without order.
   *
   * @name containDeep
   * @memberOf Assertion
   * @category assertion contain
   * @param {*} other Nested object
   * @example
   *
   * [ 1, 2, 3].should.containDeep([2, 1]);
   * [ 1, 2, [ 1, 2, 3 ]].should.containDeep([ 1, [ 3, 1 ]]);
   */
  Assertion.add('containDeep', function(other) {
    this.params = {operator: 'to contain ' + i(other)};

    var obj = this.obj;
    if (typeof obj == 'string') {// expect other to be string
      this.is.equal(String(other));
    } else if (util.isIndexable(obj) && util.isIndexable(other)) {
      var usedKeys = {};
      util.forEach(other, function(otherItem) {
        this.assert(util.some(obj, function(item, index) {
          if (index in usedKeys) return false;

          try {
            should(item).containDeep(otherItem);
            usedKeys[index] = true;
            return true;
          } catch (e) {
            if (e instanceof should.AssertionError) {
              return false;
            }
            throw e;
          }
        }));
      }, this);
    } else if (obj != null && other != null && typeof obj == 'object' && typeof other == 'object') {// object contains object case
      util.forEach(other, function(value, key) {
        should(obj[key]).containDeep(value);
      });

      // if both objects is empty means we finish traversing - and we need to compare for hidden values
      if (util.isEmptyObject(other)) {
        this.eql(other);
      }
    } else {
      this.eql(other);
    }
  });

};

},{"../util":30,"should-equal":7}],21:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var eql = require('should-equal');
var type = require('should-type');
var util = require('../util');

function formatEqlResult(r, a, b) {
  return ((r.path.length > 0 ? 'at ' + r.path.map(util.formatProp).join(' -> ') : '') +
  (r.a === a ? '' : ', A has ' + util.format(r.a)) +
  (r.b === b ? '' : ' and B has ' + util.format(r.b)) +
  (r.showReason ? ' because ' + r.reason : '')).trim();
}

module.exports = function(should, Assertion) {

  /**
   * Deep object equality comparison. For full spec see [`should-equal tests`](https://github.com/shouldjs/equal/blob/master/test.js).
   *
   * @name eql
   * @memberOf Assertion
   * @category assertion equality
   * @alias Assertion#deepEqual
   * @param {*} val Expected value
   * @param {string} [description] Optional message
   * @example
   *
   * (10).should.be.eql(10);
   * ('10').should.not.be.eql(10);
   * (-0).should.not.be.eql(+0);
   *
   * NaN.should.be.eql(NaN);
   *
   * ({ a: 10}).should.be.eql({ a: 10 });
   * [ 'a' ].should.not.be.eql({ '0': 'a' });
   */
  Assertion.add('eql', function(val, description) {
    this.params = {operator: 'to equal', expected: val, message: description};

    var result = eql(this.obj, val, should.config);
    this.params.details = result.result ? '' : formatEqlResult(result, this.obj, val);

    this.params.showDiff = eql(type(this.obj), type(val)).result;

    this.assert(result.result);
  });

  /**
   * Exact comparison using ===.
   *
   * @name equal
   * @memberOf Assertion
   * @category assertion equality
   * @alias Assertion#exactly
   * @param {*} val Expected value
   * @param {string} [description] Optional message
   * @example
   *
   * 10.should.be.equal(10);
   * 'a'.should.be.exactly('a');
   *
   * should(null).be.exactly(null);
   */
  Assertion.add('equal', function(val, description) {
    this.params = {operator: 'to be', expected: val, message: description};

    this.params.showDiff = eql(type(this.obj), type(val)).result;

    this.assert(val === this.obj);
  });

  Assertion.alias('equal', 'exactly');
  Assertion.alias('eql', 'deepEqual');

  function addOneOf(name, message, method) {
    Assertion.add(name, function(vals) {
      if (arguments.length !== 1) {
        vals = Array.prototype.slice.call(arguments);
      } else {
        should(vals).be.Array();
      }

      this.params = {operator: message, expected: vals};

      var obj = this.obj;
      var found = false;

      util.forEach(vals, function(val) {
        try {
          should(val)[method](obj);
          found = true;
          return false;
        } catch (e) {
          if (e instanceof should.AssertionError) {
            return;//do nothing
          }
          throw e;
        }
      });

      this.assert(found);
    });
  }

  /**
   * Exact comparison using === to be one of supplied objects.
   *
   * @name equalOneOf
   * @memberOf Assertion
   * @category assertion equality
   * @param {Array|*} vals Expected values
   * @example
   *
   * 'ab'.should.be.equalOneOf('a', 10, 'ab');
   * 'ab'.should.be.equalOneOf(['a', 10, 'ab']);
   */
  addOneOf('equalOneOf', 'to be equals one of', 'equal');

  /**
   * Exact comparison using .eql to be one of supplied objects.
   *
   * @name oneOf
   * @memberOf Assertion
   * @category assertion equality
   * @param {Array|*} vals Expected values
   * @example
   *
   * ({a: 10}).should.be.oneOf('a', 10, 'ab', {a: 10});
   * ({a: 10}).should.be.oneOf(['a', 10, 'ab', {a: 10}]);
   */
  addOneOf('oneOf', 'to be one of', 'eql');

};

},{"../util":30,"should-equal":7,"should-type":10}],22:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */
var util = require('../util');

module.exports = function(should, Assertion) {
  var i = should.format;

  /**
   * Assert given function throws error with such message.
   *
   * @name throw
   * @memberOf Assertion
   * @category assertion errors
   * @alias Assertion#throwError
   * @param {string|RegExp|Function|Object|GeneratorFunction|GeneratorObject} [message] Message to match or properties
   * @param {Object} [properties] Optional properties that will be matched to thrown error
   * @example
   *
   * (function(){ throw new Error('fail') }).should.throw();
   * (function(){ throw new Error('fail') }).should.throw('fail');
   * (function(){ throw new Error('fail') }).should.throw(/fail/);
   *
   * (function(){ throw new Error('fail') }).should.throw(Error);
   * var error = new Error();
   * error.a = 10;
   * (function(){ throw error; }).should.throw(Error, { a: 10 });
   * (function(){ throw error; }).should.throw({ a: 10 });
   * (function*() {
   *   yield throwError();
   * }).should.throw();
   */
  Assertion.add('throw', function(message, properties) {
    var fn = this.obj;
    var err = {};
    var errorInfo = '';
    var thrown = false;

    if (util.isGeneratorFunction(fn)) {
      return should(fn()).throw(message, properties);
    } else if (util.isGeneratorObject(fn)) {
      return should(fn.next.bind(fn)).throw(message, properties);
    }

    this.is.a.Function();

    var errorMatched = true;

    try {
      fn();
    } catch (e) {
      thrown = true;
      err = e;
    }

    if (thrown) {
      if (message) {
        if ('string' == typeof message) {
          errorMatched = message == err.message;
        } else if (message instanceof RegExp) {
          errorMatched = message.test(err.message);
        } else if ('function' == typeof message) {
          errorMatched = err instanceof message;
        } else if (null != message) {
          try {
            should(err).match(message);
          } catch (e) {
            if (e instanceof should.AssertionError) {
              errorInfo = ": " + e.message;
              errorMatched = false;
            } else {
              throw e;
            }
          }
        }

        if (!errorMatched) {
          if ('string' == typeof message || message instanceof RegExp) {
            errorInfo = " with a message matching " + i(message) + ", but got '" + err.message + "'";
          } else if ('function' == typeof message) {
            errorInfo = " of type " + util.functionName(message) + ", but got " + util.functionName(err.constructor);
          }
        } else if ('function' == typeof message && properties) {
          try {
            should(err).match(properties);
          } catch (e) {
            if (e instanceof should.AssertionError) {
              errorInfo = ": " + e.message;
              errorMatched = false;
            } else {
              throw e;
            }
          }
        }
      } else {
        errorInfo = " (got " + i(err) + ")";
      }
    }

    this.params = { operator: 'to throw exception' + errorInfo };

    this.assert(thrown);
    this.assert(errorMatched);
  });

  Assertion.alias('throw', 'throwError');
};

},{"../util":30}],23:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');
var eql = require('should-equal');

module.exports = function(should, Assertion) {
  var i = should.format;

  /**
   * Asserts if given object match `other` object, using some assumptions:
   * First object matched if they are equal,
   * If `other` is a regexp and given object is a string check on matching with regexp
   * If `other` is a regexp and given object is an array check if all elements matched regexp
   * If `other` is a regexp and given object is an object check values on matching regexp
   * If `other` is a function check if this function throws AssertionError on given object or return false - it will be assumed as not matched
   * If `other` is an object check if the same keys matched with above rules
   * All other cases failed.
   *
   * Usually it is right idea to add pre type assertions, like `.String()` or `.Object()` to be sure assertions will do what you are expecting.
   * Object iteration happen by keys (properties with enumerable: true), thus some objects can cause small pain. Typical example is js
   * Error - it by default has 2 properties `name` and `message`, but they both non-enumerable. In this case make sure you specify checking props (see examples).
   *
   * @name match
   * @memberOf Assertion
   * @category assertion matching
   * @param {*} other Object to match
   * @param {string} [description] Optional message
   * @example
   * 'foobar'.should.match(/^foo/);
   * 'foobar'.should.not.match(/^bar/);
   *
   * ({ a: 'foo', c: 'barfoo' }).should.match(/foo$/);
   *
   * ['a', 'b', 'c'].should.match(/[a-z]/);
   *
   * (5).should.not.match(function(n) {
   *   return n < 0;
   * });
   * (5).should.not.match(function(it) {
   *    it.should.be.an.Array();
   * });
   * ({ a: 10, b: 'abc', c: { d: 10 }, d: 0 }).should
   * .match({ a: 10, b: /c$/, c: function(it) {
   *    return it.should.have.property('d', 10);
   * }});
   *
   * [10, 'abc', { d: 10 }, 0].should
   * .match({ '0': 10, '1': /c$/, '2': function(it) {
   *    return it.should.have.property('d', 10);
   * }});
   *
   * var myString = 'abc';
   *
   * myString.should.be.a.String().and.match(/abc/);
   *
   * myString = {};
   *
   * myString.should.match(/abc/); //yes this will pass
   * //better to do
   * myString.should.be.an.Object().and.not.empty().and.match(/abc/);//fixed
   *
   * (new Error('boom')).should.match(/abc/);//passed because no keys
   * (new Error('boom')).should.not.match({ message: /abc/ });//check specified property
   */
  Assertion.add('match', function(other, description) {
    this.params = {operator: 'to match ' + i(other), message: description};

    if (!eql(this.obj, other).result) {
      if (other instanceof RegExp) { // something - regex

        if (typeof this.obj == 'string') {

          this.assert(other.exec(this.obj));
        } else if (util.isIndexable(this.obj)) {
          util.forEach(this.obj, function(item) {
            this.assert(other.exec(item));// should we try to convert to String and exec?
          }, this);
        } else if (null != this.obj && typeof this.obj == 'object') {

          var notMatchedProps = [], matchedProps = [];
          util.forEach(this.obj, function(value, name) {
            if (other.exec(value)) matchedProps.push(util.formatProp(name));
            else notMatchedProps.push(util.formatProp(name) + ' (' + i(value) + ')');
          }, this);

          if (notMatchedProps.length)
            this.params.operator += '\n    not matched properties: ' + notMatchedProps.join(', ');
          if (matchedProps.length)
            this.params.operator += '\n    matched properties: ' + matchedProps.join(', ');

          this.assert(notMatchedProps.length === 0);
        } // should we try to convert to String and exec?
      } else if (typeof other == 'function') {
        var res;

        res = other(this.obj);

        //if(res instanceof Assertion) {
        //  this.params.operator += '\n    ' + res.getMessage();
        //}

        //if we throw exception ok - it is used .should inside
        if (typeof res == 'boolean') {
          this.assert(res); // if it is just boolean function assert on it
        }
      } else if (other != null && this.obj != null && typeof other == 'object' && typeof this.obj == 'object') { // try to match properties (for Object and Array)
        notMatchedProps = [];
        matchedProps = [];

        util.forEach(other, function(value, key) {
          try {
            should(this.obj).have.property(key).which.match(value);
            matchedProps.push(util.formatProp(key));
          } catch (e) {
            if (e instanceof should.AssertionError) {
              notMatchedProps.push(util.formatProp(key) + ' (' + i(this.obj[key]) + ')');
            } else {
              throw e;
            }
          }
        }, this);

        if (notMatchedProps.length)
          this.params.operator += '\n    not matched properties: ' + notMatchedProps.join(', ');
        if (matchedProps.length)
          this.params.operator += '\n    matched properties: ' + matchedProps.join(', ');

        this.assert(notMatchedProps.length === 0);
      } else {
        this.assert(false);
      }
    }
  });

  /**
   * Asserts if given object values or array elements all match `other` object, using some assumptions:
   * First object matched if they are equal,
   * If `other` is a regexp - matching with regexp
   * If `other` is a function check if this function throws AssertionError on given object or return false - it will be assumed as not matched
   * All other cases check if this `other` equal to each element
   *
   * @name matchEach
   * @memberOf Assertion
   * @category assertion matching
   * @alias Assertion#matchEvery
   * @param {*} other Object to match
   * @param {string} [description] Optional message
   * @example
   * [ 'a', 'b', 'c'].should.matchEach(/\w+/);
   * [ 'a', 'a', 'a'].should.matchEach('a');
   *
   * [ 'a', 'a', 'a'].should.matchEach(function(value) { value.should.be.eql('a') });
   *
   * { a: 'a', b: 'a', c: 'a' }.should.matchEach(function(value) { value.should.be.eql('a') });
   */
  Assertion.add('matchEach', function(other, description) {
    this.params = {operator: 'to match each ' + i(other), message: description};

    util.forEach(this.obj, function(value) {
      should(value).match(other);
    }, this);
  });

  /**
  * Asserts if any of given object values or array elements match `other` object, using some assumptions:
  * First object matched if they are equal,
  * If `other` is a regexp - matching with regexp
  * If `other` is a function check if this function throws AssertionError on given object or return false - it will be assumed as not matched
  * All other cases check if this `other` equal to each element
  *
  * @name matchAny
  * @memberOf Assertion
  * @category assertion matching
  * @param {*} other Object to match
  * @alias Assertion#matchSome
  * @param {string} [description] Optional message
  * @example
  * [ 'a', 'b', 'c'].should.matchAny(/\w+/);
  * [ 'a', 'b', 'c'].should.matchAny('a');
  *
  * [ 'a', 'b', 'c'].should.matchAny(function(value) { value.should.be.eql('a') });
  *
  * { a: 'a', b: 'b', c: 'c' }.should.matchAny(function(value) { value.should.be.eql('a') });
  */
  Assertion.add('matchAny', function(other, description) {
    this.params = {operator: 'to match any ' + i(other), message: description};

    this.assert(util.some(this.obj, function(value) {
      try {
        should(value).match(other);
        return true;
      } catch (e) {
        if (e instanceof should.AssertionError) {
          // Caught an AssertionError, return false to the iterator
          return false;
        }
        throw e;
      }
    }));
  });

  Assertion.alias('matchAny', 'matchSome');
  Assertion.alias('matchEach', 'matchEvery');
};

},{"../util":30,"should-equal":7}],24:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {

  /**
   * Assert given object is NaN
   * @name NaN
   * @memberOf Assertion
   * @category assertion numbers
   * @example
   *
   * (10).should.not.be.NaN();
   * NaN.should.be.NaN();
   */
  Assertion.add('NaN', function() {
    this.params = { operator: 'to be NaN' };

    this.assert(this.obj !== this.obj);
  });

  /**
   * Assert given object is not finite (positive or negative)
   *
   * @name Infinity
   * @memberOf Assertion
   * @category assertion numbers
   * @example
   *
   * (10).should.not.be.Infinity();
   * NaN.should.not.be.Infinity();
   */
  Assertion.add('Infinity', function() {
    this.params = { operator: 'to be Infinity' };

    this.is.a.Number()
      .and.not.a.NaN()
      .and.assert(!isFinite(this.obj));
  });

  /**
   * Assert given number between `start` and `finish` or equal one of them.
   *
   * @name within
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} start Start number
   * @param {number} finish Finish number
   * @param {string} [description] Optional message
   * @example
   *
   * (10).should.be.within(0, 20);
   */
  Assertion.add('within', function(start, finish, description) {
    this.params = { operator: 'to be within ' + start + '..' + finish, message: description };

    this.assert(this.obj >= start && this.obj <= finish);
  });

  /**
   * Assert given number near some other `value` within `delta`
   *
   * @name approximately
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} value Center number
   * @param {number} delta Radius
   * @param {string} [description] Optional message
   * @example
   *
   * (9.99).should.be.approximately(10, 0.1);
   */
  Assertion.add('approximately', function(value, delta, description) {
    this.params = { operator: 'to be approximately ' + value + ' ±' + delta, message: description };

    this.assert(Math.abs(this.obj - value) <= delta);
  });

  /**
   * Assert given number above `n`.
   *
   * @name above
   * @alias Assertion#greaterThan
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} n Margin number
   * @param {string} [description] Optional message
   * @example
   *
   * (10).should.be.above(0);
   */
  Assertion.add('above', function(n, description) {
    this.params = { operator: 'to be above ' + n, message: description };

    this.assert(this.obj > n);
  });

  /**
   * Assert given number below `n`.
   *
   * @name below
   * @alias Assertion#lessThan
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} n Margin number
   * @param {string} [description] Optional message
   * @example
   *
   * (0).should.be.below(10);
   */
  Assertion.add('below', function(n, description) {
    this.params = { operator: 'to be below ' + n, message: description };

    this.assert(this.obj < n);
  });

  Assertion.alias('above', 'greaterThan');
  Assertion.alias('below', 'lessThan');

  /**
   * Assert given number above `n`.
   *
   * @name aboveOrEqual
   * @alias Assertion#greaterThanOrEqual
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} n Margin number
   * @param {string} [description] Optional message
   * @example
   *
   * (10).should.be.aboveOrEqual(0);
   * (10).should.be.aboveOrEqual(10);
   */
  Assertion.add('aboveOrEqual', function(n, description) {
    this.params = { operator: 'to be above or equal' + n, message: description };

    this.assert(this.obj >= n);
  });

  /**
   * Assert given number below `n`.
   *
   * @name belowOrEqual
   * @alias Assertion#lessThanOrEqual
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} n Margin number
   * @param {string} [description] Optional message
   * @example
   *
   * (0).should.be.belowOrEqual(10);
   * (0).should.be.belowOrEqual(0);
   */
  Assertion.add('belowOrEqual', function(n, description) {
    this.params = { operator: 'to be below or equal' + n, message: description };

    this.assert(this.obj <= n);
  });

  Assertion.alias('aboveOrEqual', 'greaterThanOrEqual');
  Assertion.alias('belowOrEqual', 'lessThanOrEqual');

};

},{}],25:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');
var PromisedAssertion = require('../assertion').PromisedAssertion;
var Assertion = require('../assertion');

module.exports = function(should) {
  /**
   * Assert given object is a Promise
   *
   * @name Promise
   * @memberOf Assertion
   * @category assertion promises
   * @example
   *
   * promise.should.be.Promise()
   * (new Promise(function(resolve, reject) { resolve(10); })).should.be.a.Promise()
   * (10).should.not.be.a.Promise()
   */
  Assertion.add('Promise', function() {
    this.params = {operator: 'to be promise'};

    var obj = this.obj;

    should(obj).have.property('then')
      .which.is.a.Function();
  });

  /**
   * Assert given promise will be fulfilled. Result of assertion is still .thenable and should be handled accordingly.
   *
   * @name fulfilled
   * @memberOf Assertion
   * @returns {Promise}
   * @category assertion promises
   * @example
   *
   * // don't forget to handle async nature
   * (new Promise(function(resolve, reject) { resolve(10); })).should.be.fulfilled();
   *
   * // test example with mocha it is possible to return promise
   * it('is async', () => {
   *    return new Promise(resolve => resolve(10))
   *      .should.be.fulfilled();
   * });
   */
  Assertion.prototype.fulfilled = function Assertion$fulfilled() {
    this.params = {operator: 'to be fulfilled'};

    should(this.obj).be.a.Promise();

    var that = this;
    return this.obj.then(function next$onResolve(value) {
      if (that.negate) {
        that.fail();
      }
      return value;
    }, function next$onReject(err) {
      if (!that.negate) {
        that.params.operator += ', but it was rejected with ' + should.format(err);
        that.fail();
      }
      return err;
    });
  };

  /**
   * Assert given promise will be rejected. Result of assertion is still .thenable and should be handled accordingly.
   *
   * @name rejected
   * @memberOf Assertion
   * @category assertion promises
   * @returns {Promise}
   * @example
   *
   * // don't forget to handle async nature
   * (new Promise(function(resolve, reject) { resolve(10); }))
   *    .should.not.be.rejected();
   *
   * // test example with mocha it is possible to return promise
   * it('is async', () => {
   *    return new Promise((resolve, reject) => reject(new Error('boom')))
   *      .should.be.rejected();
   * });
   */
  Assertion.prototype.rejected = function() {
    this.params = {operator: 'to be rejected'};

    should(this.obj).be.a.Promise();

    var that = this;
    return this.obj.then(function(value) {
      if (!that.negate) {
        that.params.operator += ', but it was fulfilled';
        if (arguments.length != 0) {
          that.params.operator += ' with ' + should.format(value);
        }
        that.fail();
      }
      return value;
    }, function next$onError(err) {
      if (that.negate) {
        that.fail();
      }
      return err;
    });
  };

  /**
   * Assert given promise will be fulfilled with some expected value (value compared using .eql).
   * Result of assertion is still .thenable and should be handled accordingly.
   *
   * @name fulfilledWith
   * @memberOf Assertion
   * @category assertion promises
   * @returns {Promise}
   * @example
   *
   * // don't forget to handle async nature
   * (new Promise(function(resolve, reject) { resolve(10); }))
   *    .should.be.fulfilledWith(10);
   *
   * // test example with mocha it is possible to return promise
   * it('is async', () => {
   *    return new Promise((resolve, reject) => resolve(10))
   *       .should.be.fulfilledWith(10);
   * });
   */
  Assertion.prototype.fulfilledWith = function(expectedValue) {
    this.params = {operator: 'to be fulfilled with ' + should.format(expectedValue)};

    should(this.obj).be.a.Promise();

    var that = this;
    return this.obj.then(function(value) {
      if (that.negate) {
        that.fail();
      }
      should(value).eql(expectedValue);
      return value;
    }, function next$onError(err) {
      if (!that.negate) {
        that.params.operator += ', but it was rejected with ' + should.format(err);
        that.fail();
      }
      return err;
    });
  };

  /**
   * Assert given promise will be rejected with some sort of error. Arguments is the same for Assertion#throw.
   * Result of assertion is still .thenable and should be handled accordingly.
   *
   * @name rejectedWith
   * @memberOf Assertion
   * @category assertion promises
   * @returns {Promise}
   * @example
   *
   * function failedPromise() {
   *   return new Promise(function(resolve, reject) {
   *     reject(new Error('boom'))
   *   })
   * }
   * failedPromise().should.be.rejectedWith(Error);
   * failedPromise().should.be.rejectedWith('boom');
   * failedPromise().should.be.rejectedWith(/boom/);
   * failedPromise().should.be.rejectedWith(Error, { message: 'boom' });
   * failedPromise().should.be.rejectedWith({ message: 'boom' });
   *
   * // test example with mocha it is possible to return promise
   * it('is async', () => {
   *    return failedPromise().should.be.rejectedWith({ message: 'boom' });
   * });
   */
  Assertion.prototype.rejectedWith = function(message, properties) {
    this.params = {operator: 'to be rejected'};

    should(this.obj).be.a.Promise();

    var that = this;
    return this.obj.then(function(value) {
      if (!that.negate) {
        that.fail();
      }
      return value;
    }, function next$onError(err) {
      if (that.negate) {
        that.fail();
      }

      var errorMatched = true;
      var errorInfo = '';

      if ('string' === typeof message) {
        errorMatched = message === err.message;
      } else if (message instanceof RegExp) {
        errorMatched = message.test(err.message);
      } else if ('function' === typeof message) {
        errorMatched = err instanceof message;
      } else if (message !== null && typeof message === 'object') {
        try {
          should(err).match(message);
        } catch (e) {
          if (e instanceof should.AssertionError) {
            errorInfo = ': ' + e.message;
            errorMatched = false;
          } else {
            throw e;
          }
        }
      }

      if (!errorMatched) {
        if ( typeof message === 'string' || message instanceof RegExp) {
          errorInfo = ' with a message matching ' + should.format(message) + ", but got '" + err.message + "'";
        } else if ('function' === typeof message) {
          errorInfo = ' of type ' + util.functionName(message) + ', but got ' + util.functionName(err.constructor);
        }
      } else if ('function' === typeof message && properties) {
        try {
          should(err).match(properties);
        } catch (e) {
          if (e instanceof should.AssertionError) {
            errorInfo = ': ' + e.message;
            errorMatched = false;
          } else {
            throw e;
          }
        }
      }

      that.params.operator += errorInfo;

      that.assert(errorMatched);

      return err;
    });
  };

  /**
   * Assert given object is promise and wrap it in PromisedAssertion, which has all properties of Assertion.
   * That means you can chain as with usual Assertion.
   * Result of assertion is still .thenable and should be handled accordingly.
   *
   * @name finally
   * @memberOf Assertion
   * @alias Assertion#eventually
   * @category assertion promises
   * @returns {PromisedAssertion} Like Assertion, but .then this.obj in Assertion
   * @example
   *
   * (new Promise(function(resolve, reject) { resolve(10); }))
   *    .should.be.eventually.equal(10);
   *
   * // test example with mocha it is possible to return promise
   * it('is async', () => {
   *    return new Promise(resolve => resolve(10))
   *      .should.be.finally.equal(10);
   * });
   */
  Object.defineProperty(Assertion.prototype, 'finally', {
    get: function() {
      should(this.obj).be.a.Promise();

      var that = this;

      return new PromisedAssertion(this.obj.then(function(obj) {
        var a = should(obj);

        a.negate = that.negate;
        a.anyOne = that.anyOne;

        return a;
      }));
    }
  });

  Assertion.alias('finally', 'eventually');
};

},{"../assertion":14,"../util":30}],26:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');
var eql = require('should-equal');

var aSlice = Array.prototype.slice;

module.exports = function(should, Assertion) {
  var i = should.format;
  /**
   * Asserts given object has some descriptor. **On success it change given object to be value of property**.
   *
   * @name propertyWithDescriptor
   * @memberOf Assertion
   * @category assertion property
   * @param {string} name Name of property
   * @param {Object} desc Descriptor like used in Object.defineProperty (not required to add all properties)
   * @example
   *
   * ({ a: 10 }).should.have.propertyWithDescriptor('a', { enumerable: true });
   */
  Assertion.add('propertyWithDescriptor', function(name, desc) {
    this.params = {actual: this.obj, operator: 'to have own property with descriptor ' + i(desc)};
    var obj = this.obj;
    this.have.ownProperty(name);
    should(Object.getOwnPropertyDescriptor(Object(obj), name)).have.properties(desc);
  });

  function processPropsArgs() {
    var args = {};
    if (arguments.length > 1) {
      args.names = aSlice.call(arguments);
    } else {
      var arg = arguments[0];
      if (typeof arg === 'string') {
        args.names = [arg];
      } else if (util.isIndexable(arg)) {
        args.names = arg;
      } else {
        args.names = Object.keys(arg);
        args.values = arg;
      }
    }
    return args;
  }


  /**
   * Asserts given object has enumerable property with optionally value. **On success it change given object to be value of property**.
   *
   * @name enumerable
   * @memberOf Assertion
   * @category assertion property
   * @param {string} name Name of property
   * @param {*} [val] Optional property value to check
   * @example
   *
   * ({ a: 10 }).should.have.enumerable('a');
   */
  Assertion.add('enumerable', function(name, val) {
    name = util.convertPropertyName(name);

    this.params = {
      operator: "to have enumerable property " + util.formatProp(name) + (arguments.length > 1 ? " equal to " + i(val): "")
    };

    var desc = { enumerable: true };
    if (arguments.length > 1) desc.value = val;
    this.have.propertyWithDescriptor(name, desc);
  });

  /**
   * Asserts given object has enumerable properties
   *
   * @name enumerables
   * @memberOf Assertion
   * @category assertion property
   * @param {Array|...string|Object} names Names of property
   * @example
   *
   * ({ a: 10, b: 10 }).should.have.enumerables('a');
   */
  Assertion.add('enumerables', function(/*names*/) {
    var args = processPropsArgs.apply(null, arguments);

    this.params = {
      operator: "to have enumerables " + args.names.map(util.formatProp)
    };

    var obj = this.obj;
    args.names.forEach(function(name) {
      should(obj).have.enumerable(name);
    });
  });

  /**
   * Asserts given object has property with optionally value. **On success it change given object to be value of property**.
   *
   * @name property
   * @memberOf Assertion
   * @category assertion property
   * @param {string} name Name of property
   * @param {*} [val] Optional property value to check
   * @example
   *
   * ({ a: 10 }).should.have.property('a');
   */
  Assertion.add('property', function(name, val) {
    name = util.convertPropertyName(name);
    if (arguments.length > 1) {
      var p = {};
      p[name] = val;
      this.have.properties(p);
    } else {
      this.have.properties(name);
    }
    this.obj = this.obj[name];
  });

  /**
   * Asserts given object has properties. On this method affect .any modifier, which allow to check not all properties.
   *
   * @name properties
   * @memberOf Assertion
   * @category assertion property
   * @param {Array|...string|Object} names Names of property
   * @example
   *
   * ({ a: 10 }).should.have.properties('a');
   * ({ a: 10, b: 20 }).should.have.properties([ 'a' ]);
   * ({ a: 10, b: 20 }).should.have.properties({ b: 20 });
   */
  Assertion.add('properties', function(names) {
    var values = {};
    if (arguments.length > 1) {
      names = aSlice.call(arguments);
    } else if (!Array.isArray(names)) {
      if (typeof names == 'string' || typeof names == 'symbol') {
        names = [names];
      } else {
        values = names;
        names = Object.keys(names);
      }
    }

    var obj = Object(this.obj), missingProperties = [];

    //just enumerate properties and check if they all present
    names.forEach(function(name) {
      if (!(name in obj)) missingProperties.push(util.formatProp(name));
    });

    var props = missingProperties;
    if (props.length === 0) {
      props = names.map(util.formatProp);
    } else if (this.anyOne) {
      props = names.filter(function(name) {
        return missingProperties.indexOf(util.formatProp(name)) < 0;
      }).map(util.formatProp);
    }

    var operator = (props.length === 1 ?
        'to have property ' : 'to have ' + (this.anyOne ? 'any of ' : '') + 'properties ') + props.join(', ');

    this.params = {obj: this.obj, operator: operator};

    //check that all properties presented
    //or if we request one of them that at least one them presented
    this.assert(missingProperties.length === 0 || (this.anyOne && missingProperties.length != names.length));

    // check if values in object matched expected
    var valueCheckNames = Object.keys(values);
    if (valueCheckNames.length) {
      var wrongValues = [];
      props = [];

      // now check values, as there we have all properties
      valueCheckNames.forEach(function(name) {
        var value = values[name];
        if (!eql(obj[name], value).result) {
          wrongValues.push(util.formatProp(name) + ' of ' + i(value) + ' (got ' + i(obj[name]) + ')');
        } else {
          props.push(util.formatProp(name) + ' of ' + i(value));
        }
      });

      if ((wrongValues.length !== 0 && !this.anyOne) || (this.anyOne && props.length === 0)) {
        props = wrongValues;
      }

      operator = (props.length === 1 ?
        'to have property ' : 'to have ' + (this.anyOne ? 'any of ' : '') + 'properties ') + props.join(', ');

      this.params = {obj: this.obj, operator: operator};

      //if there is no not matched values
      //or there is at least one matched
      this.assert(wrongValues.length === 0 || (this.anyOne && wrongValues.length != valueCheckNames.length));
    }
  });

  /**
   * Asserts given object has property `length` with given value `n`
   *
   * @name length
   * @alias Assertion#lengthOf
   * @memberOf Assertion
   * @category assertion property
   * @param {number} n Expected length
   * @param {string} [description] Optional message
   * @example
   *
   * [1, 2].should.have.length(2);
   */
  Assertion.add('length', function(n, description) {
    this.have.property('length', n, description);
  });

  Assertion.alias('length', 'lengthOf');

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  /**
   * Asserts given object has own property. **On success it change given object to be value of property**.
   *
   * @name ownProperty
   * @alias Assertion#hasOwnProperty
   * @memberOf Assertion
   * @category assertion property
   * @param {string} name Name of property
   * @param {string} [description] Optional message
   * @example
   *
   * ({ a: 10 }).should.have.ownProperty('a');
   */
  Assertion.add('ownProperty', function(name, description) {
    name = util.convertPropertyName(name);
    this.params = {
      actual: this.obj,
      operator: 'to have own property ' + util.formatProp(name),
      message: description
    };

    this.assert(hasOwnProperty.call(this.obj, name));

    this.obj = this.obj[name];
  });

  Assertion.alias('ownProperty', 'hasOwnProperty');

  /**
   * Asserts given object is empty. For strings, arrays and arguments it checks .length property, for objects it checks keys.
   *
   * @name empty
   * @memberOf Assertion
   * @category assertion property
   * @example
   *
   * ''.should.be.empty();
   * [].should.be.empty();
   * ({}).should.be.empty();
   */
  Assertion.add('empty', function() {
    this.params = {operator: 'to be empty'};

    if (util.length(this.obj) !== void 0) {
      should(this.obj).have.property('length', 0);
    } else {
      var obj = Object(this.obj); // wrap to reference for booleans and numbers
      for (var prop in obj) {
        should(this.obj).not.have.ownProperty(prop);
      }
    }
  }, true);

  /**
   * Asserts given object has exact keys. Compared to `properties`, `keys` does not accept Object as a argument.
   *
   * @name keys
   * @alias Assertion#key
   * @memberOf Assertion
   * @category assertion property
   * @param {Array|...string} [keys] Keys to check
   * @example
   *
   * ({ a: 10 }).should.have.keys('a');
   * ({ a: 10, b: 20 }).should.have.keys('a', 'b');
   * ({ a: 10, b: 20 }).should.have.keys([ 'a', 'b' ]);
   * ({}).should.have.keys();
   */
  Assertion.add('keys', function(keys) {
    if (arguments.length > 1) keys = aSlice.call(arguments);
    else if (arguments.length === 1 && typeof keys === 'string') keys = [keys];
    else if (arguments.length === 0) keys = [];

    keys = keys.map(String);

    var obj = Object(this.obj);

    // first check if some keys are missing
    var missingKeys = [];
    keys.forEach(function(key) {
      if (!hasOwnProperty.call(this.obj, key))
        missingKeys.push(util.formatProp(key));
    }, this);

    // second check for extra keys
    var extraKeys = [];
    Object.keys(obj).forEach(function(key) {
      if (keys.indexOf(key) < 0) {
        extraKeys.push(util.formatProp(key));
      }
    });

    var verb = keys.length === 0 ? 'to be empty' :
    'to have ' + (keys.length === 1 ? 'key ' : 'keys ');

    this.params = {operator: verb + keys.map(util.formatProp).join(', ')};

    if (missingKeys.length > 0)
      this.params.operator += '\n\tmissing keys: ' + missingKeys.join(', ');

    if (extraKeys.length > 0)
      this.params.operator += '\n\textra keys: ' + extraKeys.join(', ');

    this.assert(missingKeys.length === 0 && extraKeys.length === 0);
  });

  Assertion.alias("keys", "key");

  /**
   * Asserts given object has nested property in depth by path. **On success it change given object to be value of final property**.
   *
   * @name propertyByPath
   * @memberOf Assertion
   * @category assertion property
   * @param {Array|...string} properties Properties path to search
   * @example
   *
   * ({ a: {b: 10}}).should.have.propertyByPath('a', 'b').eql(10);
   */
  Assertion.add('propertyByPath', function(properties) {
    if (arguments.length > 1) properties = aSlice.call(arguments);
    else if (arguments.length === 1 && typeof properties == 'string') properties = [properties];
    else if (arguments.length === 0) properties = [];

    var allProps = properties.map(util.formatProp);

    properties = properties.map(String);

    var obj = should(Object(this.obj));

    var foundProperties = [];

    var currentProperty;
    while (properties.length) {
      currentProperty = properties.shift();
      this.params = {operator: 'to have property by path ' + allProps.join(', ') + ' - failed on ' + util.formatProp(currentProperty)};
      obj = obj.have.property(currentProperty);
      foundProperties.push(currentProperty);
    }

    this.params = {obj: this.obj, operator: 'to have property by path ' + allProps.join(', ')};

    this.obj = obj.obj;
  });
};

},{"../util":30,"should-equal":7}],27:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {
  /**
   * Assert given string starts with prefix
   * @name startWith
   * @memberOf Assertion
   * @category assertion strings
   * @param {string} str Prefix
   * @param {string} [description] Optional message
   * @example
   *
   * 'abc'.should.startWith('a');
   */
  Assertion.add('startWith', function(str, description) {
    this.params = { operator: 'to start with ' + should.format(str), message: description };

    this.assert(0 === this.obj.indexOf(str));
  });

  /**
   * Assert given string ends with prefix
   * @name endWith
   * @memberOf Assertion
   * @category assertion strings
   * @param {string} str Prefix
   * @param {string} [description] Optional message
   * @example
   *
   * 'abca'.should.endWith('a');
   */
  Assertion.add('endWith', function(str, description) {
    this.params = { operator: 'to end with ' + should.format(str), message: description };

    this.assert(this.obj.indexOf(str, this.obj.length - str.length) >= 0);
  });
};

},{}],28:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');

module.exports = function(should, Assertion) {
  /**
   * Assert given object is number
   * @name Number
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Number', function() {
    this.params = {operator: 'to be a number'};

    this.have.type('number');
  });

  /**
   * Assert given object is arguments
   * @name arguments
   * @alias Assertion#Arguments
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('arguments', function() {
    this.params = {operator: 'to be arguments'};

    this.have.class('Arguments');
  });

  Assertion.alias('arguments', 'Arguments');

  /**
   * Assert given object has some type using `typeof`
   * @name type
   * @memberOf Assertion
   * @param {string} type Type name
   * @param {string} [description] Optional message
   * @category assertion types
   */
  Assertion.add('type', function(type, description) {
    this.params = {operator: 'to have type ' + type, message: description};

    should(typeof this.obj).be.exactly(type);
  });

  /**
   * Assert given object is instance of `constructor`
   * @name instanceof
   * @alias Assertion#instanceOf
   * @memberOf Assertion
   * @param {Function} constructor Constructor function
   * @param {string} [description] Optional message
   * @category assertion types
   */
  Assertion.add('instanceof', function(constructor, description) {
    this.params = {operator: 'to be an instance of ' + util.functionName(constructor), message: description};

    this.assert(Object(this.obj) instanceof constructor);
  });

  Assertion.alias('instanceof', 'instanceOf');

  /**
   * Assert given object is function
   * @name Function
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Function', function() {
    this.params = {operator: 'to be a function'};

    this.have.type('function');
  });

  /**
   * Assert given object is object
   * @name Object
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Object', function() {
    this.params = {operator: 'to be an object'};

    this.is.not.null().and.have.type('object');
  });

  /**
   * Assert given object is string
   * @name String
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('String', function() {
    this.params = {operator: 'to be a string'};

    this.have.type('string');
  });

  /**
   * Assert given object is array
   * @name Array
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Array', function() {
    this.params = {operator: 'to be an array'};

    this.have.class('Array');
  });

  /**
   * Assert given object is boolean
   * @name Boolean
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Boolean', function() {
    this.params = {operator: 'to be a boolean'};

    this.have.type('boolean');
  });

  /**
   * Assert given object is error
   * @name Error
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Error', function() {
    this.params = {operator: 'to be an error'};

    this.have.instanceOf(Error);
  });

  /**
   * Assert given object is a date
   * @name Date
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Date', function() {
    this.params = {operator: 'to be a date'};

    this.have.instanceOf(Date);
  });

  /**
   * Assert given object is null
   * @name null
   * @alias Assertion#Null
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('null', function() {
    this.params = {operator: 'to be null'};

    this.assert(this.obj === null);
  });

  Assertion.alias('null', 'Null');

  /**
   * Assert given object has some internal [[Class]], via Object.prototype.toString call
   * @name class
   * @alias Assertion#Class
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('class', function(cls) {
    this.params = {operator: 'to have [[Class]] ' + cls};

    this.assert(Object.prototype.toString.call(this.obj) === '[object ' + cls + ']');
  });

  Assertion.alias('class', 'Class');

  /**
   * Assert given object is undefined
   * @name undefined
   * @alias Assertion#Undefined
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('undefined', function() {
    this.params = {operator: 'to be undefined'};

    this.assert(this.obj === void 0);
  });

  Assertion.alias('undefined', 'Undefined');

  /**
   * Assert given object supports es6 iterable protocol (just check
   * that object has property Symbol.iterator, which is a function)
   * @name iterable
   * @memberOf Assertion
   * @category assertion es6
   */
  Assertion.add('iterable', function() {
    this.params = {operator: 'to be iterable'};

    should(this.obj).have.property(Symbol.iterator).which.is.a.Function();
  });

  /**
   * Assert given object supports es6 iterator protocol (just check
   * that object has property next, which is a function)
   * @name iterator
   * @memberOf Assertion
   * @category assertion es6
   */
  Assertion.add('iterator', function() {
    this.params = {operator: 'to be iterator'};

    should(this.obj).have.property('next').which.is.a.Function();
  });

  /**
   * Assert given object is a generator object
   * @name generator
   * @memberOf Assertion
   * @category assertion es6
   */
  Assertion.add('generator', function() {
    this.params = {operator: 'to be generator'};

    should(this.obj).be.iterable
      .and.iterator
      .and.it.is.equal(this.obj[Symbol.iterator]());
  });
};

},{"../util":30}],29:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */


var util = require('./util');

/**
 * Our function should
 *
 * @param {*} obj Object to assert
 * @returns {should.Assertion} Returns new Assertion for beginning assertion chain
 * @example
 *
 * var should = require('should');
 * should('abc').be.a.String();
 */
function should(obj) {
  return (new should.Assertion(obj));
}

should.AssertionError = require('./assertion-error');
should.Assertion = require('./assertion');

should.format = util.format;
should.type = require('should-type');
should.util = util;

/**
 * Object with configuration.
 * It contains such properties:
 * * `checkProtoEql` boolean - Affect if `.eql` will check objects prototypes
 * * `plusZeroAndMinusZeroEqual` boolean - Affect if `.eql` will treat +0 and -0 as equal
 * Also it can contain options for should-format.
 *
 * @type {Object}
 * @memberOf should
 * @static
 * @example
 *
 * var a = { a: 10 }, b = Object.create(null);
 * b.a = 10;
 *
 * a.should.be.eql(b);
 * //not throws
 *
 * should.config.checkProtoEql = true;
 * a.should.be.eql(b);
 * //throws AssertionError: expected { a: 10 } to equal { a: 10 } (because A and B have different prototypes)
 */
should.config = require('./config');

// Expose should to external world.
exports = module.exports = should;

/**
 * Allow to extend given prototype with should property using given name. This getter will **unwrap** all standard wrappers like `Number`, `Boolean`, `String`.
 * Using `should(obj)` is the equivalent of using `obj.should` with known issues (like nulls and method calls etc).
 *
 * To add new assertions, need to use Assertion.add method.
 *
 * @param {string} [propertyName] Name of property to add. Default is `'should'`.
 * @param {Object} [proto] Prototype to extend with. Default is `Object.prototype`.
 * @memberOf should
 * @returns {{ name: string, descriptor: Object, proto: Object }} Descriptor enough to return all back
 * @static
 * @example
 *
 * var prev = should.extend('must', Object.prototype);
 *
 * 'abc'.must.startWith('a');
 *
 * var should = should.noConflict(prev);
 * should.not.exist(Object.prototype.must);
 */
should.extend = function(propertyName, proto) {
  propertyName = propertyName || 'should';
  proto = proto || Object.prototype;

  var prevDescriptor = Object.getOwnPropertyDescriptor(proto, propertyName);

  Object.defineProperty(proto, propertyName, {
    set: function() {
    },
    get: function() {
      return should(util.isWrapperType(this) ? this.valueOf() : this);
    },
    configurable: true
  });

  return { name: propertyName, descriptor: prevDescriptor, proto: proto };
};

/**
 * Delete previous extension. If `desc` missing it will remove default extension.
 *
 * @param {{ name: string, descriptor: Object, proto: Object }} [desc] Returned from `should.extend` object
 * @memberOf should
 * @returns {Function} Returns should function
 * @static
 * @example
 *
 * var should = require('should').noConflict();
 *
 * should(Object.prototype).not.have.property('should');
 *
 * var prev = should.extend('must', Object.prototype);
 * 'abc'.must.startWith('a');
 * should.noConflict(prev);
 *
 * should(Object.prototype).not.have.property('must');
 */
should.noConflict = function(desc) {
  desc = desc || should._prevShould;

  if (desc) {
    delete desc.proto[desc.name];

    if (desc.descriptor) {
      Object.defineProperty(desc.proto, desc.name, desc.descriptor);
    }
  }
  return should;
};

/**
 * Simple utility function for a bit more easier should assertion extension
 * @param {Function} f So called plugin function. It should accept 2 arguments: `should` function and `Assertion` constructor
 * @memberOf should
 * @returns {Function} Returns `should` function
 * @static
 * @example
 *
 * should.use(function(should, Assertion) {
 *   Assertion.add('asset', function() {
 *      this.params = { operator: 'to be asset' };
 *
 *      this.obj.should.have.property('id').which.is.a.Number();
 *      this.obj.should.have.property('path');
 *  })
 * })
 */
should.use = function(f) {
  f(should, should.Assertion);
  return this;
};

should
  .use(require('./ext/assert'))
  .use(require('./ext/chain'))
  .use(require('./ext/bool'))
  .use(require('./ext/number'))
  .use(require('./ext/eql'))
  .use(require('./ext/type'))
  .use(require('./ext/string'))
  .use(require('./ext/property'))
  .use(require('./ext/error'))
  .use(require('./ext/match'))
  .use(require('./ext/contain'))
  .use(require('./ext/promise'));

},{"./assertion":14,"./assertion-error":13,"./config":15,"./ext/assert":17,"./ext/bool":18,"./ext/chain":19,"./ext/contain":20,"./ext/eql":21,"./ext/error":22,"./ext/match":23,"./ext/number":24,"./ext/promise":25,"./ext/property":26,"./ext/string":27,"./ext/type":28,"./util":30,"should-type":10}],30:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var type = require('should-type');
var config = require('./config');

/**
 * Check if given obj just a primitive type wrapper
 * @param {Object} obj
 * @returns {boolean}
 * @private
 */
exports.isWrapperType = function(obj) {
  return obj instanceof Number || obj instanceof String || obj instanceof Boolean;
};

exports.merge = function(a, b) {
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

exports.forEach = function forEach(obj, f, context) {
  if (exports.isGeneratorFunction(obj)) {
    return forEach(obj(), f, context);
  } else if (exports.isGeneratorObject(obj)) {
    var value = obj.next();
    while (!value.done) {
      if (f.call(context, value.value, 'value', obj) === false)
        return;
      value = obj.next();
    }
  } else {
    for (var prop in obj) {
      if (hasOwnProperty.call(obj, prop)) {
        if (f.call(context, obj[prop], prop, obj) === false)
          return;
      }
    }
  }
};

exports.some = function(obj, f, context) {
  var res = false;
  exports.forEach(obj, function(value, key) {
    if (f.call(context, value, key, obj)) {
      res = true;
      return false;
    }
  }, context);
  return res;
};

exports.isEmptyObject = function(obj) {
  for (var prop in obj) {
    if (hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
};

exports.isIndexable = function(obj) {
  var t = type(obj);
  return (t.type === type.OBJECT && t.cls === type.ARRAY) ||
   (t.type === type.OBJECT && t.cls === type.BUFFER) ||
   (t.type === type.OBJECT && t.cls === type.ARGUMENTS) ||
   (t.type === type.OBJECT && t.cls === type.ARRAY_BUFFER) ||
   (t.type === type.OBJECT && t.cls === type.TYPED_ARRAY) ||
   (t.type === type.OBJECT && t.cls === type.DATA_VIEW) ||
   (t.type === type.OBJECT && t.cls === type.STRING) ||
   (t.type === type.STRING);
};

exports.length = function(obj) {
  var t = type(obj);
  switch (t.type) {
    case type.STRING:
      return obj.length;
    case type.OBJECT:
      switch (t.cls) {
        case type.ARRAY_BUFFER:
        case type.TYPED_ARRAY:
        case type.DATA_VIEW:
          return obj.byteLength;

        case type.ARRAY:
        case type.BUFFER:
        case type.ARGUMENTS:
        case type.FUNCTION:
          return obj.length;
      }
  }
};

exports.convertPropertyName = function(name) {
  if (typeof name == 'symbol') {
    return name;
  } else {
    return String(name);
  }
};

exports.isGeneratorObject = function(obj) {
  if (!obj) return false;

  return typeof obj.next == 'function' &&
          typeof obj[Symbol.iterator] == 'function' &&
          obj[Symbol.iterator]() === obj;
};

//TODO find better way
exports.isGeneratorFunction = function(f) {
  if (typeof f != 'function') return false;

  return /^function\s*\*\s*/.test(f.toString());
};

exports.format = function(value, opts) {
  return config.getFormatter(opts).format(value);
};

exports.functionName = require('should-format').Formatter.functionName;

exports.formatProp = function(value) {
  return config.getFormatter().formatPropertyName(String(value));
};

},{"./config":15,"should-format":8,"should-type":10}],31:[function(require,module,exports){
/**
 * @license MIT <Gianluca Casati> http://g14n.info/flow-view
 */

var windowFunctions = require('../functions/window')
var fun = require('../fun')

function funBrowser (graph) {
  var additionalFunctions = arguments[1] || {}

  function inject (key) {
    additionalFunctions[key] = windowFunctions[key]
  }

  Object.keys(windowFunctions).forEach(inject)

  return fun(graph, additionalFunctions)
}

exports.fun = funBrowser

},{"../fun":33,"../functions/window":35}],32:[function(require,module,exports){
module.exports={
  "data": {},
  "pipe": {},
  "task": {},
  "view": {
    "node": {},
    "link": {}
  }
}

},{}],33:[function(require,module,exports){
var builtinFunctions = require('./functions/builtin')
var injectAdditionalFunctions = require('./inject/additionalFunctions')
var injectArguments = require('./inject/arguments')
var injectAccessors = require('./inject/accessors')
var injectDotOperators = require('./inject/dotOperators')
var injectGlobals = require('./inject/globals')
var injectNumbers = require('./inject/numbers')
var injectReferences = require('./inject/references')
var injectStrings = require('./inject/strings')
var inputArgs = require('./inputArgs')
var isDflowFun = require('./isDflowFun')
var level = require('./level')
var notDefined = require('not-defined')
var regexArgument = require('./regex/argument')
var regexComment = require('./regex/comment')
var regexSubgraph = require('./regex/subgraph')
var reservedKeys = require('./reservedKeys')
var validate = require('./validate')
var walkGlobal = require('./walkGlobal')

var defined = function (x) { return !notDefined(x) }

/**
 * Create a dflow function.
 *
 * @param {Object} graph to be executed
 * @param {Object} [additionalFunctions] is a collection of functions
 *
 * @returns {Function} dflowFun that executes the given graph.
 */

function fun (graph, additionalFunctions) {
  // First of all, check if graph is valid.
  try {
    validate(graph, additionalFunctions)
  } catch (err) {
    throw err
  }

  var func = graph.func || {}
  var pipe = graph.pipe
  var task = graph.task

  var cachedLevelOf = {}
  var computeLevelOf = level.bind(null, pipe, cachedLevelOf)
  var funcs = builtinFunctions

  // Inject compile-time builtin tasks.

  funcs['dflow.fun'] = fun
  funcs['dflow.isDflowFun'] = isDflowFun
  funcs['dflow.validate'] = validate

  injectAccessors(funcs, graph)
  injectAdditionalFunctions(funcs, additionalFunctions)
  injectDotOperators(funcs, task)
  injectGlobals(funcs, task)
  injectReferences(funcs, task)
  injectNumbers(funcs, task)
  injectStrings(funcs, task)

  /**
   * Compiles a sub graph.
   */

  function compileSubgraph (key) {
    var subGraph = graph.func[key]

    var funcName = '/' + key

    funcs[funcName] = fun(subGraph, additionalFunctions)
  }

  /**
   * Sorts tasks by their level.
   */

  function byLevel (a, b) {
    if (typeof cachedLevelOf[a] === 'undefined') {
      cachedLevelOf[a] = computeLevelOf(a)
    }

    if (typeof cachedLevelOf[b] === 'undefined') {
      cachedLevelOf[b] = computeLevelOf(b)
    }

    return cachedLevelOf[a] - cachedLevelOf[b]
  }

  /**
   * Ignores comments.
   */

  function comments (key) {
    return !regexComment.test(task[key])
  }

  // Compile each subgraph.
  Object.keys(func)
        .forEach(compileSubgraph)

  /**
   * Throw if a task is not defined.
   */

  function checkTaskIsDefined (taskKey) {
    var taskName = task[taskKey]

    // Ignore tasks injected at run time.
    if (reservedKeys.indexOf(taskName) > -1) return

    var msg = 'Task not found: ' + taskName + ' [' + taskKey + ']'

    // Check subgraphs.
    if (regexSubgraph.test(taskName)) {
      var subgraphKey = taskName.substring(1)

      if (notDefined(graph.func[subgraphKey])) throw new Error(msg)
      else return
    }

    // Skip arguments[0] ... arguments[N].
    if (regexArgument.exec(taskName)) return

    // Skip globals.
    if (defined(walkGlobal(taskName))) return

    if (notDefined(funcs[taskName])) throw new Error(msg)
  }

  // Check if there is some missing task.
  Object.keys(task)
        .filter(comments)
        .forEach(checkTaskIsDefined)

  /**
   * Here we are, this is the ❤ of dflow.
   */

  function dflowFun () {
    var gotReturn = false
    var outs = {}
    var returnValue

    var inputArgsOf = inputArgs.bind(null, outs, pipe)

    // Inject run-time builtin tasks.

    funcs['this'] = function () { return dflowFun }
    funcs['this.graph'] = function () { return graph }
    injectArguments(funcs, task, arguments)

    /**
     * Execute task.
     */

    function run (taskKey) {
      var args = inputArgsOf(taskKey)
      var taskName = task[taskKey]
      var f = funcs[taskName]

      // Behave like a JavaScript function:
      // if found a return, skip all other tasks.
      if (gotReturn) {
        return
      }

      if ((taskName === 'return') && (!gotReturn)) {
        returnValue = args[0]
        gotReturn = true
        return
      }

      // If task is not defined at run time, throw an error.
      if (typeof f === 'undefined') {
        throw new Error('Task not found: ' + taskName + ' [' + taskKey + '] ')
      }

      // Try to execute task.
      try {
        outs[taskKey] = f.apply(null, args)
      } catch (err) {
        throw err
      }
    }

    // Run every graph task, sorted by level.
    Object.keys(task)
          .filter(comments)
          .sort(byLevel)
          .forEach(run)

    return returnValue
  }

  // Remember function was created from a dflow graph.
  dflowFun.graph = graph

  return dflowFun
}

module.exports = fun

},{"./functions/builtin":34,"./inject/accessors":36,"./inject/additionalFunctions":37,"./inject/arguments":38,"./inject/dotOperators":39,"./inject/globals":40,"./inject/numbers":41,"./inject/references":42,"./inject/strings":43,"./inputArgs":44,"./isDflowFun":46,"./level":47,"./regex/argument":50,"./regex/comment":51,"./regex/subgraph":55,"./reservedKeys":56,"./validate":57,"./walkGlobal":58,"not-defined":5}],34:[function(require,module,exports){
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
  return fun.apply(thisArg, argsArray)
}

exports['.'] = function (obj, prop) { return obj[prop] }

exports['='] = function (a, b) { return a = b }

exports['typeof'] = function (a) { return typeof a }

exports['new'] = function () {
  var Obj = arguments[0]
  var arg1 = arguments[1]
  var arg2 = arguments[2]
  var arg3 = arguments[3]
  var arg4 = arguments[4]
  var arg5 = arguments[5]
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

},{}],35:[function(require,module,exports){
exports.document = function () {
  return document
}

exports.body = function () {
  return document.body
}

exports.head = function () {
  return document.head
}

exports.window = function () {
  return window
}

exports.AudioContext = function () {
  return window.AudioContext || window.webkitAudioContext
}

exports.getElementById = function (id) {
  return window.document.getElementById(id)
}

exports.innerHTML = function (node, content) {
  node.innerHTML = content

  return node
}

},{}],36:[function(require,module,exports){
var accessorRegex = require('../regex/accessor')

/**
 * Inject functions to set or get graph data.
 *
 * @api private
 *
 * @param {Object} funcs reference
 * @param {Object} graph
 */

function injectAccessors (funcs, graph) {
  if (typeof graph.data === 'undefined') {
    graph.data = {}
  }

  funcs['this.graph.data'] = function () { return graph.data }

  /**
   * Inject accessor.
   *
   * @api private
   */

  function inject (taskKey) {
    var accessorName = null
    var taskName = graph.task[taskKey]

    /**
     * Accessor-like function.
     *
     * @api private
     */

    function accessor () {
      if (arguments.length === 1) {
        graph.data[accessorName] = arguments[0]
      }

      return graph.data[accessorName]
    }

    if (accessorRegex.test(taskName)) {
      accessorName = taskName.substring(1)

      funcs[taskName] = accessor
    }
  }

  Object.keys(graph.task).forEach(inject)
}

module.exports = injectAccessors

},{"../regex/accessor":49}],37:[function(require,module,exports){
/**
 * Optionally add custom functions.
 *
 * @api private
 *
 * @params {Object} funcs
 * @params {Object} additionalFunctions
 */

function injectAdditionalFunctions (funcs, additionalFunctions) {
  // Nothing to do if no additional function is given.
  if (typeof additionalFunctions === 'undefined') {
    return
  }

  /**
   * Validate and insert an additional function.
   *
   * @api private
   */

  function injectAdditionalFunction (key) {
    var isAFunction = typeof additionalFunctions[key] === 'function'

    if (isAFunction) {
      funcs[key] = additionalFunctions[key]
    }
  }

  Object.keys(additionalFunctions)
        .forEach(injectAdditionalFunction)
}

module.exports = injectAdditionalFunctions

},{}],38:[function(require,module,exports){
var argumentRegex = require('../regex/argument')

/**
 * Inject functions to retrieve arguments.
 *
 * @api private
 *
 * @param {Object} funcs reference
 * @param {Object} task
 * @param {Object} args
 */

function injectArguments (funcs, task, args) {
  function getArgument (index) {
    return args[index]
  }

  /**
   * Inject arguments.
   *
   * @api private
   */

  function inject (taskKey) {
    var funcName = task[taskKey]

    if (funcName === 'arguments') {
      funcs[funcName] = function getArguments () { return args }
    } else {
      var arg = argumentRegex.exec(funcName)

      if (arg) {
        funcs[funcName] = getArgument.bind(null, arg[1])
      }
    }
  }

  Object.keys(task)
        .forEach(inject)
}

module.exports = injectArguments

},{"../regex/argument":50}],39:[function(require,module,exports){
var dotOperatorRegex = require('../regex/dotOperator')

/**
 * Inject functions that emulate dot operator.
 *
 * @api private
 *
 * @param {Object} funcs reference
 * @param {Object} task
 */

function injectDotOperators (funcs, task) {
  /**
   * Inject dot operator.
   *
   * @api private
   */

  function inject (taskKey) {
    var taskName = task[taskKey]

    /**
     * Dot operator function.
     *
     * @api private
     *
     * @param {String} attributeName
     * @param {Object} obj
     * @param {...} rest of arguments
     *
     * @returns {*} result
     */

    function dotOperatorFunc (attributeName, obj) {
      var func

      if (typeof obj === 'object') {
        func = obj[attributeName]
      }

      if (typeof func === 'function') {
        return func.apply(obj, Array.prototype.slice.call(arguments, 2))
      }
    }

    if (dotOperatorRegex.func.test(taskName)) {
      // .foo() -> foo
      var attributeName = taskName.substring(1, taskName.length - 2)

      funcs[taskName] = dotOperatorFunc.bind(null, attributeName)
    }

    /**
     * Dot operator attribute.
     *
     * @api private
     *
     * @param {String} attributeName
     * @param {Object} obj
     *
     * @returns {*} attribute
     */

    function dotOperatorAttr (attributeName, obj) {
      var attr

      if (typeof obj === 'object') {
        attr = obj[attributeName]
      }

      if (typeof attr === 'function') {
        return attr.bind(obj)
      }

      return attr
    }

    if (dotOperatorRegex.attr.test(taskName)) {
      // .foo -> foo
      attributeName = taskName.substring(1)

      funcs[taskName] = dotOperatorAttr.bind(null, attributeName)
    }
  }

  Object.keys(task).forEach(inject)
}

module.exports = injectDotOperators

},{"../regex/dotOperator":52}],40:[function(require,module,exports){
var notDefined = require('not-defined')
var reservedKeys = require('../reservedKeys')
var walkGlobal = require('../walkGlobal')

/**
 * Inject globals.
 *
 * @api private
 *
 * @param {Object} funcs reference
 * @param {Object} task
 */

function injectGlobals (funcs, task) {
  /**
   * Inject task
   *
   * @api private
   */

  function inject (taskKey) {
    var taskName = task[taskKey]

    // Do not overwrite a function if already defined.
    // For example, console.log cannot be used as is, it must binded to console.
    if (typeof funcs[taskName] === 'function') return

    // Skip also reserved keywords.
    if (reservedKeys.indexOf(taskName) > -1) return

    var globalValue = walkGlobal(taskName)

    if (notDefined(globalValue)) return

    if (typeof globalValue === 'function') {
      funcs[taskName] = globalValue
    } else {
      funcs[taskName] = function () {
        return globalValue
      }
    }
  }

  Object.keys(task)
        .forEach(inject)
}

module.exports = injectGlobals

},{"../reservedKeys":56,"../walkGlobal":58,"not-defined":5}],41:[function(require,module,exports){
/**
 * Inject functions that return numbers.
 *
 * @api private
 *
 * @param {Object} funcs reference
 * @param {Object} task collection
 */

function injectNumbers (funcs, task) {
  /**
   * Inject a function that returns a number.
   *
   * @api private
   */

  function inject (taskKey) {
    var taskName = task[taskKey]

    var num = parseFloat(taskName)

    if (isNaN(num)) {
      return
    } else {
      funcs[taskName] = function () { return num }
    }
  }

  Object.keys(task)
        .forEach(inject)
}

module.exports = injectNumbers

},{}],42:[function(require,module,exports){
var referenceRegex = require('../regex/reference')
var walkGlobal = require('../walkGlobal')

/**
 * Inject references to functions.
 *
 * @api private
 *
 * @param {Object} funcs reference
 * @param {Object} task
 */

function injectReferences (funcs, task) {
  /**
   * Inject task.
   *
   * @api private
   */

  function inject (taskKey) {
    var referenceName = null
    var referencedFunction = null
    var taskName = task[taskKey]

    /**
     * Inject reference.
     *
     * @api private
     */

    function reference () {
      return referencedFunction
    }

    if (referenceRegex.test(taskName)) {
      referenceName = taskName.substring(1)

      if (typeof funcs[referenceName] === 'function') {
        referencedFunction = funcs[referenceName]
      } else {
        referencedFunction = walkGlobal(referenceName)
      }

      if (typeof referencedFunction === 'function') {
        funcs[taskName] = reference
      }
    }
  }

  Object.keys(task).forEach(inject)
}

module.exports = injectReferences

},{"../regex/reference":54,"../walkGlobal":58}],43:[function(require,module,exports){
var quotedRegex = require('../regex/quoted')

/**
 * Inject functions that return strings.
 *
 * @api private
 *
 * @param {Object} funcs reference
 * @param {Object} task collection
 */

function injectStrings (funcs, task) {
  /**
   * Inject a function that returns a string.
   *
   * @api private
   */

  function inject (taskKey) {
    var taskName = task[taskKey]

    if (quotedRegex.test(taskName)) {
      funcs[taskName] = function () {
        return taskName.substr(1, taskName.length - 2)
      }
    }
  }

  Object.keys(task)
        .forEach(inject)
}

module.exports = injectStrings

},{"../regex/quoted":53}],44:[function(require,module,exports){
var inputPipes = require('./inputPipes')

/**
 * Retrieve input arguments of a task.
 *
 * @param {Object} outs
 * @param {Object} pipe
 * @param {String} taskKey
 *
 * @returns {Array} args
 */

function inputArgs (outs, pipe, taskKey) {
  var args = []
  var inputPipesOf = inputPipes.bind(null, pipe)

  function populateArg (inputPipe) {
    var index = inputPipe[2] || 0
    var value = outs[inputPipe[0]]

    args[index] = value
  }

  inputPipesOf(taskKey).forEach(populateArg)

  return args
}

module.exports = inputArgs

},{"./inputPipes":45}],45:[function(require,module,exports){
/**
 * Compute pipes that feed a task.
 *
 * @param {Object} pipe
 * @param {String} taskKey
 *
 * @returns {Array} pipes
 */

function inputPipes (pipe, taskKey) {
  var pipes = []

  function pushPipe (key) {
    pipes.push(pipe[key])
  }

  function ifIsInputPipe (key) {
    return pipe[key][1] === taskKey
  }

  Object.keys(pipe).filter(ifIsInputPipe).forEach(pushPipe)

  return pipes
}

module.exports = inputPipes

},{}],46:[function(require,module,exports){
var validate = require('./validate')

/**
 * Duct tape for dflow functions.
 *
 * @param {Function} f
 *
 * @returns {Boolean} ok, it looks like a dflowFun
 */

function isDflowFun (f) {
  var isFunction = typeof f === 'function'
  var hasGraphObject = typeof f.graph === 'object'
  var hasFuncsObject = typeof f.funcs === 'object'
  var hasValidGraph = true

  if (isFunction && hasGraphObject && hasFuncsObject) {
    try {
      validate(f.graph, f.funcs)
    } catch (ignore) {
      hasValidGraph = false
    }
  }

  return hasValidGraph
}

module.exports = isDflowFun

},{"./validate":57}],47:[function(require,module,exports){
var parents = require('./parents')

/**
 * Compute level of task.
 *
 * @param {Object} pipe
 * @param {Object} cachedLevelOf
 * @param {String} taskKey
 *
 * @returns {Number} taskLevel
 */

function level (pipe, cachedLevelOf, taskKey) {
  var taskLevel = 0
  var parentsOf = parents.bind(null, pipe)

  if (typeof cachedLevelOf[taskKey] === 'number') {
    return cachedLevelOf[taskKey]
  }

  function computeLevel (parentTaskKey) {
                                 // ↓ Recursion here: the level of a task is the max level of its parents + 1.
    taskLevel = Math.max(taskLevel, level(pipe, cachedLevelOf, parentTaskKey) + 1)
  }

  parentsOf(taskKey).forEach(computeLevel)

  cachedLevelOf[taskKey] = taskLevel

  return taskLevel
}

module.exports = level

},{"./parents":48}],48:[function(require,module,exports){
var inputPipes = require('./inputPipes')

/**
 * Compute parent tasks.
 *
 * @param {Array} pipes of graph
 * @param {String} taskKey
 *
 * @returns {Array} parentTaskIds
 */

function parents (pipe, taskKey) {
  var inputPipesOf = inputPipes.bind(null, pipe)
  var parentTaskIds = []

  function pushParentTaskId (pipe) {
    parentTaskIds.push(pipe[0])
  }

  inputPipesOf(taskKey).forEach(pushParentTaskId)

  return parentTaskIds
}

module.exports = parents

},{"./inputPipes":45}],49:[function(require,module,exports){
module.exports = /^@[\w][\w\d]+$/

},{}],50:[function(require,module,exports){
module.exports = /^arguments\[(\d+)\]$/

},{}],51:[function(require,module,exports){
module.exports = /^\/\/.+$/

},{}],52:[function(require,module,exports){
exports.attr = /^\.([a-zA-Z_$][0-9a-zA-Z_$]+)$/

exports.func = /^\.([a-zA-Z_$][0-9a-zA-Z_$]+)\(\)$/

},{}],53:[function(require,module,exports){
module.exports = /^'.+'$/

},{}],54:[function(require,module,exports){
module.exports = /^\&(.+)$/

},{}],55:[function(require,module,exports){
module.exports = /^\/[\w][\w\d]+$/

},{}],56:[function(require,module,exports){
module.exports = [
  'arguments',
  'dflow.fun',
  'dflow.isDflowFun',
  'dflow.validate',
  'return',
  'this',
  'this.graph'
]

},{}],57:[function(require,module,exports){
var accessorRegex = require('./regex/accessor')
var argumentRegex = require('./regex/argument')
var dotOperatorRegex = require('./regex/dotOperator')
var referenceRegex = require('./regex/reference')
var reservedKeys = require('./reservedKeys')
var subgraphRegex = require('./regex/subgraph')

/**
 * Check graph consistency.
 *
 * @param {Object} graph
 * @param {Object} [additionalFunctions]
 *
 * @returns {Boolean} ok if no exception is thrown
 */

function validate (graph, additionalFunctions) {
  // Required properties.
  var pipe = graph.pipe
  var task = graph.task

  // Optional properties.
  var data = graph.data || {}
  var func = graph.func || {}
  var info = graph.info || {}

  var seenPipe = {}

  // Validate addition functions, if any.
  // Check there are no reserved keys.

  function throwIfEquals (taskName, reservedKey) {
    if (taskName === reservedKey) {
      throw new TypeError('Reserved function name: ' + taskName)
    }
  }

  if (typeof additionalFunctions === 'object') {
    for (var taskName in additionalFunctions) {
      var reservedKeys = ['return', 'arguments', 'this', 'this.graph']
      var throwIfEqualsTaskName = throwIfEquals.bind(null, taskName)

      reservedKeys.forEach(throwIfEqualsTaskName)

      if (argumentRegex.test(taskName)) {
        throw new TypeError('Reserved function name: ' + taskName)
      }

      if (accessorRegex.test(taskName)) {
        throw new TypeError('Function name cannot start with "@": ' + taskName)
      }

      if (dotOperatorRegex.attr.test(taskName)) {
        throw new TypeError('Function name cannot start with ".":' + taskName)
      }

      if (dotOperatorRegex.func.test(taskName)) {
        throw new TypeError('Function name cannot start with "." and end with "()":' + taskName)
      }

      if (referenceRegex.test(taskName)) {
        throw new TypeError('Function name cannot start with "&": ' + taskName)
      }
    }
  }

  // Check pipe and task are objects.

  if (typeof pipe !== 'object') {
    throw new TypeError('Not an object: pipe ' + pipe)
  }

  if (typeof task !== 'object') {
    throw new TypeError('Not an object: task ' + task)
  }

  // Check optional data, func, info and view are objects.

  if (typeof data !== 'object') {
    throw new TypeError('Not an object: data ' + data)
  }

  if (typeof func !== 'object') {
    throw new TypeError('Not an object: func ' + func)
  }

  if (typeof info !== 'object') {
    throw new TypeError('Not an object: info ' + info)
  }

  function checkPipe (key) {
    var arg = pipe[key][2] || 0
    var from = pipe[key][0]
    var to = pipe[key][1]

    // Check types.

    if (typeof arg !== 'number') {
      throw new TypeError('Invalid pipe: ' + pipe[key])
    }

    if (typeof from !== 'string') {
      throw new TypeError('Invalid pipe: ' + pipe[key])
    }

    if (typeof to !== 'string') {
      throw new TypeError('Invalid pipe: ' + pipe[key])
    }

    // Check for orphan pipes.

    if (typeof task[from] === 'undefined') {
      throw new Error('Orphan pipe: ' + pipe[key])
    }

    if (typeof task[to] === 'undefined') {
      throw new Error('Orphan pipe: ' + pipe[key])
    }

    // Remember pipes, avoid duplicates.

    if (typeof seenPipe[from] === 'undefined') {
      seenPipe[from] = {}
    }

    if (typeof seenPipe[from][to] === 'undefined') {
      seenPipe[from][to] = []
    }

    if (typeof seenPipe[from][to][arg] === 'undefined') {
      seenPipe[from][to][arg] = true
    } else {
      throw new Error('Duplicated pipe: ' + pipe[key])
    }
  }

  Object.keys(pipe)
        .forEach(checkPipe)

  // Check that every subgraph referenced are defined.

  function onlySubgraphs (key) {
    var taskName = task[key]

    return subgraphRegex.test(taskName)
  }

  function checkSubgraph (key) {
    var taskName = task[key]

    var funcName = taskName.substring(1)

    if (typeof func[funcName] === 'undefined') {
      throw new Error('Undefined subgraph: ' + funcName)
    }
  }

  Object.keys(task)
        .filter(onlySubgraphs)
        .forEach(checkSubgraph)

  // Recursively check subgraphs in func property.

  function checkFunc (key) {
    validate(func[key], additionalFunctions)
  }

  if (typeof func === 'object') {
    Object.keys(func)
          .forEach(checkFunc)
  }

  return true
}

module.exports = validate

},{"./regex/accessor":49,"./regex/argument":50,"./regex/dotOperator":52,"./regex/reference":54,"./regex/subgraph":55,"./reservedKeys":56}],58:[function(require,module,exports){
(function (global){
var globalContext

if (typeof window === 'object') {
  globalContext = window
}

if (typeof global === 'object') {
  globalContext = global
}

/**
 * Walk through global context.
 *
 * process.version will return global[process][version]
 *
 * @param {String} taskName
 * @returns {*} leaf
 */

function walkGlobal (taskName) {
  function toNextProp (next, prop) {
    return next[prop]
  }

  return taskName.split('.')
                 .reduce(toNextProp, globalContext)
}

module.exports = walkGlobal

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],59:[function(require,module,exports){
module.exports={
  "data": {
    "results": [
      {
        "args": [0],
        "expected": true
      }
    ]
  },
  "pipe": {
    "6": [
      "1",
      "4"
    ],
    "7": [
      "2",
      "4",
      1
    ],
    "8": [
      "3",
      "4",
      2
    ],
    "9": [
      "4",
      "5"
    ]
  },
  "task": {
    "1": "&isFinite",
    "2": "null",
    "3": "arguments",
    "4": "apply",
    "5": "return"
  },
  "view": {
    "node": {
      "1": {
        "text": "&isFinite",
        "x": 381,
        "y": 56,
        "outs": [
          {
            "name": "out"
          }
        ],
        "task": "1"
      },
      "2": {
        "text": "null",
        "x": 507,
        "y": 58,
        "outs": [
          {
            "name": "out"
          }
        ],
        "task": "2"
      },
      "3": {
        "text": "arguments",
        "x": 588,
        "y": 57,
        "outs": [
          {
            "name": "out"
          }
        ],
        "task": "3"
      },
      "4": {
        "text": "apply",
        "x": 479,
        "y": 143,
        "ins": [
          {
            "name": "in0"
          },
          {
            "name": "in1"
          },
          {
            "name": "in2"
          }
        ],
        "outs": [
          {
            "name": "out"
          }
        ],
        "task": "4"
      },
      "5": {
        "text": "return",
        "x": 478,
        "y": 223,
        "ins": [
          {
            "name": "in"
          }
        ],
        "task": "5"
      }
    },
    "link": {
      "6": {
        "from": [
          "1",
          0
        ],
        "to": [
          "4",
          0
        ],
        "id": "6"
      },
      "7": {
        "from": [
          "2",
          0
        ],
        "to": [
          "4",
          1
        ],
        "id": "7"
      },
      "8": {
        "from": [
          "3",
          0
        ],
        "to": [
          "4",
          2
        ],
        "id": "8"
      },
      "9": {
        "from": [
          "4",
          0
        ],
        "to": [
          "5",
          0
        ],
        "id": "9"
      }
    }
  }
}

},{}],60:[function(require,module,exports){
module.exports={
  "info": {
    "context": "client"
  },
  "data": {
    "results": []
  },
  "pipe": {
    "7": [
      "6",
      "4",
      1
    ],
    "10": [
      "8",
      "9"
    ],
    "13": [
      "4",
      "9",
      1
    ],
    "15": [
      "12",
      "14"
    ],
    "17": [
      "14",
      "4"
    ]
  },
  "task": {
    "4": "innerHTML",
    "6": "'This is a paragraph'",
    "8": "body",
    "9": ".appendChild()",
    "12": "document",
    "14": ".createElement()"
  },
  "view": {
    "node": {
      "4": {
        "text": "innerHTML",
        "x": 293,
        "y": 338,
        "ins": [
          {
            "name": "in0"
          },
          {
            "name": "in1"
          }
        ],
        "outs": [
          {
            "name": "out"
          }
        ],
        "task": "4"
      },
      "6": {
        "text": "'This is a paragraph'",
        "x": 394,
        "y": 227,
        "outs": [
          {
            "name": "out"
          }
        ],
        "task": "6"
      },
      "8": {
        "text": "body",
        "x": 144,
        "y": 379,
        "outs": [
          {
            "name": "out"
          }
        ],
        "task": "8"
      },
      "9": {
        "text": ".appendChild()",
        "x": 145,
        "y": 476,
        "outs": [
          {
            "name": "out"
          }
        ],
        "task": "9",
        "ins": [
          {},
          {}
        ]
      },
      "12": {
        "text": "document",
        "x": 295,
        "y": 69,
        "outs": [
          {
            "name": "out"
          }
        ],
        "task": "12"
      },
      "14": {
        "text": ".createElement()",
        "x": 294,
        "y": 173,
        "outs": [
          {
            "name": "out"
          }
        ],
        "task": "14",
        "ins": [
          {},
          {}
        ]
      }
    },
    "link": {
      "7": {
        "from": [
          "6",
          0
        ],
        "to": [
          "4",
          1
        ],
        "id": "7"
      },
      "10": {
        "from": [
          "8",
          0
        ],
        "to": [
          "9",
          0
        ],
        "id": "10"
      },
      "13": {
        "from": [
          "4",
          0
        ],
        "to": [
          "9",
          1
        ],
        "id": "13"
      },
      "15": {
        "from": [
          "12",
          0
        ],
        "to": [
          "14",
          0
        ],
        "id": "15"
      },
      "17": {
        "from": [
          "14",
          0
        ],
        "to": [
          "4",
          0
        ],
        "id": "17"
      }
    }
  }
}

},{}],61:[function(require,module,exports){
module.exports={
  "task": {
    "a": "arguments[0]",
    "b": "Date.parse",
    "c": "return"
  },
  "pipe": {
    "1": [ "a", "b", 0 ],
    "3": [ "b", "c" ]
  },
  "data": {
    "results": [
      {
        "args": [ "Wed, 09 Aug 1995 00:00:00 GMT" ],
        "expected": 807926400000
      }
    ]
  }
}

},{}],62:[function(require,module,exports){
module.exports={
  "task": {
    "a": "arguments[0]",
    "b": "arguments[1]",
    "c": ".",
    "d": "return"
  },
  "pipe": {
    "1": [ "a", "c", 0 ],
    "2": [ "b", "c", 1 ],
    "3": [ "c", "d" ]
  },
  "data": {
    "results": [
      {
        "args": [ { "foo": "bar" }, "foo" ],
        "expected": "bar"
      }
    ]
  }
}

},{}],63:[function(require,module,exports){
module.exports={
  "task": {
    "1": "@message",
    "2": "console.log"
  },
  "pipe": {
    "3": [ "1", "2" ]
  },
  "data": {
    "message": "Hello World, by dflow",
    "results": []
  },
  "view": {
    "node": {
      "1": {
        "x": 80,
        "y": 20,
        "w": 15,
        "task": "1",
        "text": "@message",
        "outs": [{"name": "out0"}]
      },
      "2": {
        "x": 80,
        "y": 150,
        "w": 15,
        "task": "2",
        "text": "console.log",
        "ins": [{"name": "in0"}]
      }
    },
    "link": {
      "3": {
        "from": ["1", 0],
        "to": ["2", 0]
      }
    }
  }
}

},{}],64:[function(require,module,exports){
module.exports={
  "task": {
    "a": "arguments[0]",
    "b": "arguments[1]",
    "c": "indexOf",
    "d": "return"
  },
  "pipe": {
    "1": [ "a", "c", 0 ],
    "2": [ "b", "c", 1 ],
    "3": [ "c", "d" ]
  },
  "data": {
    "results": [
      {
        "args": [ "abcd", "b" ],
        "expected": 1
      },
      {
        "args": [ [7, 8, 9], 9 ],
        "expected": 2
      }
    ]
  }
}

},{}],65:[function(require,module,exports){
module.exports={
  "data": {
    "results": []
  },
  "pipe": {
    "7": [
      "6",
      "1"
    ],
    "9": [
      "2",
      "1",
      1
    ],
    "10": [
      "3",
      "1",
      2
    ],
    "11": [
      "8",
      "1",
      3
    ],
    "13": [
      "1",
      "12"
    ]
  },
  "task": {
    "1": "new",
    "2": "arguments[0]",
    "3": "arguments[1]",
    "6": "&Date",
    "8": "arguments[2]",
    "12": "return"
  },
  "view": {
    "node": {
      "1": {
        "text": "new",
        "x": 90,
        "y": 126,
        "task": "1",
        "outs": [
          {}
        ],
        "ins": [
          {},
          {},
          {},
          {}
        ]
      },
      "2": {
        "text": "arguments[0]",
        "x": 196,
        "y": 42,
        "task": "2",
        "outs": [
          {}
        ]
      },
      "3": {
        "text": "arguments[1]",
        "x": 372,
        "y": 41,
        "task": "3",
        "outs": [
          {}
        ]
      },
      "6": {
        "text": "&Date",
        "x": 90,
        "y": 41,
        "task": "6",
        "outs": [
          {}
        ]
      },
      "8": {
        "text": "arguments[2]",
        "x": 554,
        "y": 41,
        "task": "8",
        "outs": [
          {}
        ]
      },
      "12": {
        "text": "return",
        "x": 92,
        "y": 232,
        "task": "12",
        "ins": [
          {}
        ]
      }
    },
    "link": {
      "7": {
        "from": [
          "6",
          0
        ],
        "to": [
          "1",
          0
        ],
        "id": "7"
      },
      "9": {
        "from": [
          "2",
          0
        ],
        "to": [
          "1",
          1
        ],
        "id": "9"
      },
      "10": {
        "from": [
          "3",
          0
        ],
        "to": [
          "1",
          2
        ],
        "id": "10"
      },
      "11": {
        "from": [
          "8",
          0
        ],
        "to": [
          "1",
          3
        ],
        "id": "11"
      },
      "13": {
        "from": [
          "1",
          0
        ],
        "to": [
          "12",
          0
        ],
        "id": "13"
      }
    }
  }
}

},{}],66:[function(require,module,exports){
module.exports={
  "task": {
    "1": "arguments[0]",
    "2": "arguments[1]",
    "3": "||",
    "4": "return"
  },
  "pipe": {
    "5": [ "1", "3", 0 ],
    "6": [ "2", "3", 1 ],
    "7": [ "3", "4" ]
  },
  "data": {
    "results": [
      {
        "args": [true, false],
        "expected": true
      }
    ]
  }
}

},{}],67:[function(require,module,exports){
module.exports={
  "task": {
    "1": "arguments[0]",
    "2": "arguments[1]",
    "3": "+",
    "4": "return"
  },
  "pipe": {
    "5": [ "1", "3", 0 ],
    "6": [ "2", "3", 1 ],
    "7": [ "3", "4" ]
  },
  "data": {
    "results": [
      {
        "args": [1, 2],
        "expected": 3
      }
    ]
  }
}

},{}],68:[function(require,module,exports){
module.exports={
  "data": {
    "results": []
  },
  "pipe": {
    "4": [
      "2",
      "3"
    ]
  },
  "task": {
    "2": "arguments",
    "3": "return"
  },
  "view": {
    "node": {
      "2": {
        "text": "arguments",
        "x": 456,
        "y": 129,
        "outs": [
          {
            "name": "out"
          }
        ],
        "task": "2"
      },
      "3": {
        "text": "return",
        "x": 457,
        "y": 219,
        "ins": [
          {
            "name": "in"
          }
        ],
        "task": "3"
      }
    },
    "link": {
      "4": {
        "from": [
          "2",
          0
        ],
        "to": [
          "3",
          0
        ],
        "id": "4"
      }
    }
  }
}

},{}],69:[function(require,module,exports){
// Do not use dynamic imports, for example importing the whole graph folder;
// use explicit imports instead, otherwise browserify will not include graphs.
exports['apply'] = require('./graph/apply.json')
exports.createParagraph = require('./graph/createParagraph.json')
exports.dateParse = require('./graph/dateParse.json')
exports.dotOperator = require('./graph/dotOperator.json')
exports['hello-world'] = require('./graph/hello-world.json')
exports.indexOf = require('./graph/indexOf.json')
exports['new'] = require('./graph/new.json')
exports.or = require('./graph/or.json')
exports.sum = require('./graph/sum.json')
exports.welcome = require('./graph/welcome.json')

},{"./graph/apply.json":59,"./graph/createParagraph.json":60,"./graph/dateParse.json":61,"./graph/dotOperator.json":62,"./graph/hello-world.json":63,"./graph/indexOf.json":64,"./graph/new.json":65,"./graph/or.json":66,"./graph/sum.json":67,"./graph/welcome.json":68}],70:[function(require,module,exports){
module.exports={
  "task": {
    "1": "arguments[0]",
    "2": "arguments[1]",
    "3": "+",
    "4": "return"
  },
  "pipe": {
    "5": [ "1", "3", 0 ],
    "6": [ "2", "3", 1 ],
    "7": [ "3", "4" ]
  },
  "info": {
    "doc": {}
  },
  "view": {}
}

},{}],71:[function(require,module,exports){
// TODO
// check '='
// var builtin = require('../src/engine/functions/builtin')

},{}],72:[function(require,module,exports){
var emptyGraph = require('../src/engine/emptyGraph.json')
var validate = require('../src/engine/validate')

describe('emptyGraph', function () {
  it('is a valid graph', function () {
    validate(emptyGraph).should.be.ok
  })
})

},{"../src/engine/emptyGraph.json":32,"../src/engine/validate":57}],73:[function(require,module,exports){
var dflow = require('dflow')
var should = require('should')

var examples = require('../src/examples')

var context = (typeof window === 'object') ? 'client' : 'server'

describe('example', function () {
  function testExample (name, graph) {
    describe(name, function () {
      var f = dflow.fun(graph)

      it('works', function () {
        f.should.be.instanceOf(Function)
      })

      it('returns expected results', function () {
        graph.data.results.forEach(function (test) {
          var result = f.apply(null, test.args)

          should.deepEqual(result, test.expected)
        })
      })
    })
  }

  for (var exampleName in examples) {
    var exampleGraph = examples[exampleName]

    var graphInfo = exampleGraph.info || {}
    var graphContext = graphInfo.context || 'universal'

    if (graphContext === context) {
      testExample(exampleName, exampleGraph)
    }
  }

  describe('packagedGraph', function () {
    it('is a dflow graph packages with npm', function () {
      var graph = require('../src/examples/packagedGraph')

      var sum = dflow.fun(graph)

      sum(2, 2).should.be.eql(4)
    })
  })
})

},{"../src/examples":69,"../src/examples/packagedGraph":70,"dflow":77,"should":12}],74:[function(require,module,exports){

var should = require('should')
var fun = require('../src/engine/fun')

describe('fun', function () {
  it('returns a function', function () {
    var graph = {
      task: {
        '0': 'arguments[0]',
        '1': 'arguments[1]',
        '2': '/sum',
        '3': '@three',
        '4': '*',
        '5': '@result',
        '6': 'return',
        '7': '// this is a comment'
      },
      pipe: {
        'a': [ '0', '2', 0 ],
        'b': [ '1', '2', 1 ],
        'c': [ '2', '4', 0 ],
        'd': [ '3', '4', 1 ],
        'e': [ '4', '5' ],
        'f': [ '5', '6' ]
      },
      func: {
        sum: {
          pipe: {
            'a': [ '0', '2', 0 ],
            'b': [ '1', '2', 1 ],
            'c': [ '2', '3' ]
          },
          task: {
            '0': 'arguments[0]',
            '1': 'arguments[1]',
            '2': 'custom + operator',
            '3': 'return'
          }
        }
      },
      data: {
        three: 3
      },
      view: {}
    }

    var funcs = {
      'custom + operator': function (a, b) { return a + b }
    }

    var f = fun(graph, funcs)

    f.should.be.instanceOf(Function)
    f(1, 2).should.eql(9)
    f.graph.should.eql(graph)
    f.graph.data.result.should.eql(9)
  })

  it('accepts an empty graph', function () {
    var emptyGraph = {
      task: {},
      pipe: {}
    }

    var empty = fun(emptyGraph)

    should.deepEqual(empty.graph, emptyGraph)
  })

  it('can use dflow functions as tasks', function () {
    var graph = {
      task: {
        '1': 'dflow.fun',
        '2': 'dflow.isDflowFun',
        '3': 'dflow.validate'
      },
      pipe: {}
    }

    fun(graph)
  })

  it('throws if graph is not valid', function () {
    ;(function () {
      var graphWithOrphanPipe = {
        task: {
          '3': 'return'
        },
        pipe: {
          '1': [ '2', '3' ]
        }
      }

      fun(graphWithOrphanPipe)
    }).should.throwError(/Orphan pipe:/)
  })

  it('throws if a task is not found', function () {
    ;(function () {
      var graphWithTaskNotFound = {
        task: {
          '2': 'available task',
          '3': 'foo'
        },
        pipe: {
          '1': [ '2', '3' ]
        }
      }

      var funcs = {
        'available task': function () { return 'ok' }
      }

      fun(graphWithTaskNotFound, funcs)
    }).should.throwError(/Task not found:/)
  })
})

},{"../src/engine/fun":33,"should":12}],75:[function(require,module,exports){
var inputPipes = require('../src/engine/inputPipes')

var pipe = {
  'a': [ '0', '1' ],
  'b': [ '1', '2' ],
  'c': [ '1', '3' ],
  'd': [ '2', '3' ]
}

var inputPipesOf = inputPipes.bind(null, pipe)

describe('inputPipes', function () {
  it('returns input pipes of task', function () {
    inputPipesOf('0').should.eql([])

    inputPipesOf('1').should.eql([pipe.a])

    inputPipesOf('2').should.eql([pipe.b])

    inputPipesOf('3').should.eql([pipe.c, pipe.d])
  })
})

},{"../src/engine/inputPipes":45}],76:[function(require,module,exports){
var level = require('../src/engine/level')

var pipe = {
  'a': [ '0', '1' ],
  'b': [ '1', '2' ],
  'c': [ '1', '3' ],
  'd': [ '2', '3' ]
}

var cachedLevelOf = {}
var computeLevelOf = level.bind(null, pipe, cachedLevelOf)

describe('level', function () {
  it('returns level of task', function () {
    computeLevelOf('0').should.eql(0)
    computeLevelOf('1').should.eql(1)
    computeLevelOf('2').should.eql(2)
    computeLevelOf('3').should.eql(3)
  })
})

},{"../src/engine/level":47}],77:[function(require,module,exports){

// Cheating npm require.
module.exports = require('../../..')


},{"../../..":31}],78:[function(require,module,exports){

var accessor = require('../src/engine/regex/accessor')
var argument = require('../src/engine/regex/argument')
var comment = require('../src/engine/regex/comment')
var dotOperator = require('../src/engine/regex/dotOperator')
var reference = require('../src/engine/regex/reference')
var subgraph = require('../src/engine/regex/subgraph')

describe('regex', function () {
  describe('accessor', function () {
    it('matches @attributeName', function () {
      accessor.test('@foo').should.be.true
    })
  })

  describe('argument', function () {
    it('matches arguments[N]', function () {
      argument.test('arguments[0]').should.be.true
      argument.test('arguments[1]').should.be.true
      argument.test('arguments[2]').should.be.true
      argument.test('arguments[3]').should.be.true
    })
  })

  describe('dotOperator.attr', function () {
    it('matches .validJavaScriptVariableName', function () {
      dotOperator.func.test('.foo').should.be.true
      dotOperator.func.test('.1foo').should.be.false
    })
  })

  describe('dotOperator.func', function () {
    it('matches .validJavaScriptFunctionName()', function () {
      dotOperator.func.test('.foo()').should.be.true
      dotOperator.func.test('.1foo()').should.be.false
    })
  })

  describe('reference', function () {
    it('matches &functionName', function () {
      reference.test('&foo').should.be.true
    })
  })

  describe('subgraph', function () {
    it('matches /functionName', function () {
      subgraph.test('/foo').should.be.true
      subgraph.test('//comment').should.be.false
      subgraph.test('notStartingWithSlash').should.be.false
    })
  })

  describe('comment', function () {
    it('matches //comment', function () {
      comment.test('//foo').should.be.true
    })
  })
})


},{"../src/engine/regex/accessor":49,"../src/engine/regex/argument":50,"../src/engine/regex/comment":51,"../src/engine/regex/dotOperator":52,"../src/engine/regex/reference":54,"../src/engine/regex/subgraph":55}],79:[function(require,module,exports){
var should = require('should')
var fun = require('../src/engine/fun')

describe('this', function () {
  var graph = {
    task: {
      '1': 'this.graph',
      '2': 'return'
    },
    pipe: {
      'a': [ '1', '2' ]
    }
  }

  var f = fun(graph)

  it('is a dflow builtin that returns the function itself', function () {
    should.deepEqual(f(), graph)
  })
})

describe('this.graph', function () {
  var graph = {
    task: {
      '1': 'this',
      '2': 'return'
    },
    pipe: {
      'a': [ '1', '2' ]
    }
  }

  var f = fun(graph)

  it('is a dflow builtin that returns the graph', function () {
    f().should.be.a.Function

    // Yep, f is a function that returns itself
    should.deepEqual(f()(), f()()())
  })
})

},{"../src/engine/fun":33,"should":12}],80:[function(require,module,exports){
var validate = require('../src/engine/validate')

describe('validate', function () {
  it('is aware that undefined argIndex means 0', function () {
    var graph = {
      task: { '1': 'x', '2': 'x' },
      pipe: {
        'a': [ '1', '2' ] // pipe['a'][2] here defaults to 0
      }
    }

    validate(graph).should.be.ok
  })

  it('throws if an additional function name is "return"', function () {
    ;(function () {
      var graph = {
        task: {}, pipe: {}
      }
      var func = {
        'return': Function.prototype
      }

      validate(graph, func)
    }).should.throwError(/Reserved function name/)
  })

  it('throws if an additional function name is "arguments"', function () {
    ;(function () {
      var graph = {
        task: {},
        pipe: {}
      }
      var func = {
        'arguments': Function.prototype
      }

      validate(graph, func)
    }).should.throwError(/Reserved function name/)
  })

  it('throws if an additional function name is "argument[N]"', function () {
    ;(function () {
      validate({ task: {}, pipe: {} }, { 'arguments[0]': Function.prototype })
    }).should.throwError(/Reserved function name/)

    ;(function () {
      validate({ task: {}, pipe: {} }, { 'arguments[1]': Function.prototype })
    }).should.throwError(/Reserved function name/)
  })

  it('throws if an additional function name is "this"', function () {
    ;(function () {
      validate({ task: {}, pipe: {} }, { 'this': Function.prototype })
    }).should.throwError(/Reserved function name/)
  })

  it('throws if an additional function name is "this.graph"', function () {
    ;(function () {
      validate({ task: {}, pipe: {} }, { 'this.graph': Function.prototype })
    }).should.throwError(/Reserved function name/)
  })

  it('throws if an additional function name starts with a "@"', function () {
    ;(function () {
      validate({ task: {}, pipe: {} }, { '@foo': Function.prototype })
    }).should.throwError(/Function name cannot start with "@"/)
  })

  it('throws if an additional function name starts with a "&"', function () {
    ;(function () {
      validate({ task: {}, pipe: {} }, { '&bar': Function.prototype })
    }).should.throwError(/Function name cannot start with "&"/)
  })

  it('throws if an additional function name starts with a "."', function () {
    ;(function () {
      validate({ task: {}, pipe: {} }, { '.quz': Function.prototype })
    }).should.throwError(/Function name cannot start with "\."/)

    ;(function () {
      validate({ task: {}, pipe: {} }, { '.quz()': Function.prototype })
    }).should.throwError(/Function name cannot start with "\."/)
  })

  it('throws if pipe or task is not an object', function () {
    ;(function () {
      validate({ task: 'not an object', pipe: {} })
    }).should.throwError(/Not an object: task/)

    ;(function () {
      validate({ pipe: 'not an object', task: {} })
    }).should.throwError(/Not an object: pipe/)
  })

  it('throws if optional data, func or info is not an object', function () {
    ;(function () {
      validate({ task: {}, pipe: {}, data: 'not an object' })
    }).should.throwError(/Not an object: data/)

    ;(function () {
      validate({ task: {}, pipe: {}, func: 'not an object' })
    }).should.throwError(/Not an object: func/)

    ;(function () {
      validate({ task: {}, pipe: {}, info: 'not an object' })
    }).should.throwError(/Not an object: info/)
  })

  it('throws if some pipe has invalid type', function () {
    ;(function () {
      validate({ task: {}, pipe: { '1': [ '1', '2', 'zero' ] } })
    }).should.throwError(/Invalid pipe:/)

    ;(function () {
      validate({ task: {}, pipe: { '1': [ '1', 2, 0 ] } })
    }).should.throwError(/Invalid pipe:/)

    ;(function () {
      validate({ task: {}, pipe: { '1': [ 1, '2', 0 ] } })
    }).should.throwError(/Invalid pipe:/)
  })

  it('throws if pipe has duplicates', function () {
    ;(function () {
      validate({
        task: { '1': 'foo', '2': 'bar' },
        pipe: {
          a: [ '1', '2', 1 ],
          b: [ '1', '2', 1 ]
        }
      })
    }).should.throwError(/Duplicated pipe:/)

    ;(function () {
      validate({
        task: { '1': 'foo', '2': 'bar' },
        pipe: {
          a: [ '1', '2', 0 ],
          b: [ '1', '2' ] // Since pipe['b'][2] defaults to 0, pipe['b'] is a duplicate.
        }
      })
    }).should.throwError(/Duplicated pipe:/)
  })

  it('throws if some pipe is orphan', function () {
    ;(function () {
      validate({
        task: {},
        pipe: {
          a: [ '1', '2', 0 ]
        }
      })
    }).should.throwError(/Orphan pipe:/)
  })

  it('throws if some func is not a valid (sub)graph', function () {
    ;(function () {
      validate({
        task: {},
        pipe: {},
        func: {
          a: {
            task: {},
            pipe: {
              b: [ '1', '2', 0 ]
            }
          }
        }
      })
    }).should.throwError(/Orphan pipe:/)
  })

  it('throws if subgraph is not defined', function () {
    ;(function () {
      validate({
        task: { '1': '/foo' },
        pipe: {},
        func: {}
      })
    }).should.throwError(/Undefined subgraph:/)
  })
})

},{"../src/engine/validate":57}]},{},[71,72,73,74,75,76,78,79,80]);
