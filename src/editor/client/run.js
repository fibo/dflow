
var dflow = require('dflow')

var xmlhttp = new XMLHttpRequest()

function runGraph () {
  if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
    var graph = JSON.parse(xmlhttp.responseText)
    var f = dflow.fun(graph)
    f()
  }
}

xmlhttp.onreadystatechange = runGraph
xmlhttp.open("GET", '/graph', true)
xmlhttp.send()

