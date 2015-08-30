
/**
 * Enable debug.
 *
 * ```
 * export DEBUG=dflow:*
 * ```
 *
 */

var debug = require('debug')

exports.compile = debug('dflow:compile')
exports.inject  = debug('dflow:inject')
exports.run     = debug('dflow:run')

