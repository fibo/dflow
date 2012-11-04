
var $addNode = $('dflow-add-node');
var $cursor = $('dflow-cursor');
var $graph = $('dflow-graph');

var doNothing = function () {}

var draw = function (rootToJSON) {
  var nodes = rootToJSON.nodes;

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    addNode(node);
  }
}

var socket = io.connect();

socket.on('connect', doNothing);

socket.on('addNode', function (nodeToJSON) {
  addNode(nodeToJSON);
});

socket.on('disconnect', doNothing);

socket.emit('draw', 'myself', function (root) {
  draw(root);
});

var canvas = document.getElementById('dflow-canvas');
var graph = document.getElementById('dflow-graph');
var cursor = document.getElementById('dflow-cursor');
var addNodeDiv = document.getElementById('dflow-add-node');

var dragging = false;


var Box = function (elementToJSON) {
  var self = this;

  var _dragging;

  var _id = elementToJSON.id;
  var parentId = elementToJSON.parentId;

  var _element = document.createElement('div');
  var _parentElement = document.getElementById(parentId);

  _element.id = _id;
  _element.className = 'dflow-node'; // TODO dflow-box
  var x = elementToJSON.style.left;
  var y = elementToJSON.style.top;
  //_element.style.left = x + 'px';
  //_element.style.top  = y + 'px';
  _element.style.height = 50 + 'px';
  _element.style.width = 100 + 'px';
  _parentElement.appendChild(_element);

  self.makeDraggable = function () {
    _dragging = false;

    var mouseX, mouseY;

    _element.addEventListener('mousedown', function (ev) {
      ev.stopPropagation();
	    console.log('xxx');
      _dragging = true;
      mouseX = ev.offsetX;
      mouseY = ev.offsetY;
    });

    _parentElement.addEventListener('mousemove', function (ev) {
      ev.stopPropagation();

      if (_dragging === false) return;

      var dX = ev.offsetX - mouseX;
      var dY = ev.offsetY - mouseY;

      var position = self.getPosition();

      position.x += dX;
      position.y += dY;

      self.setPosition(position);

      mouseX = ev.offsetX;
      mouseY = ev.offsetY;
    });

    _element.addEventListener('mouseup', function (ev) {
      _dragging = false;
    });
  }

  self.getPosition = function () {
    var position = {x: 0, y: 0};
    var xText = _element.style.left;
    var yText = _element.style.top;

    position.x = parseInt(xText.substring(0, xText.length - 2));
    position.y = parseInt(yText.substring(0, yText.length - 2));

    return position;
  }

  self.setPosition = function (position) {
    _element.style.left = position.x + 'px';
    _element.style.top  = position.y + 'px';
  }

  self.setPosition({x: x, y: y});
}

var box = new Box({id:'foo',parentId:'dflow-graph',style:{left:100,top:100}});
box.makeDraggable();

graph.addEventListener('mousedown', function (ev) {
  console.log(ev);
  dragging = true;
});

cursor.addEventListener('click', function (ev) {
  ev.stopPropagation();
});

graph.addEventListener('click', function (ev) {
  ev.stopPropagation();

cursor.style.left = ev.offsetX + 'px';
cursor.style.top = ev.offsetY + 'px';

if (cursor.style.display == 'none' ) {
  cursor.style.display = 'block';
}
});

addNodeDiv.addEventListener('click', function (ev) {
  console.log('click1');
});
addNodeDiv.addEventListener('click', function (ev) {
  console.log('click2');
});
addNodeDiv.addEventListener('click', function (ev) {
  ev.stopPropagation();
  var position = getPosition('dflow-cursor');

  cursor.style.display = 'none';

  console.log(position);
  dragging = true;
  var arg = {
    style: {
      top: position.y,
      left: position.x
    }
  };
  console.log(arg);
  socket.emit('addNode', arg);
});

addNodeDiv.addEventListener('mouseup', function (ev) {
  dragging = false;
});

addNodeDiv.addEventListener('mousemove', function (ev) {
  ev.stopPropagation();
  if (!dragging) return;
});

var size = $graph.getSize();
canvas.width = size.x;
canvas.height = size.y;
var context2d = canvas.getContext('2d');

var rect = function () {
context2d.fillStyle = "rgb(150,29,28)";
context2d.fillRect(10,10,28,28);
}


// Put $cursor in the middle of $graph.
//$cursor.position({relativeTo:'dflow-graph'});
cursor.style.left = 100 + 'px';
cursor.style.top = 100 + 'px';
//$cursor.makeDraggable({container:$graph});

var addNode = function (nodeToJSON) {
  var id = nodeToJSON.id;

  var nodeDiv = document.createElement('div');
  var nodeDivId = 'node-' + id;

  nodeDiv.id = nodeDivId;
  nodeDiv.className = 'dflow-node';
  var x = nodeToJSON.style.left;
  var y = nodeToJSON.style.top;
  //nodeDiv.style.left = nodeToJSON.style.left;
  nodeDiv.style.left = x + 'px';
  nodeDiv.style.top = y + 'px';
  nodeDiv.style.height = 50 + 'px';
  nodeDiv.style.width = 100 + 'px';
  graph.appendChild(nodeDiv);

nodeDiv.addEventListener('click', function (ev) {
  ev.stopPropagation();
});
  //var $node = $(nodeDivId);
  //$node.setPosition({x:x,y:y});

  //$node.appendText('Node'+nodeToJSON.id);
  //$node.makeDraggable({container:$graph});

  //rect();
}

var getPosition = function (elementId) {
  var position = {
    x: 0,
    y: 0
  };

  var element = document.getElementById(elementId);
  console.log(element);

  var xText = element.style.left;
  var yText = element.style.top;
  console.log(xText);
  console.log(typeof xText);
  position.x = parseInt(xText.substring(0, xText.length - 2));
  position.y = parseInt(yText.substring(0, yText.length - 2));

  return position;
}

/*
$addNode.addEvent('click', function (ev) {
  ev.stop();
  $cursor.hide();

  //var position = $cursor.getPosition($graph);
  var position = getPosition('dflow-cursor');

  var arg = {
    style: {
      top: position.y,
      left: position.x
    }
  };
  console.log(arg);
  socket.emit('addNode', arg);
});

$graph.addEvent('dblclick', function (ev) {
  ev.stop();
  $cursor.toggle();
});
*/

