

var socket = io.connect();

//var doNothing = function () {}
//socket.on('connect', doNothing);

//socket.on('disconnect', doNothing);

var Box = function (elementToJSON) {
  var self = this;

  var _dragging;

  var _id = elementToJSON.id;
  self.getId = function () { return _id; }

  var parentId = elementToJSON.parentId;

  var _element = document.createElement('div');
  self.getElement = function () { return _element; }

  var _parentElement = document.getElementById(parentId);

  _element.id = _id;
  _element.className = 'dflow-box';

  self.makeDraggable = function () {
    _dragging = false;

    var mouseX, mouseY;

    var ignore = function (ev) {
      ev.stopPropagation();
      ev.preventDefault();
    }

    _element.addEventListener('mouseout', ignore);

    _parentElement.addEventListener('mouseout', function (ev) {
      ev.stopPropagation();
      ev.preventDefault();

      _dragging = false;
    });

    _element.addEventListener('mousedown', function (ev) {
      ev.stopPropagation();
      ev.preventDefault();

      _dragging = true;

      mouseX = ev.clientX + window.scrollX;
      mouseY = ev.clientY + window.scrollY;
    });

    _parentElement.addEventListener('mousemove', function (ev) {
      ev.stopPropagation();
      ev.preventDefault();

      if (_dragging === false) return;

      // vedi http://www.brainjar.com/dhtml/drag/

      var x = ev.clientX + window.scrollX;
      var y = ev.clientY + window.scrollY;

      var dX = x - mouseX;
      var dY = y - mouseY;

      var position = self.getPosition();

      position.x += dX;
      position.y += dY;

      if (position.x <= 0) position.x = 0;
      if (position.y <= 0) position.y = 0;

      self.setPosition(position);

      mouseX = x;
      mouseY = y;
    });

    _element.addEventListener('mouseup', function (ev) {
      ev.stopPropagation();

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

  self.getSize = function () {

  }

  self.setSize = function (size) {
    // TODO per ora mi interessano solo i valori numerici in pixel oppure metto al 100%
    //      infatti i nodi sono in pixel, mentre il grafo ha 100%
    if (size.height == '100%') {
      _element.style.height = '100%';
    }
    else {
      _element.style.height = size.height + 'px';
    }

    if (size.width == '100%') {
      _element.style.width = '100%';
    }
    else {
      _element.style.width = size.width + 'px';
    }
  }

  self.setSize(elementToJSON.size);
  self.setPosition(elementToJSON.position);

  _parentElement.appendChild(_element);

}

var Node = function (arg) {
  var self = this;

  Box.call(self, arg);

  self.makeDraggable();

  var element = self.getElement();
  element.addEventListener('click', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
  });
}

var Graph = function (arg) {
  var self = this;

  Box.call(self, arg);

  var _nodes = [];

  // TODO fai il canvas.

  var element = self.getElement();
  element.addEventListener('click', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    var arg = {
      position:{x:ev.offsetX,y:ev.offsetY},
      size:{height:50,width:100}
    };

    socket.emit('addNode', arg);
  });

  self.addNode = function (arg) {
    arg.parentId = self.getId();
    var node = new Node(arg);
    _nodes.push(node);
  }

  socket.on('addNode', function (nodeToJSON) {
    // TODO dovrei controllare che il parentId del node
    // coincide con l' id del grafo, o forse è superfluo
    self.addNode(nodeToJSON);
  });
}

