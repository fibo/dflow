(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

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
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
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
  function Bar () {}
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    arr.constructor = Bar
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Bar && // constructor can be set
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
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  this.length = 0
  this.parent = undefined

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
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
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
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
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

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
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

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

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
  if (this === b) return 0
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

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
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
    newBuf = Buffer._augment(this.subarray(start, end))
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
  if (value > max || value < min) throw new RangeError('value is out of bounds')
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
    target._set(this.subarray(start, start + len), targetStart)
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

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

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
      codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
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
},{"base64-js":2,"ieee754":3,"is-array":4}],2:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],5:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],6:[function(require,module,exports){

module.exports = require('./src')


},{"./src":27}],7:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],8:[function(require,module,exports){
/*! svg.draggable.js - v1.0.0 - 2015-06-12
* https://github.com/wout/svg.draggable.js
* Copyright (c) 2015 Wout Fierens; Licensed MIT */
;(function() {

  SVG.extend(SVG.Element, {
    // Make element draggable
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    draggable: function(value, constraint, undefined) {
      var start, drag, end, element = this,
        parent = this.parent(SVG.Nested) || this.parent(SVG.Doc),
        parameter = {}

      /* Check the parameters and reassign if needed */
      if (typeof value == 'function' || typeof value == 'object') {
        constraint = value
        value = true
      }

      /* When no parameter is given, our value is true */
      value = value === undefined ? true : value
      constraint = constraint || {}

      if(element.remember('_draggable')){
        element.remember('_draggable', constraint)
        return;
      }
      
      /* Remember the constraints on the element because they would be overwritten by the next draggable-call otherwise */
      element.remember('_draggable', constraint)

      /* start dragging */
      start = function(event) {

        /* invoke any callbacks */
        element.fire('beforedrag', {
          event: event
        })

        /* get element bounding box */
        var box = element.bbox()

        if (element instanceof SVG.G) {
          box.x = element.x()
          box.y = element.y()

        } else if (element instanceof SVG.Nested) {
            box = element.rbox()
          /*box = {
            x: element.x(),
            y: element.y(),
            width: element.width(),
            height: element.height()
          }*/
          
        }

        /* store event and start position */
        parameter = {
          event: event,
          position: {
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
            zoom: parent.viewbox().zoom,
            rotation: element.transform().rotation * Math.PI / 180
          }
        }

        /* add while and end events to window */
        SVG.on(window, 'mousemove.drag', drag)
        SVG.on(window, 'mouseup.drag', end)

        /* invoke any callbacks */
        element.fire('dragstart', parameter)

        /* prevent selection dragging */
        event.preventDefault()
      }

      /* while dragging */
      drag = function(event) {

        var x, y, constraint = element.remember('_draggable'),
          rotation = parameter.position.rotation,
          width = parameter.position.width,
          height = parameter.position.height,
          delta = {
            x: event.pageX - parameter.event.pageX,
            y: event.pageY - parameter.event.pageY,
            zoom: parameter.position.zoom
          }
          
          
        element.fire('dragmove', {
          delta: delta,
          event: event
        })

        /* caculate new position [with rotation correction] */
        x = parameter.position.x + (delta.x * Math.cos(rotation) + delta.y * Math.sin(rotation)) / parameter.position.zoom
        y = parameter.position.y + (delta.y * Math.cos(rotation) + delta.x * Math.sin(-rotation)) / parameter.position.zoom

        /* move the element to its new position, if possible by constraint */
        if (typeof constraint == 'function') {

          var coord = constraint.call(element, x, y)

          /* bool just show us if movement is allowed or not */
          if (typeof coord == 'boolean') {
            coord = {
              x: coord,
              y: coord
            }
          }

          /* if true, we just move. If !false its a number and we move it there */
          if (coord.x === true) {
            element.x(x)
          } else if (coord.x !== false) {
            element.x(coords.x)
          }

          if (coord.y === true) {
            element.y(y)
          } else if (coord.y !== false) {
            element.y(coords.y)
          }

        } else if (typeof constraint == 'object') {

          /* keep element within constrained box */
          if (constraint.minX != null && x < constraint.minX)
            x = constraint.minX
          else if (constraint.maxX != null && x > constraint.maxX - width)
            x = constraint.maxX - width

          if (constraint.minY != null && y < constraint.minY)
            y = constraint.minY
          else if (constraint.maxY != null && y > constraint.maxY - height)
            y = constraint.maxY - height

          element.move(x, y)
        }



      }

      /* when dragging ends */
      end = function(event) {

        /* calculate move position */
        var delta = {
          x: event.pageX - parameter.event.pageX,
          y: event.pageY - parameter.event.pageY,
          zoom: parameter.position.zoom
        }

        /* remove while and end events to window */
        SVG.off(window, 'mousemove.drag', drag)
        SVG.off(window, 'mouseup.drag', end)

        /* invoke any callbacks */
        element.fire('dragend', {
          delta: delta,
          event: event
        })
      }

      if (!value) {
        element.off('mousedown.drag')
        SVG.off(window, 'mousemove.drag')
        SVG.off(window, 'mouseup.drag')

        start = drag = end = null
        element.forget('_draggable')
        return this
      }

      /* bind mousedown event */
      element.on('mousedown.drag', start)

      return this
    }

  })

}).call(this);
},{}],9:[function(require,module,exports){
/*! svg.foreignobject.js - v1.0.0 - 2015-06-14
* https://github.com/fibo/svg.foreignobject.js
* Copyright (c) 2015 Wout Fierens; Licensed MIT */
SVG.ForiegnObject = function() {
  this.constructor.call(this, SVG.create('foreignObject'))

  /* store type */
  this.type = 'foreignObject'
}

SVG.ForiegnObject.prototype = new SVG.Shape()

SVG.extend(SVG.ForiegnObject, {
  appendChild: function (child, attrs) {
    var newChild = typeof(child)=='string' ? document.createElement(child) : child
    if (typeof(attrs)=='object'){
      for(var a in attrs) newChild[a] = attrs[a]
    }
    this.node.appendChild(newChild)
    return this
  },
  getChild: function (index) {
    return this.node.childNodes[index]
  }
})

SVG.extend(SVG.Container, {
  foreignObject: function(width, height) {
    return this.put(new SVG.ForiegnObject()).size(width === null ? 100 : width, height === null ? 100 : height)
  }
})

},{}],10:[function(require,module,exports){
/*!
* svg.js - A lightweight library for manipulating and animating SVG.
* @version 2.1.1
* http://www.svgjs.com
*
* @copyright Wout Fierens <wout@impinc.co.uk>
* @license MIT
*
* BUILT: Fri Oct 09 2015 14:46:55 GMT-0400 (EDT)
*/;

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.SVG = factory();
  }
}(this, function(require, exports, module) {

// The main wrapping element
var SVG = this.SVG = function(element) {
  if (SVG.supported) {
    element = new SVG.Doc(element)

    if (!SVG.parser)
      SVG.prepare(element)

    return element
  }
}

// Default namespaces
SVG.ns    = 'http://www.w3.org/2000/svg'
SVG.xmlns = 'http://www.w3.org/2000/xmlns/'
SVG.xlink = 'http://www.w3.org/1999/xlink'

// Svg support test
SVG.supported = (function() {
  return !! document.createElementNS &&
         !! document.createElementNS(SVG.ns,'svg').createSVGRect
})()

// Don't bother to continue if SVG is not supported 
if (!SVG.supported) return false

// Element id sequence
SVG.did  = 1000

// Get next named element id
SVG.eid = function(name) {
  return 'Svgjs' + capitalize(name) + (SVG.did++)
}

// Method for element creation
SVG.create = function(name) {
  // create element
  var element = document.createElementNS(this.ns, name)
  
  // apply unique id
  element.setAttribute('id', this.eid(name))
  
  return element
}

// Method for extending objects
SVG.extend = function() {
  var modules, methods, key, i
  
  // Get list of modules
  modules = [].slice.call(arguments)
  
  // Get object with extensions
  methods = modules.pop()
  
  for (i = modules.length - 1; i >= 0; i--)
    if (modules[i])
      for (key in methods)
        modules[i].prototype[key] = methods[key]

  // Make sure SVG.Set inherits any newly added methods
  if (SVG.Set && SVG.Set.inherit)
    SVG.Set.inherit()
}

// Invent new element
SVG.invent = function(config) {
  // Create element initializer
  var initializer = typeof config.create == 'function' ?
    config.create :
    function() {
      this.constructor.call(this, SVG.create(config.create))
    }

  // Inherit prototype
  if (config.inherit)
    initializer.prototype = new config.inherit

  // Extend with methods
  if (config.extend)
    SVG.extend(initializer, config.extend)

  // Attach construct method to parent
  if (config.construct)
    SVG.extend(config.parent || SVG.Container, config.construct)

  return initializer
}

// Adopt existing svg elements
SVG.adopt = function(node) {
  // make sure a node isn't already adopted
  if (node.instance) return node.instance

  // initialize variables
  var element

  // adopt with element-specific settings
  if (node.nodeName == 'svg')
    element = node.parentNode instanceof SVGElement ? new SVG.Nested : new SVG.Doc
  else if (node.nodeName == 'linearGradient')
    element = new SVG.Gradient('linear')
  else if (node.nodeName == 'radialGradient')
    element = new SVG.Gradient('radial')
  else if (SVG[capitalize(node.nodeName)])
    element = new SVG[capitalize(node.nodeName)]
  else
    element = new SVG.Element(node)

  // ensure references
  element.type  = node.nodeName
  element.node  = node
  node.instance = element

  // SVG.Class specific preparations
  if (element instanceof SVG.Doc)
    element.namespace().defs()

  return element
}

// Initialize parsing element
SVG.prepare = function(element) {
  // Select document body and create invisible svg element
  var body = document.getElementsByTagName('body')[0]
    , draw = (body ? new SVG.Doc(body) : element.nested()).size(2, 0)
    , path = SVG.create('path')

  // Insert parsers
  draw.node.appendChild(path)

  // Create parser object
  SVG.parser = {
    body: body || element.parent()
  , draw: draw.style('opacity:0;position:fixed;left:100%;top:100%;overflow:hidden')
  , poly: draw.polyline().node
  , path: path
  }
}

// Storage for regular expressions
SVG.regex = {
  // Parse unit value
  unit:             /^(-?[\d\.]+)([a-z%]{0,2})$/
  
  // Parse hex value
, hex:              /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
  
  // Parse rgb value
, rgb:              /rgb\((\d+),(\d+),(\d+)\)/
  
  // Parse reference id
, reference:        /#([a-z0-9\-_]+)/i
  
  // Parse matrix wrapper
, matrix:           /matrix\(|\)/g

  // Elements of a matrix
, matrixElements:   /,*\s+|,/
  
  // Whitespace
, whitespace:       /\s/g

  // Test hex value
, isHex:            /^#[a-f0-9]{3,6}$/i
  
  // Test rgb value
, isRgb:            /^rgb\(/
  
  // Test css declaration
, isCss:            /[^:]+:[^;]+;?/
  
  // Test for blank string
, isBlank:          /^(\s+)?$/
  
  // Test for numeric string
, isNumber:         /^-?[\d\.]+$/

  // Test for percent value
, isPercent:        /^-?[\d\.]+%$/

  // Test for image url
, isImage:          /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i

}
SVG.utils = {
    // Map function
    map: function(array, block) {
    var i
      , il = array.length
      , result = []
    
    for (i = 0; i < il; i++)
      result.push(block(array[i]))
    
    return result
  }

  // Degrees to radians
, radians: function(d) {
    return d % 360 * Math.PI / 180
  }
  // Radians to degrees
, degrees: function(r) {
    return r * 180 / Math.PI % 360
  }
, filterSVGElements: function(p) {
    return [].filter.call(p, function(el){ return el instanceof SVGElement })
  }

}

SVG.defaults = {
  // Default attribute values
  attrs: {
    /* fill and stroke */
    'fill-opacity':     1
  , 'stroke-opacity':   1
  , 'stroke-width':     0
  , 'stroke-linejoin':  'miter'
  , 'stroke-linecap':   'butt'
  , fill:               '#000000'
  , stroke:             '#000000'
  , opacity:            1
    /* position */
  , x:                  0
  , y:                  0
  , cx:                 0
  , cy:                 0
    /* size */  
  , width:              0
  , height:             0
    /* radius */  
  , r:                  0
  , rx:                 0
  , ry:                 0
    /* gradient */  
  , offset:             0
  , 'stop-opacity':     1
  , 'stop-color':       '#000000'
    /* text */
  , 'font-size':        16
  , 'font-family':      'Helvetica, Arial, sans-serif'
  , 'text-anchor':      'start'
  }
  
}
// Module for color convertions
SVG.Color = function(color) {
  var match
  
  /* initialize defaults */
  this.r = 0
  this.g = 0
  this.b = 0
  
  /* parse color */
  if (typeof color === 'string') {
    if (SVG.regex.isRgb.test(color)) {
      /* get rgb values */
      match = SVG.regex.rgb.exec(color.replace(/\s/g,''))
      
      /* parse numeric values */
      this.r = parseInt(match[1])
      this.g = parseInt(match[2])
      this.b = parseInt(match[3])
      
    } else if (SVG.regex.isHex.test(color)) {
      /* get hex values */
      match = SVG.regex.hex.exec(fullHex(color))

      /* parse numeric values */
      this.r = parseInt(match[1], 16)
      this.g = parseInt(match[2], 16)
      this.b = parseInt(match[3], 16)

    }
    
  } else if (typeof color === 'object') {
    this.r = color.r
    this.g = color.g
    this.b = color.b
    
  }
    
}

SVG.extend(SVG.Color, {
  // Default to hex conversion
  toString: function() {
    return this.toHex()
  }
  // Build hex value
, toHex: function() {
    return '#'
      + compToHex(this.r)
      + compToHex(this.g)
      + compToHex(this.b)
  }
  // Build rgb value
, toRgb: function() {
    return 'rgb(' + [this.r, this.g, this.b].join() + ')'
  }
  // Calculate true brightness
, brightness: function() {
    return (this.r / 255 * 0.30)
         + (this.g / 255 * 0.59)
         + (this.b / 255 * 0.11)
  }
  // Make color morphable
, morph: function(color) {
    this.destination = new SVG.Color(color)

    return this
  }
  // Get morphed color at given position
, at: function(pos) {
    /* make sure a destination is defined */
    if (!this.destination) return this

    /* normalise pos */
    pos = pos < 0 ? 0 : pos > 1 ? 1 : pos

    /* generate morphed color */
    return new SVG.Color({
      r: ~~(this.r + (this.destination.r - this.r) * pos)
    , g: ~~(this.g + (this.destination.g - this.g) * pos)
    , b: ~~(this.b + (this.destination.b - this.b) * pos)
    })
  }
  
})

// Testers

// Test if given value is a color string
SVG.Color.test = function(color) {
  color += ''
  return SVG.regex.isHex.test(color)
      || SVG.regex.isRgb.test(color)
}

// Test if given value is a rgb object
SVG.Color.isRgb = function(color) {
  return color && typeof color.r == 'number'
               && typeof color.g == 'number'
               && typeof color.b == 'number'
}

// Test if given value is a color
SVG.Color.isColor = function(color) {
  return SVG.Color.isRgb(color) || SVG.Color.test(color)
}
// Module for array conversion
SVG.Array = function(array, fallback) {
  array = (array || []).valueOf()

  /* if array is empty and fallback is provided, use fallback */
  if (array.length == 0 && fallback)
    array = fallback.valueOf()

  /* parse array */
  this.value = this.parse(array)
}

SVG.extend(SVG.Array, {
  // Make array morphable
  morph: function(array) {
    this.destination = this.parse(array)

    /* normalize length of arrays */
    if (this.value.length != this.destination.length) {
      var lastValue       = this.value[this.value.length - 1]
        , lastDestination = this.destination[this.destination.length - 1]

      while(this.value.length > this.destination.length)
        this.destination.push(lastDestination)
      while(this.value.length < this.destination.length)
        this.value.push(lastValue)
    }
    
    return this
  }
  // Clean up any duplicate points
, settle: function() {
    /* find all unique values */
    for (var i = 0, il = this.value.length, seen = []; i < il; i++)
      if (seen.indexOf(this.value[i]) == -1)
        seen.push(this.value[i])

    /* set new value */
    return this.value = seen
  }
  // Get morphed array at given position
, at: function(pos) {
    /* make sure a destination is defined */
    if (!this.destination) return this

    /* generate morphed array */
    for (var i = 0, il = this.value.length, array = []; i < il; i++)
      array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos)

    return new SVG.Array(array)
  }
  // Convert array to string
, toString: function() {
    return this.value.join(' ')
  }
  // Real value
, valueOf: function() {
    return this.value
  }
  // Parse whitespace separated string
, parse: function(array) {
    array = array.valueOf()

    /* if already is an array, no need to parse it */
    if (Array.isArray(array)) return array

    return this.split(array)
  }
  // Strip unnecessary whitespace
, split: function(string) {
    return string.trim().split(/\s+/)
  }
  // Reverse array
, reverse: function() {
    this.value.reverse()

    return this
  }

})
// Poly points array
SVG.PointArray = function(array, fallback) {
  this.constructor.call(this, array, fallback || [[0,0]])
}

// Inherit from SVG.Array
SVG.PointArray.prototype = new SVG.Array

SVG.extend(SVG.PointArray, {
  // Convert array to string
  toString: function() {
    /* convert to a poly point string */
    for (var i = 0, il = this.value.length, array = []; i < il; i++)
      array.push(this.value[i].join(','))

    return array.join(' ')
  }
  // Convert array to line object
, toLine: function() {
    return {
      x1: this.value[0][0]
    , y1: this.value[0][1]
    , x2: this.value[1][0]
    , y2: this.value[1][1]
    }
  }
  // Get morphed array at given position
, at: function(pos) {
    /* make sure a destination is defined */
    if (!this.destination) return this

    /* generate morphed point string */
    for (var i = 0, il = this.value.length, array = []; i < il; i++)
      array.push([
        this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos
      , this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos
      ])

    return new SVG.PointArray(array)
  }
  // Parse point string
, parse: function(array) {
    array = array.valueOf()

    /* if already is an array, no need to parse it */
    if (Array.isArray(array)) return array

    /* split points */
    array = this.split(array)

    /* parse points */
    for (var i = 0, il = array.length, p, points = []; i < il; i++) {
      p = array[i].split(',')
      points.push([parseFloat(p[0]), parseFloat(p[1])])
    }

    return points
  }
  // Move point string
, move: function(x, y) {
    var box = this.bbox()

    /* get relative offset */
    x -= box.x
    y -= box.y

    /* move every point */
    if (!isNaN(x) && !isNaN(y))
      for (var i = this.value.length - 1; i >= 0; i--)
        this.value[i] = [this.value[i][0] + x, this.value[i][1] + y]

    return this
  }
  // Resize poly string
, size: function(width, height) {
    var i, box = this.bbox()

    /* recalculate position of all points according to new size */
    for (i = this.value.length - 1; i >= 0; i--) {
      this.value[i][0] = ((this.value[i][0] - box.x) * width)  / box.width  + box.x
      this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y
    }

    return this
  }
  // Get bounding box of points
, bbox: function() {
    SVG.parser.poly.setAttribute('points', this.toString())

    return SVG.parser.poly.getBBox()
  }

})
// Path points array
SVG.PathArray = function(array, fallback) {
  this.constructor.call(this, array, fallback || [['M', 0, 0]])
}

// Inherit from SVG.Array
SVG.PathArray.prototype = new SVG.Array

SVG.extend(SVG.PathArray, {
  // Convert array to string
  toString: function() {
    return arrayToString(this.value)
  }
  // Move path string
, move: function(x, y) {
		/* get bounding box of current situation */
		var box = this.bbox()
		
    /* get relative offset */
    x -= box.x
    y -= box.y

    if (!isNaN(x) && !isNaN(y)) {
      /* move every point */
      for (var l, i = this.value.length - 1; i >= 0; i--) {
        l = this.value[i][0]

        if (l == 'M' || l == 'L' || l == 'T')  {
          this.value[i][1] += x
          this.value[i][2] += y

        } else if (l == 'H')  {
          this.value[i][1] += x

        } else if (l == 'V')  {
          this.value[i][1] += y

        } else if (l == 'C' || l == 'S' || l == 'Q')  {
          this.value[i][1] += x
          this.value[i][2] += y
          this.value[i][3] += x
          this.value[i][4] += y

          if (l == 'C')  {
            this.value[i][5] += x
            this.value[i][6] += y
          }

        } else if (l == 'A')  {
          this.value[i][6] += x
          this.value[i][7] += y
        }

      }
    }

    return this
  }
  // Resize path string
, size: function(width, height) {
		/* get bounding box of current situation */
		var i, l, box = this.bbox()

    /* recalculate position of all points according to new size */
    for (i = this.value.length - 1; i >= 0; i--) {
      l = this.value[i][0]

      if (l == 'M' || l == 'L' || l == 'T')  {
        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y

      } else if (l == 'H')  {
        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x

      } else if (l == 'V')  {
        this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y

      } else if (l == 'C' || l == 'S' || l == 'Q')  {
        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
        this.value[i][3] = ((this.value[i][3] - box.x) * width)  / box.width  + box.x
        this.value[i][4] = ((this.value[i][4] - box.y) * height) / box.height + box.y

        if (l == 'C')  {
          this.value[i][5] = ((this.value[i][5] - box.x) * width)  / box.width  + box.x
          this.value[i][6] = ((this.value[i][6] - box.y) * height) / box.height + box.y
        }

      } else if (l == 'A')  {
        /* resize radii */
        this.value[i][1] = (this.value[i][1] * width)  / box.width
        this.value[i][2] = (this.value[i][2] * height) / box.height

        /* move position values */
        this.value[i][6] = ((this.value[i][6] - box.x) * width)  / box.width  + box.x
        this.value[i][7] = ((this.value[i][7] - box.y) * height) / box.height + box.y
      }

    }

    return this
  }
  // Absolutize and parse path to array
, parse: function(array) {
    /* if it's already is a patharray, no need to parse it */
    if (array instanceof SVG.PathArray) return array.valueOf()

    /* prepare for parsing */
    var i, il, x0, y0, x1, y1, x2, y2, s, seg, segs
      , x = 0
      , y = 0
    
    /* populate working path */
    SVG.parser.path.setAttribute('d', typeof array === 'string' ? array : arrayToString(array))
    
    /* get segments */
    segs = SVG.parser.path.pathSegList

    for (i = 0, il = segs.numberOfItems; i < il; ++i) {
      seg = segs.getItem(i)
      s = seg.pathSegTypeAsLetter

      /* yes, this IS quite verbose but also about 30 times faster than .test() with a precompiled regex */
      if (s == 'M' || s == 'L' || s == 'H' || s == 'V' || s == 'C' || s == 'S' || s == 'Q' || s == 'T' || s == 'A') {
        if ('x' in seg) x = seg.x
        if ('y' in seg) y = seg.y

      } else {
        if ('x1' in seg) x1 = x + seg.x1
        if ('x2' in seg) x2 = x + seg.x2
        if ('y1' in seg) y1 = y + seg.y1
        if ('y2' in seg) y2 = y + seg.y2
        if ('x'  in seg) x += seg.x
        if ('y'  in seg) y += seg.y

        if (s == 'm')
          segs.replaceItem(SVG.parser.path.createSVGPathSegMovetoAbs(x, y), i)
        else if (s == 'l')
          segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoAbs(x, y), i)
        else if (s == 'h')
          segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoHorizontalAbs(x), i)
        else if (s == 'v')
          segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoVerticalAbs(y), i)
        else if (s == 'c')
          segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i)
        else if (s == 's')
          segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i)
        else if (s == 'q')
          segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i)
        else if (s == 't')
          segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i)
        else if (s == 'a')
          segs.replaceItem(SVG.parser.path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i)
        else if (s == 'z' || s == 'Z') {
          x = x0
          y = y0
        }
      }

      /* record the start of a subpath */
      if (s == 'M' || s == 'm') {
        x0 = x
        y0 = y
      }
    }

    /* build internal representation */
    array = []
    segs  = SVG.parser.path.pathSegList
    
    for (i = 0, il = segs.numberOfItems; i < il; ++i) {
      seg = segs.getItem(i)
      s = seg.pathSegTypeAsLetter
      x = [s]

      if (s == 'M' || s == 'L' || s == 'T')
        x.push(seg.x, seg.y)
      else if (s == 'H')
        x.push(seg.x)
      else if (s == 'V')
        x.push(seg.y)
      else if (s == 'C')
        x.push(seg.x1, seg.y1, seg.x2, seg.y2, seg.x, seg.y)
      else if (s == 'S')
        x.push(seg.x2, seg.y2, seg.x, seg.y)
      else if (s == 'Q')
        x.push(seg.x1, seg.y1, seg.x, seg.y)
      else if (s == 'A')
        x.push(seg.r1, seg.r2, seg.angle, seg.largeArcFlag | 0, seg.sweepFlag | 0, seg.x, seg.y)

      /* store segment */
      array.push(x)
    }
    
    return array
  }
  // Get bounding box of path
, bbox: function() {
    SVG.parser.path.setAttribute('d', this.toString())

    return SVG.parser.path.getBBox()
  }

})
// Module for unit convertions
SVG.Number = SVG.invent({
  // Initialize
  create: function(value, unit) {
    // initialize defaults
    this.value = 0
    this.unit  = unit || ''

    // parse value
    if (typeof value === 'number') {
      // ensure a valid numeric value
      this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value

    } else if (typeof value === 'string') {
      unit = value.match(SVG.regex.unit)

      if (unit) {
        // make value numeric
        this.value = parseFloat(unit[1])
      
        // normalize
        if (unit[2] == '%')
          this.value /= 100
        else if (unit[2] == 's')
          this.value *= 1000
      
        // store unit
        this.unit = unit[2]
      }

    } else {
      if (value instanceof SVG.Number) {
        this.value = value.valueOf()
        this.unit  = value.unit
      }
    }

  }
  // Add methods
, extend: {
    // Stringalize
    toString: function() {
      return (
        this.unit == '%' ?
          ~~(this.value * 1e8) / 1e6:
        this.unit == 's' ?
          this.value / 1e3 :
          this.value
      ) + this.unit
    }
  , // Convert to primitive
    valueOf: function() {
      return this.value
    }
    // Add number
  , plus: function(number) {
      return new SVG.Number(this + new SVG.Number(number), this.unit)
    }
    // Subtract number
  , minus: function(number) {
      return this.plus(-new SVG.Number(number))
    }
    // Multiply number
  , times: function(number) {
      return new SVG.Number(this * new SVG.Number(number), this.unit)
    }
    // Divide number
  , divide: function(number) {
      return new SVG.Number(this / new SVG.Number(number), this.unit)
    }
    // Convert to different unit
  , to: function(unit) {
      var number = new SVG.Number(this)
      
      if (typeof unit === 'string')
        number.unit = unit

      return number
    }
    // Make number morphable
  , morph: function(number) {
      this.destination = new SVG.Number(number)

      return this
    }
    // Get morphed number at given position
  , at: function(pos) {
      // Make sure a destination is defined
      if (!this.destination) return this

      // Generate new morphed number
      return new SVG.Number(this.destination)
          .minus(this)
          .times(pos)
          .plus(this)
    }

  }
})

SVG.ViewBox = function(element) {
  var x, y, width, height
    , wm   = 1 /* width multiplier */
    , hm   = 1 /* height multiplier */
    , box  = element.bbox()
    , view = (element.attr('viewBox') || '').match(/-?[\d\.]+/g)
    , we   = element
    , he   = element

  /* get dimensions of current node */
  width  = new SVG.Number(element.width())
  height = new SVG.Number(element.height())

  /* find nearest non-percentual dimensions */
  while (width.unit == '%') {
    wm *= width.value
    width = new SVG.Number(we instanceof SVG.Doc ? we.parent().offsetWidth : we.parent().width())
    we = we.parent()
  }
  while (height.unit == '%') {
    hm *= height.value
    height = new SVG.Number(he instanceof SVG.Doc ? he.parent().offsetHeight : he.parent().height())
    he = he.parent()
  }
  
  /* ensure defaults */
  this.x      = box.x
  this.y      = box.y
  this.width  = width  * wm
  this.height = height * hm
  this.zoom   = 1
  
  if (view) {
    /* get width and height from viewbox */
    x      = parseFloat(view[0])
    y      = parseFloat(view[1])
    width  = parseFloat(view[2])
    height = parseFloat(view[3])
    
    /* calculate zoom accoring to viewbox */
    this.zoom = ((this.width / this.height) > (width / height)) ?
      this.height / height :
      this.width  / width

    /* calculate real pixel dimensions on parent SVG.Doc element */
    this.x      = x
    this.y      = y
    this.width  = width
    this.height = height
    
  }
  
}

//
SVG.extend(SVG.ViewBox, {
  // Parse viewbox to string
  toString: function() {
    return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
  }
  
})

SVG.Element = SVG.invent({
  // Initialize node
  create: function(node) {
    // make stroke value accessible dynamically
    this._stroke = SVG.defaults.attrs.stroke

    // create circular reference
    if (this.node = node) {
      this.type = node.nodeName
      this.node.instance = this

      // store current attribute value
      this._stroke = node.getAttribute('stroke') || this._stroke
    }
  }

  // Add class methods
, extend: {
    // Move over x-axis
    x: function(x) {
      return this.attr('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      return this.attr('y', y)
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2)
    }
    // Move element to given x and y values
  , move: function(x, y) {
      return this.x(x).y(y)
    }
    // Move element by its center
  , center: function(x, y) {
      return this.cx(x).cy(y)
    }
    // Set width of element
  , width: function(width) {
      return this.attr('width', width)
    }
    // Set height of element
  , height: function(height) {
      return this.attr('height', height)
    }
    // Set element size to given width and height
  , size: function(width, height) {
      var p = proportionalSize(this.bbox(), width, height)

      return this
        .width(new SVG.Number(p.width))
        .height(new SVG.Number(p.height))
    }
    // Clone element
  , clone: function() {
      // clone element and assign new id
      var clone = assignNewId(this.node.cloneNode(true))

      // insert the clone after myself
      this.after(clone)

      return clone
    }
    // Remove element
  , remove: function() {
      if (this.parent())
        this.parent().removeElement(this)

      return this
    }
    // Replace element
  , replace: function(element) {
      this.after(element).remove()

      return element
    }
    // Add element to given container and return self
  , addTo: function(parent) {
      return parent.put(this)
    }
    // Add element to given container and return container
  , putIn: function(parent) {
      return parent.add(this)
    }
    // Get / set id
  , id: function(id) {
      return this.attr('id', id)
    }
    // Checks whether the given point inside the bounding box of the element
  , inside: function(x, y) {
      var box = this.bbox()

      return x > box.x
          && y > box.y
          && x < box.x + box.width
          && y < box.y + box.height
    }
    // Show element
  , show: function() {
      return this.style('display', '')
    }
    // Hide element
  , hide: function() {
      return this.style('display', 'none')
    }
    // Is element visible?
  , visible: function() {
      return this.style('display') != 'none'
    }
    // Return id on string conversion
  , toString: function() {
      return this.attr('id')
    }
    // Return array of classes on the node
  , classes: function() {
      var attr = this.attr('class')

      return attr == null ? [] : attr.trim().split(/\s+/)
    }
    // Return true if class exists on the node, false otherwise
  , hasClass: function(name) {
      return this.classes().indexOf(name) != -1
    }
    // Add class to the node
  , addClass: function(name) {
      if (!this.hasClass(name)) {
        var array = this.classes()
        array.push(name)
        this.attr('class', array.join(' '))
      }

      return this
    }
    // Remove class from the node
  , removeClass: function(name) {
      if (this.hasClass(name)) {
        this.attr('class', this.classes().filter(function(c) {
          return c != name
        }).join(' '))
      }

      return this
    }
    // Toggle the presence of a class on the node
  , toggleClass: function(name) {
      return this.hasClass(name) ? this.removeClass(name) : this.addClass(name)
    }
    // Get referenced element form attribute value
  , reference: function(attr) {
      return SVG.get(this.attr(attr))
    }
    // Returns the parent element instance
  , parent: function(type) {
      if (this.node.parentNode) {
        // get parent element
        var parent = SVG.adopt(this.node.parentNode)

        // if a specific type is given, find a parent with that class
        if (type)
          while (!(parent instanceof type) && parent.node.parentNode instanceof SVGElement)
            parent = SVG.adopt(parent.node.parentNode)

        return parent
      }
    }
    // Get parent document
  , doc: function(type) {
      return this instanceof SVG.Doc ? this : this.parent(SVG.Doc)
    }
    // Returns the svg node to call native svg methods on it
  , native: function() {
      return this.node
    }
    // Import raw svg
  , svg: function(svg) {
      // create temporary holder
      var well = document.createElement('svg')

      // act as a setter if svg is given
      if (svg && this instanceof SVG.Parent) {
        // dump raw svg
        well.innerHTML = '<svg>' + svg.replace(/\n/, '').replace(/<(\w+)([^<]+?)\/>/g, '<$1$2></$1>') + '</svg>'

        // transplant nodes
        for (var i = 0, il = well.firstChild.childNodes.length; i < il; i++)
          this.node.appendChild(well.firstChild.firstChild)

      // otherwise act as a getter
      } else {
        // create a wrapping svg element in case of partial content
        well.appendChild(svg = document.createElement('svg'))

        // insert a copy of this node
        svg.appendChild(this.node.cloneNode(true))

        // return target element
        return well.innerHTML.replace(/^<svg>/, '').replace(/<\/svg>$/, '')
      }

      return this
    }
  }
})

SVG.FX = SVG.invent({
  // Initialize FX object
  create: function(element) {
    // store target element
    this.target = element
  }

  // Add class methods
, extend: {
    // Add animation parameters and start animation
    animate: function(d, ease, delay) {
      var akeys, skeys, key
        , element = this.target
        , fx = this
      
      // dissect object if one is passed
      if (typeof d == 'object') {
        delay = d.delay
        ease = d.ease
        d = d.duration
      }

      // ensure default duration and easing
      d = d == '=' ? d : d == null ? 1000 : new SVG.Number(d).valueOf()
      ease = ease || '<>'

      // process values
      fx.at = function(pos) {
        var i

        // normalise pos
        pos = pos < 0 ? 0 : pos > 1 ? 1 : pos

        // collect attribute keys
        if (akeys == null) {
          akeys = []
          for (key in fx.attrs)
            akeys.push(key)

          // make sure morphable elements are scaled, translated and morphed all together
          if (element.morphArray && (fx.destination.plot || akeys.indexOf('points') > -1)) {
            // get destination
            var box
              , p = new element.morphArray(fx.destination.plot || fx.attrs.points || element.array())

            // add size
            if (fx.destination.size)
              p.size(fx.destination.size.width.to, fx.destination.size.height.to)

            // add movement
            box = p.bbox()
            if (fx.destination.x)
              p.move(fx.destination.x.to, box.y)
            else if (fx.destination.cx)
              p.move(fx.destination.cx.to - box.width / 2, box.y)

            box = p.bbox()
            if (fx.destination.y)
              p.move(box.x, fx.destination.y.to)
            else if (fx.destination.cy)
              p.move(box.x, fx.destination.cy.to - box.height / 2)

            // reset destination values
            fx.destination = {
              plot: element.array().morph(p)
            }
          }
        }

        // collect style keys
        if (skeys == null) {
          skeys = []
          for (key in fx.styles)
            skeys.push(key)
        }

        // apply easing
        pos = ease == '<>' ?
          (-Math.cos(pos * Math.PI) / 2) + 0.5 :
        ease == '>' ?
          Math.sin(pos * Math.PI / 2) :
        ease == '<' ?
          -Math.cos(pos * Math.PI / 2) + 1 :
        ease == '-' ?
          pos :
        typeof ease == 'function' ?
          ease(pos) :
          pos
        
        // run plot function
        if (fx.destination.plot) {
          element.plot(fx.destination.plot.at(pos))

        } else {
          // run all x-position properties
          if (fx.destination.x)
            element.x(fx.destination.x.at(pos))
          else if (fx.destination.cx)
            element.cx(fx.destination.cx.at(pos))

          // run all y-position properties
          if (fx.destination.y)
            element.y(fx.destination.y.at(pos))
          else if (fx.destination.cy)
            element.cy(fx.destination.cy.at(pos))

          // run all size properties
          if (fx.destination.size)
            element.size(fx.destination.size.width.at(pos), fx.destination.size.height.at(pos))
        }

        // run all viewbox properties
        if (fx.destination.viewbox)
          element.viewbox(
            fx.destination.viewbox.x.at(pos)
          , fx.destination.viewbox.y.at(pos)
          , fx.destination.viewbox.width.at(pos)
          , fx.destination.viewbox.height.at(pos)
          )

        // run leading property
        if (fx.destination.leading)
          element.leading(fx.destination.leading.at(pos))

        // animate attributes
        for (i = akeys.length - 1; i >= 0; i--)
          element.attr(akeys[i], at(fx.attrs[akeys[i]], pos))

        // animate styles
        for (i = skeys.length - 1; i >= 0; i--)
          element.style(skeys[i], at(fx.styles[skeys[i]], pos))

        // callback for each keyframe
        if (fx.situation.during)
          fx.situation.during.call(element, pos, function(from, to) {
            return at({ from: from, to: to }, pos)
          })
      }
      
      if (typeof d === 'number') {
        // delay animation
        this.timeout = setTimeout(function() {
          var start = new Date().getTime()

          // initialize situation object
          fx.situation.start    = start
          fx.situation.play     = true
          fx.situation.finish   = start + d
          fx.situation.duration = d
          fx.situation.ease     = ease

          // render function
          fx.render = function() {
            
            if (fx.situation.play === true) {
              // calculate pos
              var time = new Date().getTime()
                , pos = time > fx.situation.finish ? 1 : (time - fx.situation.start) / d

              // reverse pos if animation is reversed
              if (fx.situation.reversing)
                pos = -pos + 1
              
              // process values
              fx.at(pos)
              
              // finish off animation
              if (time > fx.situation.finish) {
                if (fx.destination.plot)
                  element.plot(new SVG.PointArray(fx.destination.plot.destination).settle())

                if (fx.situation.loop === true || (typeof fx.situation.loop == 'number' && fx.situation.loop > 0)) {
                  // register reverse
                  if (fx.situation.reverse)
                    fx.situation.reversing = !fx.situation.reversing

                  if (typeof fx.situation.loop == 'number') {
                    // reduce loop count
                    if (!fx.situation.reverse || fx.situation.reversing)
                      --fx.situation.loop

                    // remove last loop if reverse is disabled
                    if (!fx.situation.reverse && fx.situation.loop == 1)
                      --fx.situation.loop                      
                  }
                  
                  fx.animate(d, ease, delay)
                } else {
                  fx.situation.after ? fx.situation.after.apply(element, [fx]) : fx.stop()
                }

              } else {
                fx.animationFrame = requestAnimationFrame(fx.render)
              }
            } else {
              fx.animationFrame = requestAnimationFrame(fx.render)
            }
            
          }

          // start animation
          fx.render()
          
        }, new SVG.Number(delay).valueOf())
      }
      
      return this
    }
    // Get bounding box of target element
  , bbox: function() {
      return this.target.bbox()
    }
    // Add animatable attributes
  , attr: function(a, v) {
      // apply attributes individually
      if (typeof a == 'object') {
        for (var key in a)
          this.attr(key, a[key])
      
      } else {
        // get the current state
        var from = this.target.attr(a)

        // detect format
        if (a == 'transform') {
          // merge given transformation with an existing one
          if (this.attrs[a])
            v = this.attrs[a].destination.multiply(v)

          // prepare matrix for morphing
          this.attrs[a] = this.target.ctm().morph(v)

          // add parametric rotation values
          if (this.param) {
            // get initial rotation
            v = this.target.transform('rotation')

            // add param
            this.attrs[a].param = {
              from: this.target.param || { rotation: v, cx: this.param.cx, cy: this.param.cy }
            , to:   this.param
            }
          }

        } else {
          this.attrs[a] = SVG.Color.isColor(v) ?
            // prepare color for morphing
            new SVG.Color(from).morph(v) :
          SVG.regex.unit.test(v) ?
            // prepare number for morphing
            new SVG.Number(from).morph(v) :
            // prepare for plain morphing
            { from: from, to: v }
        }
      }
      
      return this
    }
    // Add animatable styles
  , style: function(s, v) {
      if (typeof s == 'object')
        for (var key in s)
          this.style(key, s[key])
      
      else
        this.styles[s] = { from: this.target.style(s), to: v }
      
      return this
    }
    // Animatable x-axis
  , x: function(x) {
      this.destination.x = new SVG.Number(this.target.x()).morph(x)
      
      return this
    }
    // Animatable y-axis
  , y: function(y) {
      this.destination.y = new SVG.Number(this.target.y()).morph(y)
      
      return this
    }
    // Animatable center x-axis
  , cx: function(x) {
      this.destination.cx = new SVG.Number(this.target.cx()).morph(x)
      
      return this
    }
    // Animatable center y-axis
  , cy: function(y) {
      this.destination.cy = new SVG.Number(this.target.cy()).morph(y)
      
      return this
    }
    // Add animatable move
  , move: function(x, y) {
      return this.x(x).y(y)
    }
    // Add animatable center
  , center: function(x, y) {
      return this.cx(x).cy(y)
    }
    // Add animatable size
  , size: function(width, height) {
      if (this.target instanceof SVG.Text) {
        // animate font size for Text elements
        this.attr('font-size', width)
        
      } else {
        // animate bbox based size for all other elements
        var box = this.target.bbox()

        this.destination.size = {
          width:  new SVG.Number(box.width).morph(width)
        , height: new SVG.Number(box.height).morph(height)
        }
      }
      
      return this
    }
    // Add animatable plot
  , plot: function(p) {
      this.destination.plot = p

      return this
    }
    // Add leading method
  , leading: function(value) {
      if (this.target.destination.leading)
        this.destination.leading = new SVG.Number(this.target.destination.leading).morph(value)

      return this
    }
    // Add animatable viewbox
  , viewbox: function(x, y, width, height) {
      if (this.target instanceof SVG.Container) {
        var box = this.target.viewbox()
        
        this.destination.viewbox = {
          x:      new SVG.Number(box.x).morph(x)
        , y:      new SVG.Number(box.y).morph(y)
        , width:  new SVG.Number(box.width).morph(width)
        , height: new SVG.Number(box.height).morph(height)
        }
      }
      
      return this
    }
    // Add animateable gradient update
  , update: function(o) {
      if (this.target instanceof SVG.Stop) {
        if (o.opacity != null) this.attr('stop-opacity', o.opacity)
        if (o.color   != null) this.attr('stop-color', o.color)
        if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))
      }

      return this
    }
    // Add callback for each keyframe
  , during: function(during) {
      this.situation.during = during
      
      return this
    }
    // Callback after animation
  , after: function(after) {
      this.situation.after = after
      
      return this
    }
    // Make loopable
  , loop: function(times, reverse) {
      // store current loop and total loops
      this.situation.loop = this.situation.loops = times || true

      // make reversable
      this.situation.reverse = !!reverse

      return this
    }
    // Stop running animation
  , stop: function(fulfill) {
      // fulfill animation
      if (fulfill === true) {

        this.animate(0)

        if (this.situation.after)
          this.situation.after.apply(this.target, [this])

      } else {
        // stop current animation
        clearTimeout(this.timeout)
        cancelAnimationFrame(this.animationFrame);

        // reset storage for properties
        this.attrs       = {}
        this.styles      = {}
        this.situation   = {}
        this.destination = {}
      }
      
      return this
    }
    // Pause running animation
  , pause: function() {
      if (this.situation.play === true) {
        this.situation.play  = false
        this.situation.pause = new Date().getTime()
      }

      return this
    }
    // Play running animation
  , play: function() {
      if (this.situation.play === false) {
        var pause = new Date().getTime() - this.situation.pause
        
        this.situation.finish += pause
        this.situation.start  += pause
        this.situation.play    = true
      }

      return this
    }
    
  }

  // Define parent class
, parent: SVG.Element

  // Add method to parent elements
, construct: {
    // Get fx module or create a new one, then animate with given duration and ease
    animate: function(d, ease, delay) {
      return (this.fx || (this.fx = new SVG.FX(this))).stop().animate(d, ease, delay)
    }
    // Stop current animation; this is an alias to the fx instance
  , stop: function(fulfill) {
      if (this.fx)
        this.fx.stop(fulfill)
      
      return this
    }
    // Pause current animation
  , pause: function() {
      if (this.fx)
        this.fx.pause()

      return this
    }
    // Play paused current animation
  , play: function() {
      if (this.fx)
        this.fx.play()

      return this
    }
    
  }
})

SVG.BBox = SVG.invent({
  // Initialize
  create: function(element) {
    // get values if element is given
    if (element) {
      var box

      // yes this is ugly, but Firefox can be a bitch when it comes to elements that are not yet rendered
      try {
        // find native bbox
        box = element.node.getBBox()
      } catch(e) {
        // mimic bbox
        box = {
          x:      element.node.clientLeft
        , y:      element.node.clientTop
        , width:  element.node.clientWidth
        , height: element.node.clientHeight
        }
      }
      
      // plain x and y
      this.x = box.x
      this.y = box.y

      // plain width and height
      this.width  = box.width
      this.height = box.height
    }

    // add center, right and bottom
    fullBox(this)
  }

  // Define Parent
, parent: SVG.Element

  // Constructor
, construct: {
    // Get bounding box
    bbox: function() {
      return new SVG.BBox(this)
    }
  }

})

SVG.TBox = SVG.invent({
  // Initialize
  create: function(element) {
    // get values if element is given
    if (element) {
      var t   = element.ctm().extract()
        , box = element.bbox()
      
      // width and height including transformations
      this.width  = box.width  * t.scaleX
      this.height = box.height * t.scaleY

      // x and y including transformations
      this.x = box.x + t.x
      this.y = box.y + t.y
    }

    // add center, right and bottom
    fullBox(this)
  }

  // Define Parent
, parent: SVG.Element

  // Constructor
, construct: {
    // Get transformed bounding box
    tbox: function() {
      return new SVG.TBox(this)
    }
  }

})


SVG.RBox = SVG.invent({
  // Initialize
  create: function(element) {
    if (element) {
      var e    = element.doc().parent()
        , box  = element.node.getBoundingClientRect()
        , zoom = 1
      
      // get screen offset
      this.x = box.left
      this.y = box.top
      
      // subtract parent offset
      this.x -= e.offsetLeft
      this.y -= e.offsetTop
      
      while (e = e.offsetParent) {
        this.x -= e.offsetLeft
        this.y -= e.offsetTop
      }
      
      // calculate cumulative zoom from svg documents
      e = element
      while (e.parent && (e = e.parent())) {
        if (e.viewbox) {
          zoom *= e.viewbox().zoom
          this.x -= e.x() || 0
          this.y -= e.y() || 0
        }
      }

      // recalculate viewbox distortion
      this.width  = box.width  /= zoom
      this.height = box.height /= zoom
    }
    
    // add center, right and bottom
    fullBox(this)

    // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
    this.x += window.scrollX
    this.y += window.scrollY
  }

  // define Parent
, parent: SVG.Element

  // Constructor
, construct: {
    // Get rect box
    rbox: function() {
      return new SVG.RBox(this)
    }
  }

})

// Add universal merge method
;[SVG.BBox, SVG.TBox, SVG.RBox].forEach(function(c) {

  SVG.extend(c, {
    // Merge rect box with another, return a new instance
    merge: function(box) {
      var b = new c()

      // merge boxes
      b.x      = Math.min(this.x, box.x)
      b.y      = Math.min(this.y, box.y)
      b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
      b.height = Math.max(this.y + this.height, box.y + box.height) - b.y
      
      return fullBox(b)
    }

  })

})

SVG.Matrix = SVG.invent({
  // Initialize
  create: function(source) {
    var i, base = arrayToMatrix([1, 0, 0, 1, 0, 0])

    // ensure source as object
    source = source instanceof SVG.Element ?
      source.matrixify() :
    typeof source === 'string' ?
      stringToMatrix(source) :
    arguments.length == 6 ?
      arrayToMatrix([].slice.call(arguments)) :
    typeof source === 'object' ?
      source : base

    // merge source
    for (i = abcdef.length - 1; i >= 0; i--)
      this[abcdef[i]] = source && typeof source[abcdef[i]] === 'number' ?
        source[abcdef[i]] : base[abcdef[i]]
  }

  // Add methods
, extend: {
    // Extract individual transformations
    extract: function() {
      // find delta transform points
      var px    = deltaTransformPoint(this, 0, 1)
        , py    = deltaTransformPoint(this, 1, 0)
        , skewX = 180 / Math.PI * Math.atan2(px.y, px.x) - 90

      return {
        // translation
        x:        this.e
      , y:        this.f
        // skew
      , skewX:    -skewX
      , skewY:    180 / Math.PI * Math.atan2(py.y, py.x)
        // scale
      , scaleX:   Math.sqrt(this.a * this.a + this.b * this.b)
      , scaleY:   Math.sqrt(this.c * this.c + this.d * this.d)
        // rotation
      , rotation: skewX
      }
    }
    // Clone matrix
  , clone: function() {
      return new SVG.Matrix(this)
    }
    // Morph one matrix into another
  , morph: function(matrix) {
      // store new destination
      this.destination = new SVG.Matrix(matrix)

      return this
    }
    // Get morphed matrix at a given position
  , at: function(pos) {
      // make sure a destination is defined
      if (!this.destination) return this

      // calculate morphed matrix at a given position
      var matrix = new SVG.Matrix({
        a: this.a + (this.destination.a - this.a) * pos
      , b: this.b + (this.destination.b - this.b) * pos
      , c: this.c + (this.destination.c - this.c) * pos
      , d: this.d + (this.destination.d - this.d) * pos
      , e: this.e + (this.destination.e - this.e) * pos
      , f: this.f + (this.destination.f - this.f) * pos
      })

      // process parametric rotation if present
      if (this.param && this.param.to) {
        // calculate current parametric position
        var param = {
          rotation: this.param.from.rotation + (this.param.to.rotation - this.param.from.rotation) * pos
        , cx:       this.param.from.cx
        , cy:       this.param.from.cy
        }

        // rotate matrix
        matrix = matrix.rotate(
          (this.param.to.rotation - this.param.from.rotation * 2) * pos
        , param.cx
        , param.cy
        )

        // store current parametric values
        matrix.param = param
      }

      return matrix
    }
    // Multiplies by given matrix
  , multiply: function(matrix) {
      return new SVG.Matrix(this.native().multiply(parseMatrix(matrix).native()))
    }
    // Inverses matrix
  , inverse: function() {
      return new SVG.Matrix(this.native().inverse())
    }
    // Translate matrix
  , translate: function(x, y) {
      return new SVG.Matrix(this.native().translate(x || 0, y || 0))
    }
    // Scale matrix
  , scale: function(x, y, cx, cy) {
      // support universal scale
      if (arguments.length == 1 || arguments.length == 3)
        y = x
      if (arguments.length == 3) {
        cy = cx
        cx = y
      }

      return this.around(cx, cy, new SVG.Matrix(x, 0, 0, y, 0, 0))
    }
    // Rotate matrix
  , rotate: function(r, cx, cy) {
      // convert degrees to radians
      r = SVG.utils.radians(r)

      return this.around(cx, cy, new SVG.Matrix(Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0))
    }
    // Flip matrix on x or y, at a given offset
  , flip: function(a, o) {
      return a == 'x' ? this.scale(-1, 1, o, 0) : this.scale(1, -1, 0, o)
    }
    // Skew
  , skew: function(x, y, cx, cy) {
      return this.around(cx, cy, this.native().skewX(x || 0).skewY(y || 0))
    }
    // SkewX
  , skewX: function(x, cx, cy) {
      return this.around(cx, cy, this.native().skewX(x || 0))
    }
    // SkewY
  , skewY: function(y, cx, cy) {
      return this.around(cx, cy, this.native().skewY(y || 0))
    }
    // Transform around a center point
  , around: function(cx, cy, matrix) {
      return this
        .multiply(new SVG.Matrix(1, 0, 0, 1, cx || 0, cy || 0))
        .multiply(matrix)
        .multiply(new SVG.Matrix(1, 0, 0, 1, -cx || 0, -cy || 0))
    }
    // Convert to native SVGMatrix
  , native: function() {
      // create new matrix
      var matrix = SVG.parser.draw.node.createSVGMatrix()

      // update with current values
      for (var i = abcdef.length - 1; i >= 0; i--)
        matrix[abcdef[i]] = this[abcdef[i]]

      return matrix
    }
    // Convert matrix to string
  , toString: function() {
      return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')'
    }
  }

  // Define parent
, parent: SVG.Element

  // Add parent method
, construct: {
    // Get current matrix
    ctm: function() {
      return new SVG.Matrix(this.node.getCTM())
    }

  }

})
SVG.extend(SVG.Element, {
  // Set svg element attribute
  attr: function(a, v, n) {
    // act as full getter
    if (a == null) {
      // get an object of attributes
      a = {}
      v = this.node.attributes
      for (n = v.length - 1; n >= 0; n--)
        a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue) ? parseFloat(v[n].nodeValue) : v[n].nodeValue
      
      return a
      
    } else if (typeof a == 'object') {
      // apply every attribute individually if an object is passed
      for (v in a) this.attr(v, a[v])
      
    } else if (v === null) {
        // remove value
        this.node.removeAttribute(a)
      
    } else if (v == null) {
      // act as a getter if the first and only argument is not an object
      v = this.node.getAttribute(a)
      return v == null ? 
        SVG.defaults.attrs[a] :
      SVG.regex.isNumber.test(v) ?
        parseFloat(v) : v
    
    } else {
      // BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0
      if (a == 'stroke-width')
        this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
      else if (a == 'stroke')
        this._stroke = v

      // convert image fill and stroke to patterns
      if (a == 'fill' || a == 'stroke') {
        if (SVG.regex.isImage.test(v))
          v = this.doc().defs().image(v, 0, 0)

        if (v instanceof SVG.Image)
          v = this.doc().defs().pattern(0, 0, function() {
            this.add(v)
          })
      }
      
      // ensure correct numeric values (also accepts NaN and Infinity)
      if (typeof v === 'number')
        v = new SVG.Number(v)

      // ensure full hex color
      else if (SVG.Color.isColor(v))
        v = new SVG.Color(v)
      
      // parse array values
      else if (Array.isArray(v))
        v = new SVG.Array(v)

      // store parametric transformation values locally
      else if (v instanceof SVG.Matrix && v.param)
        this.param = v.param

      // if the passed attribute is leading...
      if (a == 'leading') {
        // ... call the leading method instead
        if (this.leading)
          this.leading(v)
      } else {
        // set given attribute on node
        typeof n === 'string' ?
          this.node.setAttributeNS(n, a, v.toString()) :
          this.node.setAttribute(a, v.toString())
      }
      
      // rebuild if required
      if (this.rebuild && (a == 'font-size' || a == 'x'))
        this.rebuild(a, v)
    }
    
    return this
  }
})
SVG.extend(SVG.Element, SVG.FX, {
  // Add transformations
  transform: function(o, relative) {
    // get target in case of the fx module, otherwise reference this
    var target = this.target || this
      , matrix

    // act as a getter
    if (typeof o !== 'object') {
      // get current matrix
      matrix = new SVG.Matrix(target).extract()

      // add parametric rotation
      if (typeof this.param === 'object') {
        matrix.rotation = this.param.rotation
        matrix.cx       = this.param.cx
        matrix.cy       = this.param.cy
      }

      return typeof o === 'string' ? matrix[o] : matrix
    }

    // get current matrix
    matrix = this instanceof SVG.FX && this.attrs.transform ?
      this.attrs.transform :
      new SVG.Matrix(target)

    // ensure relative flag
    relative = !!relative || !!o.relative

    // act on matrix
    if (o.a != null) {
      matrix = relative ?
        // relative
        matrix.multiply(new SVG.Matrix(o)) :
        // absolute
        new SVG.Matrix(o)

    // act on rotation
    } else if (o.rotation != null) {
      // ensure centre point
      ensureCentre(o, target)

      // relativize rotation value
      if (relative) {
        o.rotation += this.param && this.param.rotation != null ?
          this.param.rotation :
          matrix.extract().rotation
      }

      // store parametric values
      this.param = o

      // apply transformation
      if (this instanceof SVG.Element) {
        matrix = relative ?
          // relative
          matrix.rotate(o.rotation, o.cx, o.cy) :
          // absolute
          matrix.rotate(o.rotation - matrix.extract().rotation, o.cx, o.cy)
      }

    // act on scale
    } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
      // ensure centre point
      ensureCentre(o, target)

      // ensure scale values on both axes
      o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
      o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1

      if (!relative) {
        // absolute; multiply inversed values
        var e = matrix.extract()
        o.scaleX = o.scaleX * 1 / e.scaleX
        o.scaleY = o.scaleY * 1 / e.scaleY
      }

      matrix = matrix.scale(o.scaleX, o.scaleY, o.cx, o.cy)

    // act on skew
    } else if (o.skewX != null || o.skewY != null) {
      // ensure centre point
      ensureCentre(o, target)

      // ensure skew values on both axes
      o.skewX = o.skewX != null ? o.skewX : 0
      o.skewY = o.skewY != null ? o.skewY : 0

      if (!relative) {
        // absolute; reset skew values
        var e = matrix.extract()
        matrix = matrix.multiply(new SVG.Matrix().skew(e.skewX, e.skewY, o.cx, o.cy).inverse())
      }

      matrix = matrix.skew(o.skewX, o.skewY, o.cx, o.cy)

    // act on flip
    } else if (o.flip) {
      matrix = matrix.flip(
        o.flip
      , o.offset == null ? target.bbox()['c' + o.flip] : o.offset
      )

    // act on translate
    } else if (o.x != null || o.y != null) {
      if (relative) {
        // relative
        matrix = matrix.translate(o.x, o.y)
      } else {
        // absolute
        if (o.x != null) matrix.e = o.x
        if (o.y != null) matrix.f = o.y
      }
    }

    return this.attr(this instanceof SVG.Pattern ? 'patternTransform' : this instanceof SVG.Gradient ? 'gradientTransform' : 'transform', matrix)
  }
})

SVG.extend(SVG.Element, {
  // Reset all transformations
  untransform: function() {
    return this.attr('transform', null)
  },
  matrixify: function() {

    var matrix = (this.attr('transform') || '')
      // split transformations
      .split(/\)\s*/).slice(0,-1).map(function(str){
        // generate key => value pairs
        var kv = str.trim().split('(')
        return [kv[0], kv[1].split(SVG.regex.matrixElements).map(function(str){ return parseFloat(str) })]
      })
      // calculate every transformation into one matrix
      .reduce(function(matrix, transform){

        if(transform[0] == 'matrix') return matrix.multiply(arrayToMatrix(transform[1]))
        return matrix[transform[0]].apply(matrix, transform[1])

      }, new SVG.Matrix())
    // apply calculated matrix to element
    this.attr('transform', matrix)

    return matrix
  }
})
SVG.extend(SVG.Element, {
  // Dynamic style generator
  style: function(s, v) {
    if (arguments.length == 0) {
      /* get full style */
      return this.node.style.cssText || ''
    
    } else if (arguments.length < 2) {
      /* apply every style individually if an object is passed */
      if (typeof s == 'object') {
        for (v in s) this.style(v, s[v])
      
      } else if (SVG.regex.isCss.test(s)) {
        /* parse css string */
        s = s.split(';')

        /* apply every definition individually */
        for (var i = 0; i < s.length; i++) {
          v = s[i].split(':')
          this.style(v[0].replace(/\s+/g, ''), v[1])
        }
      } else {
        /* act as a getter if the first and only argument is not an object */
        return this.node.style[camelCase(s)]
      }
    
    } else {
      this.node.style[camelCase(s)] = v === null || SVG.regex.isBlank.test(v) ? '' : v
    }
    
    return this
  }
})
SVG.Parent = SVG.invent({
  // Initialize node
  create: function(element) {
    this.constructor.call(this, element)
  }

  // Inherit from
, inherit: SVG.Element

  // Add class methods
, extend: {
    // Returns all child elements
    children: function() {
      return SVG.utils.map(SVG.utils.filterSVGElements(this.node.childNodes), function(node) {
        return SVG.adopt(node)
      })
    }
    // Add given element at a position
  , add: function(element, i) {
      if (!this.has(element)) {
        // define insertion index if none given
        i = i == null ? this.children().length : i
        
        // add element references
        this.node.insertBefore(element.node, this.node.childNodes[i] || null)
      }

      return this
    }
    // Basically does the same as `add()` but returns the added element instead
  , put: function(element, i) {
      this.add(element, i)
      return element
    }
    // Checks if the given element is a child
  , has: function(element) {
      return this.index(element) >= 0
    }
    // Gets index of given element
  , index: function(element) {
      return this.children().indexOf(element)
    }
    // Get a element at the given index
  , get: function(i) {
      return this.children()[i]
    }
    // Get first child, skipping the defs node
  , first: function() {
      return this.children()[0]
    }
    // Get the last child
  , last: function() {
      return this.children()[this.children().length - 1]
    }
    // Iterates over all children and invokes a given block
  , each: function(block, deep) {
      var i, il
        , children = this.children()
      
      for (i = 0, il = children.length; i < il; i++) {
        if (children[i] instanceof SVG.Element)
          block.apply(children[i], [i, children])

        if (deep && (children[i] instanceof SVG.Container))
          children[i].each(block, deep)
      }
    
      return this
    }
    // Remove a given child
  , removeElement: function(element) {
      this.node.removeChild(element.node)
      
      return this
    }
    // Remove all elements in this container
  , clear: function() {
      // remove children
      while(this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild)
      
      // remove defs reference
      delete this._defs

      return this
    }
  , // Get defs
    defs: function() {
      return this.doc().defs()
    }
  }
  
})

SVG.Container = SVG.invent({
  // Initialize node
  create: function(element) {
    this.constructor.call(this, element)
  }

  // Inherit from
, inherit: SVG.Parent

  // Add class methods
, extend: {
    // Get the viewBox and calculate the zoom value
    viewbox: function(v) {
      if (arguments.length == 0)
        /* act as a getter if there are no arguments */
        return new SVG.ViewBox(this)
      
      /* otherwise act as a setter */
      v = arguments.length == 1 ?
        [v.x, v.y, v.width, v.height] :
        [].slice.call(arguments)
      
      return this.attr('viewBox', v)
    }
  }
  
})
// Add events to elements
;[  'click'
  , 'dblclick'
  , 'mousedown'
  , 'mouseup'
  , 'mouseover'
  , 'mouseout'
  , 'mousemove'
  // , 'mouseenter' -> not supported by IE
  // , 'mouseleave' -> not supported by IE
  , 'touchstart'
  , 'touchmove'
  , 'touchleave'
  , 'touchend'
  , 'touchcancel' ].forEach(function(event) {
  
  /* add event to SVG.Element */
  SVG.Element.prototype[event] = function(f) {
    var self = this
    
    /* bind event to element rather than element node */
    this.node['on' + event] = typeof f == 'function' ?
      function() { return f.apply(self, arguments) } : null
    
    return this
  }
  
})

// Initialize listeners stack
SVG.listeners = []
SVG.handlerMap = []

// Add event binder in the SVG namespace
SVG.on = function(node, event, listener, binding) {
  // create listener, get object-index
  var l     = listener.bind(binding || node.instance || node)
    , index = (SVG.handlerMap.indexOf(node) + 1 || SVG.handlerMap.push(node)) - 1
    , ev    = event.split('.')[0]
    , ns    = event.split('.')[1] || '*'
    
  
  // ensure valid object
  SVG.listeners[index]         = SVG.listeners[index]         || {}
  SVG.listeners[index][ev]     = SVG.listeners[index][ev]     || {}
  SVG.listeners[index][ev][ns] = SVG.listeners[index][ev][ns] || {}

  // reference listener
  SVG.listeners[index][ev][ns][listener] = l

  // add listener
  node.addEventListener(ev, l, false)
}

// Add event unbinder in the SVG namespace
SVG.off = function(node, event, listener) {
  var index = SVG.handlerMap.indexOf(node)
    , ev    = event && event.split('.')[0]
    , ns    = event && event.split('.')[1]

  if(index == -1) return
  
  if (listener) {
    // remove listener reference
    if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns || '*']) {
      // remove listener
      node.removeEventListener(ev, SVG.listeners[index][ev][ns || '*'][listener], false)

      delete SVG.listeners[index][ev][ns || '*'][listener]
    }

  } else if (ns && ev) {
    // remove all listeners for a namespaced event
    if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns]) {
      for (listener in SVG.listeners[index][ev][ns])
        SVG.off(node, [ev, ns].join('.'), listener)

      delete SVG.listeners[index][ev][ns]
    }

  } else if (ns){
    // remove all listeners for a specific namespace
    for(event in SVG.listeners[index]){
        for(namespace in SVG.listeners[index][event]){
            if(ns === namespace){
                SVG.off(node, [event, ns].join('.'))
            }
        }
    }

  } else if (ev) {
    // remove all listeners for the event
    if (SVG.listeners[index][ev]) {
      for (namespace in SVG.listeners[index][ev])
        SVG.off(node, [ev, namespace].join('.'))

      delete SVG.listeners[index][ev]
    }

  } else {
    // remove all listeners on a given node
    for (event in SVG.listeners[index])
      SVG.off(node, event)

    delete SVG.listeners[index]

  }
}

//
SVG.extend(SVG.Element, {
  // Bind given event to listener
  on: function(event, listener, binding) {
    SVG.on(this.node, event, listener, binding)
    
    return this
  }
  // Unbind event from listener
, off: function(event, listener) {
    SVG.off(this.node, event, listener)
    
    return this
  }
  // Fire given event
, fire: function(event, data) {
    
    // Dispatch event
    if(event instanceof Event){
        this.node.dispatchEvent(event)
    }else{
        this.node.dispatchEvent(new CustomEvent(event, {detail:data}))
    }

    return this
  }
})

SVG.Defs = SVG.invent({
  // Initialize node
  create: 'defs'

  // Inherit from
, inherit: SVG.Container
  
})
SVG.G = SVG.invent({
  // Initialize node
  create: 'g'

  // Inherit from
, inherit: SVG.Container
  
  // Add class methods
, extend: {
    // Move over x-axis
    x: function(x) {
      return x == null ? this.transform('x') : this.transform({ x: -this.x() + x }, true)
    }
    // Move over y-axis
  , y: function(y) {
      return y == null ? this.transform('y') : this.transform({ y: -this.y() + y }, true)
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.tbox().cx : this.x(x - this.tbox().width / 2)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.tbox().cy : this.y(y - this.tbox().height / 2)
    }
  }
  
  // Add parent method
, construct: {
    // Create a group element
    group: function() {
      return this.put(new SVG.G)
    }
  }
})
// ### This module adds backward / forward functionality to elements.

//
SVG.extend(SVG.Element, {
  // Get all siblings, including myself
  siblings: function() {
    return this.parent().children()
  }
  // Get the curent position siblings
, position: function() {
    return this.parent().index(this)
  }
  // Get the next element (will return null if there is none)
, next: function() {
    return this.siblings()[this.position() + 1]
  }
  // Get the next element (will return null if there is none)
, previous: function() {
    return this.siblings()[this.position() - 1]
  }
  // Send given element one step forward
, forward: function() {
    var i = this.position() + 1
      , p = this.parent()

    // move node one step forward
    p.removeElement(this).add(this, i)

    // make sure defs node is always at the top
    if (p instanceof SVG.Doc)
      p.node.appendChild(p.defs().node)

    return this
  }
  // Send given element one step backward
, backward: function() {
    var i = this.position()
    
    if (i > 0)
      this.parent().removeElement(this).add(this, i - 1)

    return this
  }
  // Send given element all the way to the front
, front: function() {
    var p = this.parent()

    // Move node forward
    p.node.appendChild(this.node)

    // Make sure defs node is always at the top
    if (p instanceof SVG.Doc)
      p.node.appendChild(p.defs().node)

    return this
  }
  // Send given element all the way to the back
, back: function() {
    if (this.position() > 0)
      this.parent().removeElement(this).add(this, 0)
    
    return this
  }
  // Inserts a given element before the targeted element
, before: function(element) {
    element.remove()

    var i = this.position()
    
    this.parent().add(element, i)

    return this
  }
  // Insters a given element after the targeted element
, after: function(element) {
    element.remove()
    
    var i = this.position()
    
    this.parent().add(element, i + 1)

    return this
  }

})
SVG.Gradient = SVG.invent({
  // Initialize node
  create: function(type) {
    this.constructor.call(this, SVG.create(type + 'Gradient'))
    
    /* store type */
    this.type = type
  }

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Add a color stop
    at: function(offset, color, opacity) {
      return this.put(new SVG.Stop).update(offset, color, opacity)
    }
    // Update gradient
  , update: function(block) {
      /* remove all stops */
      this.clear()
      
      /* invoke passed block */
      if (typeof block == 'function')
        block.call(this, this)
      
      return this
    }
    // Return the fill id
  , fill: function() {
      return 'url(#' + this.id() + ')'
    }
    // Alias string convertion to fill
  , toString: function() {
      return this.fill()
    }
  }
  
  // Add parent method
, construct: {
    // Create gradient element in defs
    gradient: function(type, block) {
      return this.defs().gradient(type, block)
    }
  }
})

// Add animatable methods to both gradient and fx module
SVG.extend(SVG.Gradient, SVG.FX, {
  // From position
  from: function(x, y) {
    return (this.target || this).type == 'radial' ?
      this.attr({ fx: new SVG.Number(x), fy: new SVG.Number(y) }) :
      this.attr({ x1: new SVG.Number(x), y1: new SVG.Number(y) })
  }
  // To position
, to: function(x, y) {
    return (this.target || this).type == 'radial' ?
      this.attr({ cx: new SVG.Number(x), cy: new SVG.Number(y) }) :
      this.attr({ x2: new SVG.Number(x), y2: new SVG.Number(y) })
  }
})

// Base gradient generation
SVG.extend(SVG.Defs, {
  // define gradient
  gradient: function(type, block) {
    return this.put(new SVG.Gradient(type)).update(block)
  }
  
})

SVG.Stop = SVG.invent({
  // Initialize node
  create: 'stop'

  // Inherit from
, inherit: SVG.Element

  // Add class methods
, extend: {
    // add color stops
    update: function(o) {
      if (typeof o == 'number' || o instanceof SVG.Number) {
        o = {
          offset:  arguments[0]
        , color:   arguments[1]
        , opacity: arguments[2]
        }
      }

      /* set attributes */
      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
      if (o.color   != null) this.attr('stop-color', o.color)
      if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))

      return this
    }
  }

})

SVG.Pattern = SVG.invent({
  // Initialize node
  create: 'pattern'

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Return the fill id
	  fill: function() {
	    return 'url(#' + this.id() + ')'
	  }
	  // Update pattern by rebuilding
	, update: function(block) {
      // remove content
      this.clear()
      
      // invoke passed block
      if (typeof block == 'function')
      	block.call(this, this)
      
      return this
		}
	  // Alias string convertion to fill
	, toString: function() {
	    return this.fill()
	  }
  }
  
  // Add parent method
, construct: {
    // Create pattern element in defs
	  pattern: function(width, height, block) {
	    return this.defs().pattern(width, height, block)
	  }
  }
})

SVG.extend(SVG.Defs, {
  // Define gradient
  pattern: function(width, height, block) {
    return this.put(new SVG.Pattern).update(block).attr({
      x:            0
    , y:            0
    , width:        width
    , height:       height
    , patternUnits: 'userSpaceOnUse'
    })
  }

})
SVG.Doc = SVG.invent({
  // Initialize node
  create: function(element) {
    if (element) {
      /* ensure the presence of a dom element */
      element = typeof element == 'string' ?
        document.getElementById(element) :
        element
      
      /* If the target is an svg element, use that element as the main wrapper.
         This allows svg.js to work with svg documents as well. */
      if (element.nodeName == 'svg') {
        this.constructor.call(this, element)
      } else {
        this.constructor.call(this, SVG.create('svg'))
        element.appendChild(this.node)
      }
      
      /* set svg element attributes and ensure defs node */
      this.namespace().size('100%', '100%').defs()
    }
  }

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Add namespaces
    namespace: function() {
      return this
        .attr({ xmlns: SVG.ns, version: '1.1' })
        .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)
    }
    // Creates and returns defs element
  , defs: function() {
      if (!this._defs) {
        var defs

        // Find or create a defs element in this instance
        if (defs = this.node.getElementsByTagName('defs')[0])
          this._defs = SVG.adopt(defs)
        else
          this._defs = new SVG.Defs

        // Make sure the defs node is at the end of the stack
        this.node.appendChild(this._defs.node)
      }

      return this._defs
    }
    // custom parent method
  , parent: function() {
      return this.node.parentNode.nodeName == '#document' ? null : this.node.parentNode
    }
    // Fix for possible sub-pixel offset. See:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
  , spof: function(spof) {
      var pos = this.node.getScreenCTM()
      
      if (pos)
        this
          .style('left', (-pos.e % 1) + 'px')
          .style('top',  (-pos.f % 1) + 'px')

      return this
    }
    
      // Removes the doc from the DOM
  , remove: function() {
      if(this.parent()) {
        this.parent().removeChild(this.node);
      }

      return this;
    }
  }
  
})

SVG.Shape = SVG.invent({
  // Initialize node
  create: function(element) {
	  this.constructor.call(this, element)
	}

  // Inherit from
, inherit: SVG.Element

})
SVG.Use = SVG.invent({
  // Initialize node
  create: 'use'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Use element as a reference
    element: function(element, file) {
      /* Set lined element */
      return this.attr('href', (file || '') + '#' + element, SVG.xlink)
    }
  }
  
  // Add parent method
, construct: {
    // Create a use element
    use: function(element, file) {
      return this.put(new SVG.Use).element(element, file)
    }
  }
})
SVG.Rect = SVG.invent({
  // Initialize node
  create: 'rect'

  // Inherit from
, inherit: SVG.Shape
    
  // Add parent method
, construct: {
    // Create a rect element
    rect: function(width, height) {
      return this.put(new SVG.Rect().size(width, height))
    }
  }
})
SVG.Circle = SVG.invent({
  // Initialize node
  create: 'circle'

  // Inherit from
, inherit: SVG.Shape

  // Add parent method
, construct: {
    // Create circle element, based on ellipse
    circle: function(size) {
      return this.put(new SVG.Circle).rx(new SVG.Number(size).divide(2)).move(0, 0)
    }
  }
})

SVG.extend(SVG.Circle, SVG.FX, {
  // Radius x value
  rx: function(rx) {
    return this.attr('r', rx)
  }
  // Alias radius x value
, ry: function(ry) {
    return this.rx(ry)
  }
})

SVG.Ellipse = SVG.invent({
  // Initialize node
  create: 'ellipse'

  // Inherit from
, inherit: SVG.Shape

  // Add parent method
, construct: {
    // Create an ellipse
    ellipse: function(width, height) {
      return this.put(new SVG.Ellipse).size(width, height).move(0, 0)
    }
  }
})

SVG.extend(SVG.Ellipse, SVG.Rect, SVG.FX, {
  // Radius x value
  rx: function(rx) {
    return this.attr('rx', rx)
  }
  // Radius y value
, ry: function(ry) {
    return this.attr('ry', ry)
  }
})

// Add common method
SVG.extend(SVG.Circle, SVG.Ellipse, {
    // Move over x-axis
    x: function(x) {
      return x == null ? this.cx() - this.rx() : this.cx(x + this.rx())
    }
    // Move over y-axis
  , y: function(y) {
      return y == null ? this.cy() - this.ry() : this.cy(y + this.ry())
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.attr('cx') : this.attr('cx', x)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.attr('cy') : this.attr('cy', y)
    }
    // Set width of element
  , width: function(width) {
      return width == null ? this.rx() * 2 : this.rx(new SVG.Number(width).divide(2))
    }
    // Set height of element
  , height: function(height) {
      return height == null ? this.ry() * 2 : this.ry(new SVG.Number(height).divide(2))
    }
    // Custom size function
  , size: function(width, height) {
      var p = proportionalSize(this.bbox(), width, height)

      return this
        .rx(new SVG.Number(p.width).divide(2))
        .ry(new SVG.Number(p.height).divide(2))
    }
})
SVG.Line = SVG.invent({
  // Initialize node
  create: 'line'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Get array
    array: function() {
      return new SVG.PointArray([
        [ this.attr('x1'), this.attr('y1') ]
      , [ this.attr('x2'), this.attr('y2') ]
      ])
    }
    // Overwrite native plot() method
  , plot: function(x1, y1, x2, y2) {
      if (arguments.length == 4)
        x1 = { x1: x1, y1: y1, x2: x2, y2: y2 }
      else 
        x1 = new SVG.PointArray(x1).toLine()

      return this.attr(x1)
    }
    // Move by left top corner
  , move: function(x, y) {
      return this.attr(this.array().move(x, y).toLine())
    }
    // Set element size to given width and height
  , size: function(width, height) {
      var p = proportionalSize(this.bbox(), width, height)

      return this.attr(this.array().size(p.width, p.height).toLine())
    }
  }
  
  // Add parent method
, construct: {
    // Create a line element
    line: function(x1, y1, x2, y2) {
      return this.put(new SVG.Line).plot(x1, y1, x2, y2)
    }
  }
})

SVG.Polyline = SVG.invent({
  // Initialize node
  create: 'polyline'

  // Inherit from
, inherit: SVG.Shape
  
  // Add parent method
, construct: {
    // Create a wrapped polyline element
    polyline: function(p) {
      return this.put(new SVG.Polyline).plot(p)
    }
  }
})

SVG.Polygon = SVG.invent({
  // Initialize node
  create: 'polygon'

  // Inherit from
, inherit: SVG.Shape
  
  // Add parent method
, construct: {
    // Create a wrapped polygon element
    polygon: function(p) {
      return this.put(new SVG.Polygon).plot(p)
    }
  }
})

// Add polygon-specific functions
SVG.extend(SVG.Polyline, SVG.Polygon, {
  // Get array
  array: function() {
    return this._array || (this._array = new SVG.PointArray(this.attr('points')))
  }
  // Plot new path
, plot: function(p) {
    return this.attr('points', (this._array = new SVG.PointArray(p)))
  }
  // Move by left top corner
, move: function(x, y) {
    return this.attr('points', this.array().move(x, y))
  }
  // Set element size to given width and height
, size: function(width, height) {
    var p = proportionalSize(this.bbox(), width, height)

    return this.attr('points', this.array().size(p.width, p.height))
  }

})
SVG.Path = SVG.invent({
  // Initialize node
  create: 'path'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Define morphable array
    morphArray:  SVG.PathArray
    // Get array
  , array: function() {
      return this._array || (this._array = new SVG.PathArray(this.attr('d')))
    }
    // Plot new poly points
  , plot: function(p) {
      return this.attr('d', (this._array = new SVG.PathArray(p)))
    }
    // Move by left top corner
  , move: function(x, y) {
      return this.attr('d', this.array().move(x, y))
    }
    // Move by left top corner over x-axis
  , x: function(x) {
      return x == null ? this.bbox().x : this.move(x, this.bbox().y)
    }
    // Move by left top corner over y-axis
  , y: function(y) {
      return y == null ? this.bbox().y : this.move(this.bbox().x, y)
    }
    // Set element size to given width and height
  , size: function(width, height) {
      var p = proportionalSize(this.bbox(), width, height)
      
      return this.attr('d', this.array().size(p.width, p.height))
    }
    // Set width of element
  , width: function(width) {
      return width == null ? this.bbox().width : this.size(width, this.bbox().height)
    }
    // Set height of element
  , height: function(height) {
      return height == null ? this.bbox().height : this.size(this.bbox().width, height)
    }
    
  }
  
  // Add parent method
, construct: {
    // Create a wrapped path element
    path: function(d) {
      return this.put(new SVG.Path).plot(d)
    }
  }
})
SVG.Image = SVG.invent({
  // Initialize node
  create: 'image'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // (re)load image
    load: function(url) {
      if (!url) return this

      var self = this
        , img  = document.createElement('img')
      
      // preload image
      img.onload = function() {
        var p = self.parent(SVG.Pattern)

        // ensure image size
        if (self.width() == 0 && self.height() == 0)
          self.size(img.width, img.height)

        // ensure pattern size if not set
        if (p && p.width() == 0 && p.height() == 0)
          p.size(self.width(), self.height())
        
        // callback
        if (typeof self._loaded === 'function')
          self._loaded.call(self, {
            width:  img.width
          , height: img.height
          , ratio:  img.width / img.height
          , url:    url
          })
      }

      return this.attr('href', (img.src = this.src = url), SVG.xlink)
    }
    // Add loaded callback
  , loaded: function(loaded) {
      this._loaded = loaded
      return this
    }
  }
  
  // Add parent method
, construct: {
    // create image element, load image and set its size
    image: function(source, width, height) {
      return this.put(new SVG.Image).load(source).size(width || 0, height || width || 0)
    }
  }

})
SVG.Text = SVG.invent({
  // Initialize node
  create: function() {
    this.constructor.call(this, SVG.create('text'))
    
    this._leading = new SVG.Number(1.3)    // store leading value for rebuilding
    this._rebuild = true                   // enable automatic updating of dy values
    this._build   = false                  // disable build mode for adding multiple lines

    // set default font
    this.attr('font-family', SVG.defaults.attrs['font-family'])
  }

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    clone: function(){
      // clone element and assign new id
      var clone = assignNewId(this.node.cloneNode(true))

      // mark first level tspans as newlines
      clone.lines().each(function(){
        this.newLined = true
      })
      
      // insert the clone after myself
      this.after(clone)

      return clone
    }
    // Move over x-axis
  , x: function(x) {
      // act as getter
      if (x == null)
        return this.attr('x')
      
      // move lines as well if no textPath is present
      if (!this.textPath)
        this.lines().each(function() { if (this.newLined) this.x(x) })

      return this.attr('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      var oy = this.attr('y')
        , o  = typeof oy === 'number' ? oy - this.bbox().y : 0

      // act as getter
      if (y == null)
        return typeof oy === 'number' ? oy - o : oy

      return this.attr('y', typeof y === 'number' ? y + o : y)
    }
    // Move center over x-axis
  , cx: function(x) {
      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
    }
    // Move center over y-axis
  , cy: function(y) {
      return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
    }
    // Set the text content
  , text: function(text) {
      // act as getter
      if (typeof text === 'undefined') return this.content
      
      // remove existing content
      this.clear().build(true)
      
      if (typeof text === 'function') {
        // call block
        text.call(this, this)

      } else {
        // store text and make sure text is not blank
        text = (this.content = text).split('\n')
        
        // build new lines
        for (var i = 0, il = text.length; i < il; i++)
          this.tspan(text[i]).newLine()
      }
      
      // disable build mode and rebuild lines
      return this.build(false).rebuild()
    }
    // Set font size
  , size: function(size) {
      return this.attr('font-size', size).rebuild()
    }
    // Set / get leading
  , leading: function(value) {
      // act as getter
      if (value == null)
        return this._leading
      
      // act as setter
      this._leading = new SVG.Number(value)
      
      return this.rebuild()
    }
    // Get all the first level lines
  , lines: function() {
      // filter tspans and map them to SVG.js instances
      var lines = SVG.utils.map(SVG.utils.filterSVGElements(this.node.childNodes), function(el){
        return SVG.adopt(el)
      })

      // return an instance of SVG.set
      return new SVG.Set(lines)
    }
    // Rebuild appearance type
  , rebuild: function(rebuild) {
      // store new rebuild flag if given
      if (typeof rebuild == 'boolean')
        this._rebuild = rebuild

      // define position of all lines
      if (this._rebuild) {
        var self = this
        
        this.lines().each(function() {
          if (this.newLined) {
            if (!this.textPath)
              this.attr('x', self.attr('x'))
            
            this.attr('dy', self._leading * new SVG.Number(self.attr('font-size'))) 
          }
        })

        this.fire('rebuild')
      }

      return this
    }
    // Enable / disable build mode
  , build: function(build) {
      this._build = !!build
      return this
    }
  }
  
  // Add parent method
, construct: {
    // Create text element
    text: function(text) {
      return this.put(new SVG.Text).text(text)
    }
    // Create plain text element
  , plain: function(text) {
      return this.put(new SVG.Text).plain(text)
    }
  }

})

SVG.Tspan = SVG.invent({
  // Initialize node
  create: 'tspan'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Set text content
    text: function(text) {
      typeof text === 'function' ? text.call(this, this) : this.plain(text)

      return this
    }
    // Shortcut dx
  , dx: function(dx) {
      return this.attr('dx', dx)
    }
    // Shortcut dy
  , dy: function(dy) {
      return this.attr('dy', dy)
    }
    // Create new line
  , newLine: function() {
      // fetch text parent
      var t = this.parent(SVG.Text)

      // mark new line
      this.newLined = true

      // apply new hy¡n
      return this.dy(t._leading * t.attr('font-size')).attr('x', t.x())
    }
  }
  
})

SVG.extend(SVG.Text, SVG.Tspan, {
  // Create plain text node
  plain: function(text) {
    // clear if build mode is disabled
    if (this._build === false)
      this.clear()

    // create text node
    this.node.appendChild(document.createTextNode((this.content = text)))
    
    return this
  }
  // Create a tspan
, tspan: function(text) {
    var node  = (this.textPath() || this).node
      , tspan = new SVG.Tspan

    // clear if build mode is disabled
    if (this._build === false)
      this.clear()
    
    // add new tspan
    node.appendChild(tspan.node)

    return tspan.text(text)
  }
  // Clear all lines
, clear: function() {
    var node = (this.textPath() || this).node

    // remove existing child nodes
    while (node.hasChildNodes())
      node.removeChild(node.lastChild)
    
    // reset content references 
    if (this instanceof SVG.Text)
      this.content = ''
    
    return this
  }
  // Get length of text element
, length: function() {
    return this.node.getComputedTextLength()
  }
})

SVG.TextPath = SVG.invent({
  // Initialize node
  create: 'textPath'

  // Inherit from
, inherit: SVG.Element

  // Define parent class
, parent: SVG.Text

  // Add parent method
, construct: {
    // Create path for text to run on
    path: function(d) {
      // create textPath element
      var path  = new SVG.TextPath
        , track = this.doc().defs().path(d)

      // move lines to textpath
      while (this.node.hasChildNodes())
        path.node.appendChild(this.node.firstChild)

      // add textPath element as child node
      this.node.appendChild(path.node)

      // link textPath to path and add content
      path.attr('href', '#' + track, SVG.xlink)

      return this
    }
    // Plot path if any
  , plot: function(d) {
      var track = this.track()

      if (track)
        track.plot(d)

      return this
    }
    // Get the path track element
  , track: function() {
      var path = this.textPath()

      if (path)
        return path.reference('href')
    }
    // Get the textPath child
  , textPath: function() {
      if (this.node.firstChild && this.node.firstChild.nodeName == 'textPath')
        return SVG.adopt(this.node.firstChild)
    }
  }
})
SVG.Nested = SVG.invent({
  // Initialize node
  create: function() {
    this.constructor.call(this, SVG.create('svg'))
    
    this.style('overflow', 'visible')
  }

  // Inherit from
, inherit: SVG.Container
  
  // Add parent method
, construct: {
    // Create nested svg document
    nested: function() {
      return this.put(new SVG.Nested)
    }
  }
})
// Define list of available attributes for stroke and fill
var sugar = {
  stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
, fill:   ['color', 'opacity', 'rule']
, prefix: function(t, a) {
    return a == 'color' ? t : t + '-' + a
  }
}

/* Add sugar for fill and stroke */
;['fill', 'stroke'].forEach(function(m) {
  var i, extension = {}

  extension[m] = function(o) {
    if (typeof o == 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function'))
      this.attr(m, o)

    else
      /* set all attributes from sugar.fill and sugar.stroke list */
      for (i = sugar[m].length - 1; i >= 0; i--)
        if (o[sugar[m][i]] != null)
          this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]])

    return this
  }

  SVG.extend(SVG.Element, SVG.FX, extension)

})

SVG.extend(SVG.Element, SVG.FX, {
  // Map rotation to transform
  rotate: function(d, cx, cy) {
    return this.transform({ rotation: d, cx: cx, cy: cy })
  }
  // Map skew to transform
, skew: function(x, y, cx, cy) {
    return this.transform({ skewX: x, skewY: y, cx: cx, cy: cy })
  }
  // Map scale to transform
, scale: function(x, y, cx, cy) {
    return arguments.length == 1  || arguments.length == 3 ?
      this.transform({ scale: x, cx: y, cy: cx }) :
      this.transform({ scaleX: x, scaleY: y, cx: cx, cy: cy })
  }
  // Map translate to transform
, translate: function(x, y) {
    return this.transform({ x: x, y: y })
  }
  // Map flip to transform
, flip: function(a, o) {
    return this.transform({ flip: a, offset: o })
  }
  // Map matrix to transform
, matrix: function(m) {
    return this.attr('transform', new SVG.Matrix(m))
  }
  // Opacity
, opacity: function(value) {
    return this.attr('opacity', value)
  }
  // Relative move over x axis
, dx: function(x) {
    return this.x((this.target || this).x() + x)
  }
  // Relative move over y axis
, dy: function(y) {
    return this.y((this.target || this).y() + y)
  }
  // Relative move over x and y axes
, dmove: function(x, y) {
    return this.dx(x).dy(y)
  }
})

SVG.extend(SVG.Rect, SVG.Ellipse, SVG.Circle, SVG.Gradient, SVG.FX, {
  // Add x and y radius
  radius: function(x, y) {
    var type = (this.target || this).type;
    return type == 'radial' || type == 'circle' ?
      this.attr({ 'r': new SVG.Number(x) }) :
      this.rx(x).ry(y == null ? x : y)
  }
})

SVG.extend(SVG.Path, {
  // Get path length
  length: function() {
    return this.node.getTotalLength()
  }
  // Get point at length
, pointAt: function(length) {
    return this.node.getPointAtLength(length)
  }
})

SVG.extend(SVG.Parent, SVG.Text, SVG.FX, {
  // Set font
  font: function(o) {
    for (var k in o)
      k == 'leading' ?
        this.leading(o[k]) :
      k == 'anchor' ?
        this.attr('text-anchor', o[k]) :
      k == 'size' || k == 'family' || k == 'weight' || k == 'stretch' || k == 'variant' || k == 'style' ?
        this.attr('font-'+ k, o[k]) :
        this.attr(k, o[k])

    return this
  }
})


SVG.Set = SVG.invent({
  // Initialize
  create: function(members) {
    // Set initial state
    Array.isArray(members) ? this.members = members : this.clear()
  }

  // Add class methods
, extend: {
    // Add element to set
    add: function() {
      var i, il, elements = [].slice.call(arguments)

      for (i = 0, il = elements.length; i < il; i++)
        this.members.push(elements[i])
      
      return this
    }
    // Remove element from set
  , remove: function(element) {
      var i = this.index(element)
      
      // remove given child
      if (i > -1)
        this.members.splice(i, 1)

      return this
    }
    // Iterate over all members
  , each: function(block) {
      for (var i = 0, il = this.members.length; i < il; i++)
        block.apply(this.members[i], [i, this.members])

      return this
    }
    // Restore to defaults
  , clear: function() {
      // initialize store
      this.members = []

      return this
    }
    // Get the length of a set
  , length: function() {
      return this.members.length
    }
    // Checks if a given element is present in set
  , has: function(element) {
      return this.index(element) >= 0
    }
    // retuns index of given element in set
  , index: function(element) {
      return this.members.indexOf(element)
    }
    // Get member at given index
  , get: function(i) {
      return this.members[i]
    }
    // Get first member
  , first: function() {
      return this.get(0)
    }
    // Get last member
  , last: function() {
      return this.get(this.members.length - 1)
    }
    // Default value
  , valueOf: function() {
      return this.members
    }
    // Get the bounding box of all members included or empty box if set has no items
  , bbox: function(){
      var box = new SVG.BBox()

      // return an empty box of there are no members
      if (this.members.length == 0)
        return box

      // get the first rbox and update the target bbox
      var rbox = this.members[0].rbox()
      box.x      = rbox.x
      box.y      = rbox.y
      box.width  = rbox.width
      box.height = rbox.height

      this.each(function() {
        // user rbox for correct position and visual representation
        box = box.merge(this.rbox())
      })

      return box
    }
  }
  
  // Add parent method
, construct: {
    // Create a new set
    set: function(members) {
      return new SVG.Set(members)
    }
  }
})

SVG.FX.Set = SVG.invent({
  // Initialize node
  create: function(set) {
    // store reference to set
    this.set = set
  }

})

// Alias methods
SVG.Set.inherit = function() {
  var m
    , methods = []
  
  // gather shape methods
  for(var m in SVG.Shape.prototype)
    if (typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function')
      methods.push(m)

  // apply shape aliasses
  methods.forEach(function(method) {
    SVG.Set.prototype[method] = function() {
      for (var i = 0, il = this.members.length; i < il; i++)
        if (this.members[i] && typeof this.members[i][method] == 'function')
          this.members[i][method].apply(this.members[i], arguments)

      return method == 'animate' ? (this.fx || (this.fx = new SVG.FX.Set(this))) : this
    }
  })

  // clear methods for the next round
  methods = []

  // gather fx methods
  for(var m in SVG.FX.prototype)
    if (typeof SVG.FX.prototype[m] == 'function' && typeof SVG.FX.Set.prototype[m] != 'function')
      methods.push(m)

  // apply fx aliasses
  methods.forEach(function(method) {
    SVG.FX.Set.prototype[method] = function() {
      for (var i = 0, il = this.set.members.length; i < il; i++)
        this.set.members[i].fx[method].apply(this.set.members[i].fx, arguments)

      return this
    }
  })
}



//
SVG.extend(SVG.Element, {
	// Store data values on svg nodes
  data: function(a, v, r) {
  	if (typeof a == 'object') {
  		for (v in a)
  			this.data(v, a[v])

    } else if (arguments.length < 2) {
      try {
        return JSON.parse(this.attr('data-' + a))
      } catch(e) {
        return this.attr('data-' + a)
      }
      
    } else {
      this.attr(
        'data-' + a
      , v === null ?
          null :
        r === true || typeof v === 'string' || typeof v === 'number' ?
          v :
          JSON.stringify(v)
      )
    }
    
    return this
  }
})
SVG.extend(SVG.Element, {
  // Remember arbitrary data
  remember: function(k, v) {
    /* remember every item in an object individually */
    if (typeof arguments[0] == 'object')
      for (var v in k)
        this.remember(v, k[v])

    /* retrieve memory */
    else if (arguments.length == 1)
      return this.memory()[k]

    /* store memory */
    else
      this.memory()[k] = v

    return this
  }

  // Erase a given memory
, forget: function() {
    if (arguments.length == 0)
      this._memory = {}
    else
      for (var i = arguments.length - 1; i >= 0; i--)
        delete this.memory()[arguments[i]]

    return this
  }

  // Initialize or return local memory object
, memory: function() {
    return this._memory || (this._memory = {})
  }

})
// Convert dash-separated-string to camelCase
function camelCase(s) { 
  return s.toLowerCase().replace(/-(.)/g, function(m, g) {
    return g.toUpperCase()
  })
}

// Capitalize first letter of a string
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Ensure to six-based hex 
function fullHex(hex) {
  return hex.length == 4 ?
    [ '#',
      hex.substring(1, 2), hex.substring(1, 2)
    , hex.substring(2, 3), hex.substring(2, 3)
    , hex.substring(3, 4), hex.substring(3, 4)
    ].join('') : hex
}

// Component to hex value
function compToHex(comp) {
  var hex = comp.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

// Calculate proportional width and height values when necessary
function proportionalSize(box, width, height) {
  if (height == null)
    height = box.height / box.width * width
  else if (width == null)
    width = box.width / box.height * height
  
  return {
    width:  width
  , height: height
  }
}

// Delta transform point
function deltaTransformPoint(matrix, x, y) {
  return {
    x: x * matrix.a + y * matrix.c + 0
  , y: x * matrix.b + y * matrix.d + 0
  }
}

// Map matrix array to object
function arrayToMatrix(a) {
  return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] }
}

// Parse matrix if required
function parseMatrix(matrix) {
  if (!(matrix instanceof SVG.Matrix))
    matrix = new SVG.Matrix(matrix)
  
  return matrix
}

// Add centre point to transform object
function ensureCentre(o, target) {
  o.cx = o.cx == null ? target.bbox().cx : o.cx
  o.cy = o.cy == null ? target.bbox().cy : o.cy
}

// Convert string to matrix
function stringToMatrix(source) {
  // remove matrix wrapper and split to individual numbers
  source = source
    .replace(SVG.regex.whitespace, '')
    .replace(SVG.regex.matrix, '')
    .split(SVG.regex.matrixElements)

  // convert string values to floats and convert to a matrix-formatted object
  return arrayToMatrix(
    SVG.utils.map(source, function(n) {
      return parseFloat(n)
    })
  )
}

// Calculate position according to from and to
function at(o, pos) {
  // number recalculation (don't bother converting to SVG.Number for performance reasons)
  return typeof o.from == 'number' ?
    o.from + (o.to - o.from) * pos :
  
  // instance recalculation
  o instanceof SVG.Color || o instanceof SVG.Number || o instanceof SVG.Matrix ? o.at(pos) :
  
  // for all other values wait until pos has reached 1 to return the final value
  pos < 1 ? o.from : o.to
}

// PathArray Helpers
function arrayToString(a) {
  for (var i = 0, il = a.length, s = ''; i < il; i++) {
    s += a[i][0]

    if (a[i][1] != null) {
      s += a[i][1]

      if (a[i][2] != null) {
        s += ' '
        s += a[i][2]

        if (a[i][3] != null) {
          s += ' '
          s += a[i][3]
          s += ' '
          s += a[i][4]

          if (a[i][5] != null) {
            s += ' '
            s += a[i][5]
            s += ' '
            s += a[i][6]

            if (a[i][7] != null) {
              s += ' '
              s += a[i][7]
            }
          }
        }
      }
    }
  }
  
  return s + ' '
}

// Deep new id assignment
function assignNewId(node) {
  // do the same for SVG child nodes as well
  for (var i = node.childNodes.length - 1; i >= 0; i--)
    if (node.childNodes[i] instanceof SVGElement)
      assignNewId(node.childNodes[i])

  return SVG.adopt(node).id(SVG.eid(node.nodeName))
}

// Add more bounding box properties
function fullBox(b) {
  if (b.x == null) {
    b.x      = 0
    b.y      = 0
    b.width  = 0
    b.height = 0
  }

  b.w  = b.width
  b.h  = b.height
  b.x2 = b.x + b.width
  b.y2 = b.y + b.height
  b.cx = b.x + b.width / 2
  b.cy = b.y + b.height / 2

  return b
}

// Get id from reference string
function idFromReference(url) {
  var m = url.toString().match(SVG.regex.reference)

  if (m) return m[1]
}

// Create matrix array for looping
var abcdef = 'abcdef'.split('')
return SVG;

}));

},{}],11:[function(require,module,exports){

var EventEmitter = require('events').EventEmitter,
    inherits     = require('inherits')

function Broker (canvas) {
  this.canvas = canvas
}

inherits(Broker, EventEmitter)

function init (eventHook) {
  var canvas = this.canvas

  /**
   * On addLink event.
   *
   * @api private
   */

  function addLink (eventData) {
    canvas.addLink(eventData)
  }

  this.on('addLink', addLink)

  /**
   * Generate addInput or addOutput event callback
   *
   * @api private
   *
   * @param {String} type can be In or Out
   *
   * @returns {Function} anonymous
   */

  function addPin (type) {
    return function (eventData) {
      // Can be addInput or addOutput.
      var action = 'add' + type + 'put'

      var id       = eventData.nodeid,
          position = eventData.position

      var node = canvas.node[id]

      node[action](position)
    }
  }

  this.on('addInput', addPin('In'))
  this.on('addOutput', addPin('Out'))

  /**
   * On addNode event.
   *
   * @api private
   */

  function addNode (eventData) {
    canvas.addNode(eventData)
  }

  this.on('addNode', addNode)

  /**
   * On delNode event.
   *
   * @api private
   */

  function delNode (eventData) {
    canvas.delNode(eventData)
  }

  this.on('delNode', delNode)

  /**
   * On delLink event.
   *
   * @api private
   */

  function delLink (eventData) {
    canvas.delLink(eventData)
  }

  this.on('delLink', delLink)

  /**
   * On moveNode event.
   *
   * @api private
   */

  function moveNode (eventData) {
    canvas.moveNode(eventData)
  }

  this.on('moveNode', moveNode)

  /**
   * On selectNode event.
   *
   * @api private
   */

  function selectNode (eventData) {
    canvas.selectNode(eventData)
  }

  this.on('selectNode', selectNode)
}

Broker.prototype.init = init

module.exports = Broker


},{"events":5,"inherits":7}],12:[function(require,module,exports){

var SVG = require('./SVG')

var Broker        = require('./Broker'),
    Link          = require('./Link'),
    Node          = require('./Node'),
    NodeControls  = require('./NodeControls'),
    NodeCreator   = require('./NodeCreator'),
    validate      = require('./validate')

var defaultTheme = require('./default/theme.json'),
    defaultView  = require('./default/view.json')

/**
 * Create a flow-view canvas
 *
 * @constructor
 * @param {String} id of div
 * @param {Object} arg can contain width, height, eventHooks
 */

function Canvas (id, arg) {
  var self = this

  if (typeof arg === 'undefined')
    arg = {}

  var eventHooks = arg.eventHooks || {}

  var broker = new Broker(this)
  broker.init(eventHooks)
  this.broker = broker

  var theme = defaultTheme
  this.theme = theme

  this.node = {}
  this.link = {}

  var svg = this.svg = SVG(id).spof()

  var element = document.getElementById(id)

  var height = arg.height || element.clientHeight,
      width  = arg.width  || element.clientWidth

  svg.size(width, height)

  function getHeight () { return height }

  function setHeight (value) {
    height = value
    svg.size(height, width).spof()
  }

  Object.defineProperty(this, 'height', {get: getHeight, set: setHeight});

  function getWidth () { return width }

  function setWidth (value) {
    width = value
    svg.size(height, width).spof()
  }

  Object.defineProperty(this, 'width', {get: getWidth, set: setWidth});

  var nextId = 0

  function getNextId () {
    var currentId = ++nextId + ''

    // Make next id unique.
    if (self.node[currentId])
      return getNextId()

    if (self.link[currentId])
      return getNextId()

    return currentId
  }

  Object.defineProperty(this, 'nextId', { get: getNextId })

  var nodeCreator  = new NodeCreator(this)
  this.nodeCreator = nodeCreator

  var nodeControls = new NodeControls(this)
  this.nodeControls = nodeControls

  var hideNodeCreator = nodeCreator.hide.bind(nodeCreator),
      showNodeCreator = nodeCreator.show.bind(nodeCreator)

  SVG.on(element, 'click',    hideNodeCreator)
  SVG.on(element, 'dblclick', showNodeCreator)
}

function render (view) {
  validate(view)

  var self = this

  function createNode (id) {
    var data = view.node[id]
    data.nodeid = id

    self.addNode(data)
  }

  Object.keys(view.node)
        .forEach(createNode)

  function createLink (id) {
    var data = view.link[id]
    data.linkid = id

    self.addLink(data)
  }

  Object.keys(view.link)
        .forEach(createLink)
}

Canvas.prototype.render = render

function deleteView () {

  var link = this.link,
      node = this.node

  Object.keys(node).forEach(function (id) { node[id].deleteView() })
  Object.keys(link).forEach(function (id) { link[id].deleteView() })
}

Canvas.prototype.deleteView = deleteView

/**
 * Get model.
 *
 * @returns {Object} json
 */

function toJSON () {
  var view = { link: {}, node: {} }

  var link = this.link,
      node = this.node

  Object.keys(link).forEach(function (id) {
    view.link[id] = link[id].toJSON()
  })

  Object.keys(node).forEach(function (id) {
    view.node[id] = node[id].toJSON()
  })

  return view
}

Canvas.prototype.toJSON = toJSON

/**
 * Add a link.
 */

function addLink (data) {
  var id = data.linkid

  if (typeof id === 'undefined')
     id = this.nextId

  var link = new Link(this, id)

  link.render(data)

  this.link[id] = link
}

Canvas.prototype.addLink = addLink

/**
 * Add a node.
 */

function addNode (data) {
  var id = data.nodeid

  if (typeof id === 'undefined')
     id = this.nextId

  var node = new Node(this, id)

  node.render(data)

  this.node[id] = node
}

Canvas.prototype.addNode = addNode

/**
 * Delete a node.
 */

function delNode (data) {
  var id = data.nodeid

  var link = this.link,
      node = this.node[id]

  // First remove links connected to node.
  for (var i in link) {
    var nodeIsSource = link[i].from.id === id,
        nodeIsTarget = link[i].to.id   === id

    if (nodeIsSource || nodeIsTarget)
      this.broker.emit('delLink', { linkid: i })
  }

  // Then remove node.
  node.deleteView()
}

Canvas.prototype.delNode = delNode

/**
 * Delete a link.
 */

function delLink (data) {
  var id = data.linkid

  var link = this.link[id]

  link.deleteView()
}

Canvas.prototype.delLink = delLink

/**
 * Move a node.
 */

function moveNode (data) {
  var id = data.nodeid,
      x   = data.x,
      y   = data.y

  this.node[id].x = x
  this.node[id].y = y
}

Canvas.prototype.moveNode = moveNode

/**
 * Rename a node.
 */

function renameNode (data) {
  // TODO add renameNode event to Broker
  var id   = data.id,
      text = data.text

  this.node[id].text = text
}

Canvas.prototype.renameNode = renameNode

/**
 * Select a node.
 */

function selectNode (data) {
  var id = data.nodeid

  var node = this.node[id]

  this.nodeControls.attachTo(node)
}

Canvas.prototype.selectNode = selectNode

module.exports = Canvas


},{"./Broker":11,"./Link":14,"./Node":15,"./NodeControls":20,"./NodeCreator":21,"./SVG":29,"./default/theme.json":25,"./default/view.json":26,"./validate":28}],13:[function(require,module,exports){

var inherits = require('inherits'),
    Pin      = require('./Pin')

function Input (node, position) {
  Pin.call(this, 'ins', node, position)

  this.link = null
}

inherits(Input, Pin)

function render () {
  var fill   = this.fill,
      node   = this.node,
      size   = this.size,
      vertex = this.vertex.relative

  var svg = node.canvas.svg

  var rect = svg.rect(size, size)
                .move(vertex.x, vertex.y)
                .fill(fill)

  this.rect = rect

  node.group.add(rect)
}

Input.prototype.render = render

module.exports = Input


},{"./Pin":23,"inherits":7}],14:[function(require,module,exports){

/**
 * Connect an output to an input
 *
 * @param {Object} canvas
 * @param {String} id
 */

function Link (canvas, id) {
  this.canvas = canvas
  this.id     = id
}

function render (view) {
  var canvas = this.canvas,
      id     = this.id

  var broker = canvas.broker,
      node   = canvas.node,
      svg    = canvas.svg,
      theme  = canvas.theme

  var strokeLine            = theme.strokeLine,
      strokeLineHighlighted = theme.strokeLineHighlighted

  var from = node[view.from[0]],
      to   = node[view.to[0]]

  var start = from.outs[view.from[1]],
      end   = to.ins[view.to[1]]

  Object.defineProperties(this, {
    'from' : { value: from  },
    'to'   : { value: to    },
    'start': { value: start },
    'end'  : { value: end   }
  })

  Object.defineProperties(this, {
    'x1': { get: function () { return start.center.absolute.x } },
    'y1': { get: function () { return start.center.absolute.y } },
    'x2': { get: function () { return end.center.absolute.x   } },
    'y2': { get: function () { return end.center.absolute.y   } }
  })

  var line = svg.line(this.x1, this.y1, this.x2, this.y2)
                .stroke(strokeLine)

  this.line = line

  end.link = this
  start.link[id] = this

  function remove () {
    broker.emit('delLink', { linkid: id })
  }

  function deselectLine () {
    line.off('click')
        .stroke(strokeLine)
  }

  line.on('mouseout', deselectLine)

  function selectLine () {
    line.on('click', remove)
        .stroke(strokeLineHighlighted)
  }

  line.on('mouseover', selectLine)
}

Link.prototype.render = render

function deleteView () {
  var canvas = this.canvas,
      end    = this.end,
      id     = this.id,
      line   = this.line,
      start  = this.start

  line.remove()

  end.link = null

  delete start.link[id]

  delete canvas.link[id]
}

Link.prototype.deleteView = deleteView

function toJSON () {
  var view = { from: [], to: [] }

  view.from[0] = this.from.id
  view.from[1] = this.start.position

  view.to[0] = this.to.id
  view.to[1] = this.end.position

  return view
}

Link.prototype.toJSON = toJSON

function linePlot () {
  var line = this.line,
      x1   = this.x1,
      y1   = this.y1,
      x2   = this.x2,
      y2   = this.y2

  line.plot(x1, y1, x2, y2)
}

Link.prototype.linePlot = linePlot

module.exports = Link


},{}],15:[function(require,module,exports){

var Input   = require('./Input'),
    Output  = require('./Output')

function Node (canvas, id) {
  this.canvas = canvas
  this.id     = id

  this.group = canvas.svg.group()

  this.ins  = []
  this.outs = []

  this.text = 'callmename'
}

function render (view) {
  var self = this

  var canvas = this.canvas,
      group  = this.group,
      id     = this.id

  var svg   = canvas.svg,
      theme = canvas.theme

  var fillLabel = theme.fillLabel,
      fillRect  = theme.fillRect,
      labelFont = theme.labeFont

  this.text = view.text

  if (typeof view.h === 'undefined')
    view.h = 1

  if (typeof view.w === 'undefined')
    view.w = view.text.length + 2

  var h = view.h * theme.unitHeight,
      w = view.w * theme.unitWidth

  var ins  = view.ins  || [],
      outs = view.outs || []

  var rect = svg.rect(w, h)
                .fill(fillRect)

  var text = svg.text(view.text)
                .fill(fillLabel)
                .back()
                .move(10, 10)
                .font(labelFont)

  group.add(rect)
       .add(text)

  Object.defineProperties(self, {
    'x': { get: function () { return group.x()     } },
    'y': { get: function () { return group.y()     } },
    'w': { get: function () { return rect.width()  } },
    'h': { get: function () { return rect.height() } }
  })

  function createInput (inputView, position) {
    self.addInput(position, inputView)
  }

  ins.forEach(createInput)

  function createOutput (outputView, position) {
    self.addOutput(position, outputView)
  }

  outs.forEach(createOutput)

  function dynamicConstraint (x, y) {
    var horyzontalContraint = (x > 0) && (x < canvas.width  - self.w),
        verticalContraint   = (y > 0) && (y < canvas.height - self.h)

    return { x: horyzontalContraint, y: verticalContraint }
  }

  group.move(view.x, view.y)
       .draggable(dynamicConstraint)

  // Click on a node, without dragging it, actually fires dragstart, dragmove (once)
  // and dragend. It is necessary to keep track of how many dragMoves were to realize if
  // node was really dragged.
  var dragMoves = -1

  function dragend () {
    var eventData = {
      nodeid: id,
      x: self.x,
      y: self.y
    }

    if (dragMoves > 0)
      canvas.broker.emit('moveNode', eventData)
  }

  group.on('dragend', dragend)

  function dragmove () {
    // First time node is clicked, dragMoves will be equal to zero.
    dragMoves++

    self.outs.forEach(function (output) {
      Object.keys(output.link).forEach(function (id) {
        var link = output.link[id]

        if (link)
          link.linePlot()
      })
    })

    self.ins.forEach(function (input) {
      var link = input.link

      if (link)
        link.linePlot()
    })
  }

  group.on('dragmove', dragmove)

  function dragstart () {
    dragMoves = -1
    canvas.nodeControls.detach()
  }

  group.on('dragstart', dragstart)

  function selectNode (ev) {
    ev.stopPropagation()

    var eventData = {
      nodeid: id,
    }

    canvas.broker.emit('selectNode', eventData)
  }

  group.on('click', selectNode)
}

Node.prototype.render = render

/**
 * Get model.
 *
 * @returns {Object} json
 */

function toJSON () {
  var view = { ins: [], outs: [] }

  var ins  = this.ins,
      outs = this.outs

  view.text = this.text

  ins.forEach(function (position) {
    view.ins[position] = ins[position].toJSON()
  })

  outs.forEach(function (position) {
    view.outs[position] = outs[position].toJSON()
  })

  return view
}

Node.prototype.toJSON = toJSON

function deleteView () {
  this.group.remove()

  delete this.canvas.node[this.id]
}

Node.prototype.deleteView = deleteView

function xCoordinateOf (pin) {
  var position = pin.position

  if (position === 0)
    return 0

  var size = pin.size,
      type = pin.type,
      w    = this.w

  var numPins = this[type].length

  if (numPins > 1)
    return position * ((w - size) / (numPins - 1))
}

Node.prototype.xCoordinateOf = xCoordinateOf

function addPin (type, position) {
  var newPin,
      numPins = this[type].length

  if (typeof position === 'undefined')
    position = numPins

  if (type === 'ins')
    newPin = new Input(this, position)

  if (type === 'outs')
    newPin = new Output(this, position)

  this[type].splice(position, 0, newPin)

  newPin.render()

  // Nothing more to do it there is no pin yet.
  if (numPins === 0)
    return

  // Update link view for outputs.
  function updateLinkViews (pin, id) {
    pin.link[id].linePlot()
  }

  // Move existing pins to new position.
  // Start loop on i = 1, the second position. The first pin is not moved.
  // The loop ends at numPins + 1 cause one pin was added.
  for (var i = 1; i < numPins + 1; i++) {
    // Nothing to do for input added right now.
    if (i === position)
      continue

    var pin

    if (i < position)
      pin = this[type][i]

    // After new pin position, it is necessary to use i + 1 as index.
    if (i > position)
      pin = this[type][i + 1]

    var rect   = pin.rect,
        vertex = pin.vertex.relative

    rect.move(vertex.x, vertex.y)

    // Move also any link connected to pin.
    if (type === 'ins')
      if (pin.link)
        pin.link.linePlot()

    if (type === 'outs')
      Object.keys(pin.link)
            .forEach(updateLinkViews.bind(null, pin))
  }
}

function addInput (position) {
  addPin.bind(this)('ins', position)
}

Node.prototype.addInput = addInput

function addOutput (position) {
  addPin.bind(this)('outs', position)
}

Node.prototype.addOutput = addOutput

module.exports = Node


},{"./Input":13,"./Output":22}],16:[function(require,module,exports){

function NodeButton (canvas, relativeCoordinate) {
  this.relativeCoordinate = relativeCoordinate

  this.node = null

  this.canvas = canvas

  this.size = canvas.theme.halfPinSize * 2
  this.group = canvas.svg.group()
}

/**
 * Remove button from currently selected node
 */

function detachNodeButton () {
  this.group.hide()

  this.node = null
}

NodeButton.prototype.detach = detachNodeButton

module.exports = NodeButton


},{}],17:[function(require,module,exports){

var inherits   = require('inherits'),
    NodeButton = require('../NodeButton')

function AddInput (canvas) {
  NodeButton.call(this, canvas)

  var svg   = canvas.svg,
      theme = canvas.theme

  var halfPinSize           = theme.halfPinSize,
      strokeLine            = theme.strokeLine,
      strokeLineHighlighted = theme.strokeLineHighlighted

  var size = halfPinSize * 2
  this.size = size

  var group = svg.group()

  var line1 = svg.line(0, halfPinSize, size, halfPinSize)
                 .stroke(strokeLine)

  var line2 = svg.line(halfPinSize, 0, halfPinSize, size)
                 .stroke(strokeLine)

  group.add(line1)
       .add(line2)
       .hide()

  this.group = group

  function addInput (ev) {
    var node = this.node

    var eventData = {
      nodeid: node.id,
      position: node.ins.length
    }

    canvas.broker.emit('addInput', eventData)
  }

  function deselectButton () {
    group.off('click')

    line1.stroke(strokeLine)
    line2.stroke(strokeLine)
  }

  group.on('mouseout', deselectButton.bind(this))

  function selectButton () {
    group.on('click', addInput.bind(this))

    line1.stroke(strokeLineHighlighted)
    line2.stroke(strokeLineHighlighted)
  }

  group.on('mouseover', selectButton.bind(this))
}

inherits(AddInput, NodeButton)

function attachTo (node) {
  var group = this.group,
      size  = this.size

  group.move(node.x - size, node.y)
       .show()

  this.node = node
}

AddInput.prototype.attachTo = attachTo

module.exports = AddInput


},{"../NodeButton":16,"inherits":7}],18:[function(require,module,exports){

var inherits   = require('inherits'),
    NodeButton = require('../NodeButton')

function AddOutput (canvas) {
  NodeButton.call(this, canvas)

  var svg   = canvas.svg,
      theme = canvas.theme

  var halfPinSize           = theme.halfPinSize,
      strokeLine            = theme.strokeLine,
      strokeLineHighlighted = theme.strokeLineHighlighted

  var size = halfPinSize * 2
  this.size = size

  var group = svg.group()

  var line1 = svg.line(0, halfPinSize, size, halfPinSize)
                 .stroke(strokeLine)

  var line2 = svg.line(halfPinSize, 0, halfPinSize, size)
                 .stroke(strokeLine)

  group.add(line1)
       .add(line2)
       .hide()

  this.group = group

  function addOutput (ev) {
    var node = this.node

    var eventData = {
      nodeid: node.id,
      position: node.outs.length
    }

    canvas.broker.emit('addOutput', eventData)
  }

  function deselectButton () {
    group.off('click')

    line1.stroke(strokeLine)
    line2.stroke(strokeLine)
  }

  group.on('mouseout', deselectButton.bind(this))

  function selectButton () {
    group.on('click', addOutput.bind(this))

    line1.stroke(strokeLineHighlighted)
    line2.stroke(strokeLineHighlighted)
  }

  group.on('mouseover', selectButton.bind(this))
}

inherits(AddOutput, NodeButton)

function attachTo (node) {
  var group = this.group,
      size  = this.size

  group.move(node.x - size, node.y + node.h - size)
       .show()

  this.node = node
}

AddOutput.prototype.attachTo = attachTo

module.exports = AddOutput



},{"../NodeButton":16,"inherits":7}],19:[function(require,module,exports){

var inherits   = require('inherits'),
    NodeButton = require('../NodeButton')

function DeleteNode (canvas) {
  NodeButton.call(this, canvas)

  var svg   = canvas.svg,
      theme = canvas.theme

  var halfPinSize           = theme.halfPinSize,
      strokeLine            = theme.strokeLine,
      strokeLineHighlighted = theme.strokeLineHighlighted

  var size = halfPinSize * 2
  this.size = size

  var group = svg.group()

  var diag1 = svg.line(0, 0, size, size)
                 .stroke(strokeLine)

  var diag2 = svg.line(0, size, size, 0)
                 .stroke(strokeLine)

  group.add(diag1)
       .add(diag2)
       .hide()

  this.group = group

  function delNode () {
    var canvas = this.canvas

    var eventData = { nodeid: this.node.id }

    canvas.nodeControls.detach()

    canvas.broker.emit('delNode', eventData)
  }

  function deselectButton () {
    group.off('click')

    diag1.stroke(strokeLine)
    diag2.stroke(strokeLine)
  }

  group.on('mouseout', deselectButton.bind(this))

  function selectButton () {
    group.on('click', delNode.bind(this))

    diag1.stroke(strokeLineHighlighted)
    diag2.stroke(strokeLineHighlighted)
  }

  group.on('mouseover', selectButton.bind(this))
}

inherits(DeleteNode, NodeButton)

function attachTo (node) {
  var group = this.group,
      size  = this.size

  group.move(node.x + node.w, node.y - size)
       .show()

  this.node = node
}

DeleteNode.prototype.attachTo = attachTo

module.exports = DeleteNode


},{"../NodeButton":16,"inherits":7}],20:[function(require,module,exports){

var AddInputButton   = require('./NodeButton/AddInput'),
    AddOutputButton  = require('./NodeButton/AddOutput'),
    DeleteNodeButton = require('./NodeButton/DeleteNode')

function NodeControls (canvas) {
  this.canvas = canvas

  this.node = null

  var addInputButton   = new AddInputButton(canvas),
      addOutputButton  = new AddOutputButton(canvas),
      deleteNodeButton = new DeleteNodeButton(canvas)

  this.addInputButton   = addInputButton
  this.addOutputButton  = addOutputButton
  this.deleteNodeButton = deleteNodeButton
}

function nodeControlsAttachTo (node) {
  this.addInputButton.attachTo(node)
  this.addOutputButton.attachTo(node)
  this.deleteNodeButton.attachTo(node)
}

NodeControls.prototype.attachTo = nodeControlsAttachTo

function nodeControlsDetach () {
  this.addInputButton.detach()
  this.addOutputButton.detach()
  this.deleteNodeButton.detach()
}

NodeControls.prototype.detach = nodeControlsDetach

module.exports = NodeControls


},{"./NodeButton/AddInput":17,"./NodeButton/AddOutput":18,"./NodeButton/DeleteNode":19}],21:[function(require,module,exports){

// TODO autocompletion from json
// http://blog.teamtreehouse.com/creating-autocomplete-dropdowns-datalist-element

function NodeCreator (canvas) {
  var x = 0
  this.x = x

  var y = 0
  this.y = y

  var foreignObject = canvas.svg.foreignObject(100, 100)
                            .attr({id: 'flow-view-selector'})

  foreignObject.appendChild('form', {id: 'flow-view-selector-form', name: 'nodecreator'})

  var form = foreignObject.getChild(0)

  form.innerHTML = '<input id="flow-view-selector-input" name="selectnode" type="text" />'

  function createNode () {
    foreignObject.hide()

    var inputText = document.getElementById('flow-view-selector-input')

    var nodeName = inputText.value

    var nodeView = {
      text: nodeName,
      x: this.x,
      y: this.y
    }

    canvas.broker.emit('addNode', nodeView)

    // Remove input text, so next time node selector is shown empty again.
    inputText.value = ''

    // It is required to return false to have a form with no action.
    return false
  }

  form.onsubmit = createNode.bind(this)

  // Start hidden.
  foreignObject.attr({width: 200, height: 100})
               .move(x, y)
               .hide()

  this.foreignObject = foreignObject
}

function hideNodeCreator (ev) {
  this.foreignObject.hide()
}

NodeCreator.prototype.hide = hideNodeCreator

function showNodeCreator (ev) {
  var x = ev.offsetX,
      y = ev.offsetY

  var foreignObject = this.foreignObject

  this.x = x
  this.y = y

  foreignObject.move(x, y)
               .show()

  var form = foreignObject.getChild(0)
  form.selectnode.focus()
}

NodeCreator.prototype.show = showNodeCreator

module.exports = NodeCreator


},{}],22:[function(require,module,exports){

var inherits = require('inherits'),
    Pin      = require('./Pin'),
    PreLink  = require('./PreLink')

function Output (node, position) {
  Pin.call(this, 'outs', node, position)

  this.link = {}
}

inherits(Output, Pin)

function render () {
  // TODO for var i in view this.set(i, view[i])
  var self = this

  var fill   = this.fill,
      node   = this.node,
      size   = this.size,
      vertex = this.vertex.relative

  var canvas = node.canvas

  var rect = canvas.svg.rect(size, size)
                   .move(vertex.x, vertex.y)
                   .fill(fill)

  this.rect = rect

  node.group.add(rect)

  var preLink = null

  function mouseoverOutput () {
    preLink = new PreLink(canvas, self)
  }

  rect.on('mouseover', mouseoverOutput)
}

Output.prototype.render = render

module.exports = Output


},{"./Pin":23,"./PreLink":24,"inherits":7}],23:[function(require,module,exports){

function Pin (type, node, position) {
  var self = this

  this.type     = type
  this.node     = node
  this.position = position

  var canvas = node.canvas

  var theme = canvas.theme

  var fill     = theme.fillPin,
      halfSize = theme.halfPinSize

  this.fill = fill

  this.halfSize = halfSize

  var size = halfSize * 2
  this.size = size

  function getVertex () {
    var vertex = {
          absolute: {},
          relative: {}
        }

    vertex.relative.x = node.xCoordinateOf(self)

    if (type === 'ins')
      vertex.relative.y = 0
    if (type === 'outs')
      vertex.relative.y = node.h - size

    vertex.absolute.x = vertex.relative.x + node.x
    vertex.absolute.y = vertex.relative.y + node.y

    return vertex
  }

  Object.defineProperty(this, 'vertex', { get: getVertex })

  function getCenter () {
    var center = {
          absolute: {},
          relative: {}
        }

    var vertex = this.vertex

    center.relative.x = vertex.relative.x + halfSize
    center.relative.y = vertex.relative.y + halfSize
    center.absolute.x = center.relative.x + node.x
    center.absolute.y = center.relative.y + node.y

    return center
  }

  Object.defineProperty(this, 'center', { get: getCenter })

}

function get (id) {
  return this.node[this.type][this.position][id]
}

Pin.prototype.get = get

function has (id) {
  return typeof this.node[this.type][this.position][id] !== 'undefined'
}

Pin.prototype.has = has

function set (id, data) {
  this.node[this.type][this.position][id] = data
}

Pin.prototype.set = set

function toJSON () {
  var node     = this.node,
      position = this.position,
      type     = this.type

  return node[type][position]
}

Pin.prototype.toJSON = toJSON

module.exports = Pin


},{}],24:[function(require,module,exports){

/**
 * A link that is not already attached
 *
 * @param {Object} canvas
 * @param {Object} output
 */

function PreLink (canvas, output) {
  var svg   = canvas.svg,
      theme = canvas.theme

  var fillPinHighlighted = theme.fillPinHighlighted,
      halfPinSize        = theme.halfPinSize,
      strokeLine         = theme.strokeLine,
      strokeDasharray    = theme.strokeDasharray

  var pinSize = halfPinSize * 2

  var rect = svg.rect(pinSize, pinSize)
                .fill(fillPinHighlighted)
                .move(output.vertex.absolute.x, output.vertex.absolute.y)
                .draggable()

  Object.defineProperty(this, 'x1', { get: function () { return output.center.absolute.x } })
  Object.defineProperty(this, 'y1', { get: function () { return output.center.absolute.y } })
  Object.defineProperty(this, 'x2', { get: function () { return rect.x() + halfPinSize } })
  Object.defineProperty(this, 'y2', { get: function () { return rect.y() + halfPinSize } })

  var line = svg.line(this.x1, this.y1, this.x2, this.y2)
                .stroke(strokeLine)
                .attr('stroke-dasharray', strokeDasharray)

  function remove () {
    output.preLink = null
    rect.remove()
    line.remove()
  }

  rect.on('mouseout', remove)

  function beforedrag () {
    rect.off('mouseout')
  }

  rect.on('beforedrag', beforedrag)

  function dragmove () {
    line.plot(this.x1, this.y1, this.x2, this.y2)
  }

  rect.on('dragmove', dragmove.bind(this))

  function dragend () {
    // After dragging, the preLink is no longer necessary.
    remove()

    var center = {}

    //center.x = rect.x() + halfPinSize
    center.x = this.x2
    //center.y = rect.y() + halfPinSize
    center.y = this.y2

    function isInside (center) {
      function centerIsInside (bbox, x, y) {
        var centerIsInsideX = ((center.x >= bbox.x + x) && (center.x <= bbox.x2 + x)),
            centerIsInsideY = ((center.y >= bbox.y + y) && (center.y <= bbox.y2 + y))

        return centerIsInsideX && centerIsInsideY
      }

      return centerIsInside
    }

    var centerIsInside = isInside(center)

    /**
     * Given a node, loop over its ins.
     * If center is inside input, create a Link.
     */

    function dropOn (node) {
      node.ins.forEach(function (input) {
        if (input.link !== null)
          return

        var bbox = input.rect.bbox(),
            x    = input.node.group.x(),
            y    = input.node.group.y()

        var centerIsInsideInput = centerIsInside(bbox, x, y)

        if (centerIsInsideInput) {
          var view = {
            from: [output.node.id, output.position],
            to: [node.id, input.position]
          }

          //canvas.addLink(view)
          canvas.broker.emit('addLink', view)
        }
      })
    }

    // Loop over all nodes. If center is inside node, drop on it.
    Object.keys(canvas.node).forEach(function (id) {
      var node = canvas.node[id]

      var bbox = node.group.bbox(),
            x  = node.x,
            y  = node.y

        var centerIsInsideBox = centerIsInside(bbox, x, y)

      if (centerIsInsideBox)
        dropOn(node)
    })
  }

  rect.on('dragend', dragend.bind(this))
}

module.exports = PreLink


},{}],25:[function(require,module,exports){
module.exports={
  "fillCircle": "#fff",
  "fillLabel": "#333",
    "fillPin": "#333",
  "fillPinHighlighted": "#d63518",
  "fillRect": "#ccc",
  "halfPinSize": 5,
  "labelFont": {
    "family": "Consolas",
    "size": 17,
    "anchor": "start"
  },
  "strokeDasharray": "5, 5",
  "strokeLine": {
    "color": "#333",
    "width": 3
  },
  "strokeLineHighlighted": {
    "color": "#d63518",
    "width": 4
  },
  "unitHeight": 40,
  "unitWidth": 10
}

},{}],26:[function(require,module,exports){
module.exports={
  "node": {},
  "link": {}
}

},{}],27:[function(require,module,exports){

exports.Canvas = require('./Canvas')


},{"./Canvas":12}],28:[function(require,module,exports){

function validate (view) {
  if (typeof view !== 'object')
    throw new TypeError()

  if (typeof view.node !== 'object')
    throw new TypeError()

  if (typeof view.link !== 'object')
    throw new TypeError()
}

module.exports = validate


},{}],29:[function(require,module,exports){

// Consider this module will be browserified.

// Load svg.js first ...
var SVG = require('svg.js')

// ... then load plugins: since plugins do not use *module.exports*, they are
// loaded as plain text, and when browserified they will be included in the bundle.
require('svg.draggable.js')
require('svg.foreignobject.js')

// Note that, in order to be included as expected by browserify, dynamic imports
// do not work: for instance a code like the following won't work client-side
//
//    ['svg.draggable.js', 'svg.foreignobject.js'].forEach(require)
//

module.exports = SVG


},{"svg.draggable.js":8,"svg.foreignobject.js":9,"svg.js":10}],30:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],31:[function(require,module,exports){
(function (Buffer){


var insertCss = require('insert-css')
var socket = io()

var normalize = Buffer("LyohIG5vcm1hbGl6ZS5jc3MgdjMuMC4zIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqLwoKLyoqCiAqIDEuIFNldCBkZWZhdWx0IGZvbnQgZmFtaWx5IHRvIHNhbnMtc2VyaWYuCiAqIDIuIFByZXZlbnQgaU9TIGFuZCBJRSB0ZXh0IHNpemUgYWRqdXN0IGFmdGVyIGRldmljZSBvcmllbnRhdGlvbiBjaGFuZ2UsCiAqICAgIHdpdGhvdXQgZGlzYWJsaW5nIHVzZXIgem9vbS4KICovCgpodG1sIHsKICBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgLyogMSAqLwogIC1tcy10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovCiAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovCn0KCi8qKgogKiBSZW1vdmUgZGVmYXVsdCBtYXJnaW4uCiAqLwoKYm9keSB7CiAgbWFyZ2luOiAwOwp9CgovKiBIVE1MNSBkaXNwbGF5IGRlZmluaXRpb25zCiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovCgovKioKICogQ29ycmVjdCBgYmxvY2tgIGRpc3BsYXkgbm90IGRlZmluZWQgZm9yIGFueSBIVE1MNSBlbGVtZW50IGluIElFIDgvOS4KICogQ29ycmVjdCBgYmxvY2tgIGRpc3BsYXkgbm90IGRlZmluZWQgZm9yIGBkZXRhaWxzYCBvciBgc3VtbWFyeWAgaW4gSUUgMTAvMTEKICogYW5kIEZpcmVmb3guCiAqIENvcnJlY3QgYGJsb2NrYCBkaXNwbGF5IG5vdCBkZWZpbmVkIGZvciBgbWFpbmAgaW4gSUUgMTEuCiAqLwoKYXJ0aWNsZSwKYXNpZGUsCmRldGFpbHMsCmZpZ2NhcHRpb24sCmZpZ3VyZSwKZm9vdGVyLApoZWFkZXIsCmhncm91cCwKbWFpbiwKbWVudSwKbmF2LApzZWN0aW9uLApzdW1tYXJ5IHsKICBkaXNwbGF5OiBibG9jazsKfQoKLyoqCiAqIDEuIENvcnJlY3QgYGlubGluZS1ibG9ja2AgZGlzcGxheSBub3QgZGVmaW5lZCBpbiBJRSA4LzkuCiAqIDIuIE5vcm1hbGl6ZSB2ZXJ0aWNhbCBhbGlnbm1lbnQgb2YgYHByb2dyZXNzYCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS4KICovCgphdWRpbywKY2FudmFzLApwcm9ncmVzcywKdmlkZW8gewogIGRpc3BsYXk6IGlubGluZS1ibG9jazsgLyogMSAqLwogIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTsgLyogMiAqLwp9CgovKioKICogUHJldmVudCBtb2Rlcm4gYnJvd3NlcnMgZnJvbSBkaXNwbGF5aW5nIGBhdWRpb2Agd2l0aG91dCBjb250cm9scy4KICogUmVtb3ZlIGV4Y2VzcyBoZWlnaHQgaW4gaU9TIDUgZGV2aWNlcy4KICovCgphdWRpbzpub3QoW2NvbnRyb2xzXSkgewogIGRpc3BsYXk6IG5vbmU7CiAgaGVpZ2h0OiAwOwp9CgovKioKICogQWRkcmVzcyBgW2hpZGRlbl1gIHN0eWxpbmcgbm90IHByZXNlbnQgaW4gSUUgOC85LzEwLgogKiBIaWRlIHRoZSBgdGVtcGxhdGVgIGVsZW1lbnQgaW4gSUUgOC85LzEwLzExLCBTYWZhcmksIGFuZCBGaXJlZm94IDwgMjIuCiAqLwoKW2hpZGRlbl0sCnRlbXBsYXRlIHsKICBkaXNwbGF5OiBub25lOwp9CgovKiBMaW5rcwogICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqLwoKLyoqCiAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIGNvbG9yIGZyb20gYWN0aXZlIGxpbmtzIGluIElFIDEwLgogKi8KCmEgewogIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50Owp9CgovKioKICogSW1wcm92ZSByZWFkYWJpbGl0eSBvZiBmb2N1c2VkIGVsZW1lbnRzIHdoZW4gdGhleSBhcmUgYWxzbyBpbiBhbgogKiBhY3RpdmUvaG92ZXIgc3RhdGUuCiAqLwoKYTphY3RpdmUsCmE6aG92ZXIgewogIG91dGxpbmU6IDA7Cn0KCi8qIFRleHQtbGV2ZWwgc2VtYW50aWNzCiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovCgovKioKICogQWRkcmVzcyBzdHlsaW5nIG5vdCBwcmVzZW50IGluIElFIDgvOS8xMC8xMSwgU2FmYXJpLCBhbmQgQ2hyb21lLgogKi8KCmFiYnJbdGl0bGVdIHsKICBib3JkZXItYm90dG9tOiAxcHggZG90dGVkOwp9CgovKioKICogQWRkcmVzcyBzdHlsZSBzZXQgdG8gYGJvbGRlcmAgaW4gRmlyZWZveCA0KywgU2FmYXJpLCBhbmQgQ2hyb21lLgogKi8KCmIsCnN0cm9uZyB7CiAgZm9udC13ZWlnaHQ6IGJvbGQ7Cn0KCi8qKgogKiBBZGRyZXNzIHN0eWxpbmcgbm90IHByZXNlbnQgaW4gU2FmYXJpIGFuZCBDaHJvbWUuCiAqLwoKZGZuIHsKICBmb250LXN0eWxlOiBpdGFsaWM7Cn0KCi8qKgogKiBBZGRyZXNzIHZhcmlhYmxlIGBoMWAgZm9udC1zaXplIGFuZCBtYXJnaW4gd2l0aGluIGBzZWN0aW9uYCBhbmQgYGFydGljbGVgCiAqIGNvbnRleHRzIGluIEZpcmVmb3ggNCssIFNhZmFyaSwgYW5kIENocm9tZS4KICovCgpoMSB7CiAgZm9udC1zaXplOiAyZW07CiAgbWFyZ2luOiAwLjY3ZW0gMDsKfQoKLyoqCiAqIEFkZHJlc3Mgc3R5bGluZyBub3QgcHJlc2VudCBpbiBJRSA4LzkuCiAqLwoKbWFyayB7CiAgYmFja2dyb3VuZDogI2ZmMDsKICBjb2xvcjogIzAwMDsKfQoKLyoqCiAqIEFkZHJlc3MgaW5jb25zaXN0ZW50IGFuZCB2YXJpYWJsZSBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLgogKi8KCnNtYWxsIHsKICBmb250LXNpemU6IDgwJTsKfQoKLyoqCiAqIFByZXZlbnQgYHN1YmAgYW5kIGBzdXBgIGFmZmVjdGluZyBgbGluZS1oZWlnaHRgIGluIGFsbCBicm93c2Vycy4KICovCgpzdWIsCnN1cCB7CiAgZm9udC1zaXplOiA3NSU7CiAgbGluZS1oZWlnaHQ6IDA7CiAgcG9zaXRpb246IHJlbGF0aXZlOwogIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTsKfQoKc3VwIHsKICB0b3A6IC0wLjVlbTsKfQoKc3ViIHsKICBib3R0b206IC0wLjI1ZW07Cn0KCi8qIEVtYmVkZGVkIGNvbnRlbnQKICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi8KCi8qKgogKiBSZW1vdmUgYm9yZGVyIHdoZW4gaW5zaWRlIGBhYCBlbGVtZW50IGluIElFIDgvOS8xMC4KICovCgppbWcgewogIGJvcmRlcjogMDsKfQoKLyoqCiAqIENvcnJlY3Qgb3ZlcmZsb3cgbm90IGhpZGRlbiBpbiBJRSA5LzEwLzExLgogKi8KCnN2Zzpub3QoOnJvb3QpIHsKICBvdmVyZmxvdzogaGlkZGVuOwp9CgovKiBHcm91cGluZyBjb250ZW50CiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovCgovKioKICogQWRkcmVzcyBtYXJnaW4gbm90IHByZXNlbnQgaW4gSUUgOC85IGFuZCBTYWZhcmkuCiAqLwoKZmlndXJlIHsKICBtYXJnaW46IDFlbSA0MHB4Owp9CgovKioKICogQWRkcmVzcyBkaWZmZXJlbmNlcyBiZXR3ZWVuIEZpcmVmb3ggYW5kIG90aGVyIGJyb3dzZXJzLgogKi8KCmhyIHsKICBib3gtc2l6aW5nOiBjb250ZW50LWJveDsKICBoZWlnaHQ6IDA7Cn0KCi8qKgogKiBDb250YWluIG92ZXJmbG93IGluIGFsbCBicm93c2Vycy4KICovCgpwcmUgewogIG92ZXJmbG93OiBhdXRvOwp9CgovKioKICogQWRkcmVzcyBvZGQgYGVtYC11bml0IGZvbnQgc2l6ZSByZW5kZXJpbmcgaW4gYWxsIGJyb3dzZXJzLgogKi8KCmNvZGUsCmtiZCwKcHJlLApzYW1wIHsKICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7CiAgZm9udC1zaXplOiAxZW07Cn0KCi8qIEZvcm1zCiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovCgovKioKICogS25vd24gbGltaXRhdGlvbjogYnkgZGVmYXVsdCwgQ2hyb21lIGFuZCBTYWZhcmkgb24gT1MgWCBhbGxvdyB2ZXJ5IGxpbWl0ZWQKICogc3R5bGluZyBvZiBgc2VsZWN0YCwgdW5sZXNzIGEgYGJvcmRlcmAgcHJvcGVydHkgaXMgc2V0LgogKi8KCi8qKgogKiAxLiBDb3JyZWN0IGNvbG9yIG5vdCBiZWluZyBpbmhlcml0ZWQuCiAqICAgIEtub3duIGlzc3VlOiBhZmZlY3RzIGNvbG9yIG9mIGRpc2FibGVkIGVsZW1lbnRzLgogKiAyLiBDb3JyZWN0IGZvbnQgcHJvcGVydGllcyBub3QgYmVpbmcgaW5oZXJpdGVkLgogKiAzLiBBZGRyZXNzIG1hcmdpbnMgc2V0IGRpZmZlcmVudGx5IGluIEZpcmVmb3ggNCssIFNhZmFyaSwgYW5kIENocm9tZS4KICovCgpidXR0b24sCmlucHV0LApvcHRncm91cCwKc2VsZWN0LAp0ZXh0YXJlYSB7CiAgY29sb3I6IGluaGVyaXQ7IC8qIDEgKi8KICBmb250OiBpbmhlcml0OyAvKiAyICovCiAgbWFyZ2luOiAwOyAvKiAzICovCn0KCi8qKgogKiBBZGRyZXNzIGBvdmVyZmxvd2Agc2V0IHRvIGBoaWRkZW5gIGluIElFIDgvOS8xMC8xMS4KICovCgpidXR0b24gewogIG92ZXJmbG93OiB2aXNpYmxlOwp9CgovKioKICogQWRkcmVzcyBpbmNvbnNpc3RlbnQgYHRleHQtdHJhbnNmb3JtYCBpbmhlcml0YW5jZSBmb3IgYGJ1dHRvbmAgYW5kIGBzZWxlY3RgLgogKiBBbGwgb3RoZXIgZm9ybSBjb250cm9sIGVsZW1lbnRzIGRvIG5vdCBpbmhlcml0IGB0ZXh0LXRyYW5zZm9ybWAgdmFsdWVzLgogKiBDb3JyZWN0IGBidXR0b25gIHN0eWxlIGluaGVyaXRhbmNlIGluIEZpcmVmb3gsIElFIDgvOS8xMC8xMSwgYW5kIE9wZXJhLgogKiBDb3JyZWN0IGBzZWxlY3RgIHN0eWxlIGluaGVyaXRhbmNlIGluIEZpcmVmb3guCiAqLwoKYnV0dG9uLApzZWxlY3QgewogIHRleHQtdHJhbnNmb3JtOiBub25lOwp9CgovKioKICogMS4gQXZvaWQgdGhlIFdlYktpdCBidWcgaW4gQW5kcm9pZCA0LjAuKiB3aGVyZSAoMikgZGVzdHJveXMgbmF0aXZlIGBhdWRpb2AKICogICAgYW5kIGB2aWRlb2AgY29udHJvbHMuCiAqIDIuIENvcnJlY3QgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSBgaW5wdXRgIHR5cGVzIGluIGlPUy4KICogMy4gSW1wcm92ZSB1c2FiaWxpdHkgYW5kIGNvbnNpc3RlbmN5IG9mIGN1cnNvciBzdHlsZSBiZXR3ZWVuIGltYWdlLXR5cGUKICogICAgYGlucHV0YCBhbmQgb3RoZXJzLgogKi8KCmJ1dHRvbiwKaHRtbCBpbnB1dFt0eXBlPSJidXR0b24iXSwgLyogMSAqLwppbnB1dFt0eXBlPSJyZXNldCJdLAppbnB1dFt0eXBlPSJzdWJtaXQiXSB7CiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDIgKi8KICBjdXJzb3I6IHBvaW50ZXI7IC8qIDMgKi8KfQoKLyoqCiAqIFJlLXNldCBkZWZhdWx0IGN1cnNvciBmb3IgZGlzYWJsZWQgZWxlbWVudHMuCiAqLwoKYnV0dG9uW2Rpc2FibGVkXSwKaHRtbCBpbnB1dFtkaXNhYmxlZF0gewogIGN1cnNvcjogZGVmYXVsdDsKfQoKLyoqCiAqIFJlbW92ZSBpbm5lciBwYWRkaW5nIGFuZCBib3JkZXIgaW4gRmlyZWZveCA0Ky4KICovCgpidXR0b246Oi1tb3otZm9jdXMtaW5uZXIsCmlucHV0OjotbW96LWZvY3VzLWlubmVyIHsKICBib3JkZXI6IDA7CiAgcGFkZGluZzogMDsKfQoKLyoqCiAqIEFkZHJlc3MgRmlyZWZveCA0KyBzZXR0aW5nIGBsaW5lLWhlaWdodGAgb24gYGlucHV0YCB1c2luZyBgIWltcG9ydGFudGAgaW4KICogdGhlIFVBIHN0eWxlc2hlZXQuCiAqLwoKaW5wdXQgewogIGxpbmUtaGVpZ2h0OiBub3JtYWw7Cn0KCi8qKgogKiBJdCdzIHJlY29tbWVuZGVkIHRoYXQgeW91IGRvbid0IGF0dGVtcHQgdG8gc3R5bGUgdGhlc2UgZWxlbWVudHMuCiAqIEZpcmVmb3gncyBpbXBsZW1lbnRhdGlvbiBkb2Vzbid0IHJlc3BlY3QgYm94LXNpemluZywgcGFkZGluZywgb3Igd2lkdGguCiAqCiAqIDEuIEFkZHJlc3MgYm94IHNpemluZyBzZXQgdG8gYGNvbnRlbnQtYm94YCBpbiBJRSA4LzkvMTAuCiAqIDIuIFJlbW92ZSBleGNlc3MgcGFkZGluZyBpbiBJRSA4LzkvMTAuCiAqLwoKaW5wdXRbdHlwZT0iY2hlY2tib3giXSwKaW5wdXRbdHlwZT0icmFkaW8iXSB7CiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqLwogIHBhZGRpbmc6IDA7IC8qIDIgKi8KfQoKLyoqCiAqIEZpeCB0aGUgY3Vyc29yIHN0eWxlIGZvciBDaHJvbWUncyBpbmNyZW1lbnQvZGVjcmVtZW50IGJ1dHRvbnMuIEZvciBjZXJ0YWluCiAqIGBmb250LXNpemVgIHZhbHVlcyBvZiB0aGUgYGlucHV0YCwgaXQgY2F1c2VzIHRoZSBjdXJzb3Igc3R5bGUgb2YgdGhlCiAqIGRlY3JlbWVudCBidXR0b24gdG8gY2hhbmdlIGZyb20gYGRlZmF1bHRgIHRvIGB0ZXh0YC4KICovCgppbnB1dFt0eXBlPSJudW1iZXIiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbiwKaW5wdXRbdHlwZT0ibnVtYmVyIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24gewogIGhlaWdodDogYXV0bzsKfQoKLyoqCiAqIDEuIEFkZHJlc3MgYGFwcGVhcmFuY2VgIHNldCB0byBgc2VhcmNoZmllbGRgIGluIFNhZmFyaSBhbmQgQ2hyb21lLgogKiAyLiBBZGRyZXNzIGBib3gtc2l6aW5nYCBzZXQgdG8gYGJvcmRlci1ib3hgIGluIFNhZmFyaSBhbmQgQ2hyb21lLgogKi8KCmlucHV0W3R5cGU9InNlYXJjaCJdIHsKICAtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDsgLyogMSAqLwogIGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAyICovCn0KCi8qKgogKiBSZW1vdmUgaW5uZXIgcGFkZGluZyBhbmQgc2VhcmNoIGNhbmNlbCBidXR0b24gaW4gU2FmYXJpIGFuZCBDaHJvbWUgb24gT1MgWC4KICogU2FmYXJpIChidXQgbm90IENocm9tZSkgY2xpcHMgdGhlIGNhbmNlbCBidXR0b24gd2hlbiB0aGUgc2VhcmNoIGlucHV0IGhhcwogKiBwYWRkaW5nIChhbmQgYHRleHRmaWVsZGAgYXBwZWFyYW5jZSkuCiAqLwoKaW5wdXRbdHlwZT0ic2VhcmNoIl06Oi13ZWJraXQtc2VhcmNoLWNhbmNlbC1idXR0b24sCmlucHV0W3R5cGU9InNlYXJjaCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHsKICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7Cn0KCi8qKgogKiBEZWZpbmUgY29uc2lzdGVudCBib3JkZXIsIG1hcmdpbiwgYW5kIHBhZGRpbmcuCiAqLwoKZmllbGRzZXQgewogIGJvcmRlcjogMXB4IHNvbGlkICNjMGMwYzA7CiAgbWFyZ2luOiAwIDJweDsKICBwYWRkaW5nOiAwLjM1ZW0gMC42MjVlbSAwLjc1ZW07Cn0KCi8qKgogKiAxLiBDb3JyZWN0IGBjb2xvcmAgbm90IGJlaW5nIGluaGVyaXRlZCBpbiBJRSA4LzkvMTAvMTEuCiAqIDIuIFJlbW92ZSBwYWRkaW5nIHNvIHBlb3BsZSBhcmVuJ3QgY2F1Z2h0IG91dCBpZiB0aGV5IHplcm8gb3V0IGZpZWxkc2V0cy4KICovCgpsZWdlbmQgewogIGJvcmRlcjogMDsgLyogMSAqLwogIHBhZGRpbmc6IDA7IC8qIDIgKi8KfQoKLyoqCiAqIFJlbW92ZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSA4LzkvMTAvMTEuCiAqLwoKdGV4dGFyZWEgewogIG92ZXJmbG93OiBhdXRvOwp9CgovKioKICogRG9uJ3QgaW5oZXJpdCB0aGUgYGZvbnQtd2VpZ2h0YCAoYXBwbGllZCBieSBhIHJ1bGUgYWJvdmUpLgogKiBOT1RFOiB0aGUgZGVmYXVsdCBjYW5ub3Qgc2FmZWx5IGJlIGNoYW5nZWQgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gT1MgWC4KICovCgpvcHRncm91cCB7CiAgZm9udC13ZWlnaHQ6IGJvbGQ7Cn0KCi8qIFRhYmxlcwogICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqLwoKLyoqCiAqIFJlbW92ZSBtb3N0IHNwYWNpbmcgYmV0d2VlbiB0YWJsZSBjZWxscy4KICovCgp0YWJsZSB7CiAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTsKICBib3JkZXItc3BhY2luZzogMDsKfQoKdGQsCnRoIHsKICBwYWRkaW5nOiAwOwp9Cg==","base64")
insertCss(normalize)

var style = Buffer("Ci5kZmxvdy1pbnNwZWN0b3IgewogIGJhY2tncm91bmQtY29sb3I6IHdoaXRlc21va2U7CiAgYm9yZGVyLXN0eWxlOiBub25lOwp9CgojaW5zcGVjdG9yIHsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgZmxvYXQ6IGxlZnQ7CiAgd2lkdGg6IDIwMHB4OwogIGhlaWdodDogMTAwJTsKfQoKLmRmbG93LWdyYXBoIHsKICBiYWNrZ3JvdW5kLWNvbG9yOiBzbm93OwogIGJvcmRlci1zdHlsZTogZ3Jvb3ZlOwp9CgojZ3JhcGggewogIG92ZXJmbG93LXg6IGhpZGRlbjsKICBtYXJnaW4tbGVmdDogMjAwcHg7Cn0KCiN0b29sYmFyIHt9CgojY29udGFpbmVyIHsKICBvdmVyZmxvdzogaGlkZGVuOwogIHBvc2l0aW9uOiByZWxhdGl2ZTsKICB3aWR0aDogMTAwJTsKfQoKI3Rhc2stbmFtZTo6YmVmb3JlIHsKICBjb250ZW50OiAidGFzazogIgp9CgojdGFzay1pZDo6YmVmb3JlIHsKICBjb250ZW50OiAiaWQ6ICIKfQoKI3Rhc2stZGF0YSB7CiAgZGlzcGxheTogbm9uZTsKfQoKI3Rhc2stZGF0YTo6YmVmb3JlIHsKICBjb250ZW50OiAiZGF0YTogIgp9Cgo=","base64")
insertCss(style)

var regexAccessor = require('../../engine/regex/accessor')

window.onload = function () {
  var Canvas = require('flow-view').Canvas
  var canvas = new Canvas('graph')

  var canvasMethods = ['addLink' , 'addNode',
                       'delLink' , 'delNode']

  canvasMethods.forEach(function (methodName) {
    canvas.broker.removeAllListeners(methodName)

    canvas.broker.on(methodName, function (ev) {
      socket.emit(methodName, ev)
    })

    socket.on(methodName, function (data) {
      canvas[methodName](data)
    })
  })

  var nodeMethods = ['addInput', 'addOutput']

  nodeMethods.forEach(function (methodName) {
    canvas.broker.removeAllListeners(methodName)

    canvas.broker.on(methodName, function (ev) {
      socket.emit(methodName, ev)
    })

    socket.on(methodName, function (data) {
      var id       = data.nodeid,
          position = data.position

      var node = canvas.node[id]

      node[methodName](position)
    })
  })

  canvas.broker.on('moveNode', function (ev) {
    socket.emit('moveNode', ev)
  })

  canvas.broker.on('selectNode', function (ev) {
    var id = ev.nodeid

    var node = canvas.node[id]

    var nodeJSON = node.toJSON()

    var taskName = nodeJSON.text

    var taskNameElement = document.getElementById('task-name')
    var taskIdElement = document.getElementById('task-id')
    var taskDataElement = document.getElementById('task-data')

    taskNameElement.innerHTML = taskName
    taskIdElement.innerHTML = id

    if (regexAccessor.test(taskName))
      taskDataElement.style.display = 'block'
    else
      taskDataElement.style.display = 'none'
  })

  socket.on('moveNode', function (data) {
    var x  = data.x
        y  = data.y

    var node = canvas.node[data.nodeid]

    node.group.move(x, y)

    node.outs.forEach(function (output) {
      Object.keys(output.link).forEach(function (id) {
        var link = output.link[id]

        if (link)
          link.linePlot()
      })
    })

    node.ins.forEach(function (input) {
      var link = input.link

      if (link)
        link.linePlot()
    })
  })

  socket.on('loadGraph', function (graph) {
    canvas.deleteView()
    canvas.render(graph.view)
  })
}


}).call(this,require("buffer").Buffer)
},{"../../engine/regex/accessor":32,"buffer":1,"flow-view":6,"insert-css":30}],32:[function(require,module,exports){

module.exports = /^@[\w][\w\d]+$/


},{}]},{},[31]);
