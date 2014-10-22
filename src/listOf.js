
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

