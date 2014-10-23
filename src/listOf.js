
/**
 * Build a list of object keys and their content.
 *
 * { "foo": { "bar": 2 } ==> [ { "key": "foo", "bar": 2 } ]
 *
 * @param {Object} obj
 *
 * @returns {Array} list of items
 */

function listOf (obj) {
  var list = []

  function pushToList (key) {
    var item = obj[key]
    item.key = key
    list.push(item)
  }

  Object.keys(obj).forEach(pushToList)

  return list
}

module.exports = listOf

