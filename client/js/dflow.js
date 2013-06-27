;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
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
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":1}],3:[function(require,module,exports){
var events = require('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
          'italic' : [3, 23],
          'underline' : [4, 24],
          'inverse' : [7, 27],
          'white' : [37, 39],
          'grey' : [90, 39],
          'black' : [30, 39],
          'blue' : [34, 39],
          'cyan' : [36, 39],
          'green' : [32, 39],
          'magenta' : [35, 39],
          'red' : [31, 39],
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\033[' + styles[style][0] + 'm' + str +
             '\033[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return ar instanceof Array ||
         Array.isArray(ar) ||
         (ar && ar !== Object.prototype && isArray(ar.__proto__));
}


function isRegExp(re) {
  return re instanceof RegExp ||
    (typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]');
}


function isDate(d) {
  if (d instanceof Date) return true;
  if (typeof d !== 'object') return false;
  var properties = Date.prototype && Object_getOwnPropertyNames(Date.prototype);
  var proto = d.__proto__ && Object_getOwnPropertyNames(d.__proto__);
  return JSON.stringify(proto) === JSON.stringify(properties);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":2}],4:[function(require,module,exports){

var dflow = require('./Global.js')
  , EventEmitter = require('events').EventEmitter
  , util = require('util')

function Element () {
  var self = this
    , arg = arguments[0] || {}
    , _id   = dflow.pushElement(self)
    , _name

  function getId () { return _id }
  self.getId = getId

  function getName () { return _name }
  self.getName = getName

  function setName () {
    var arg = arguments[0]
      , name

    if (typeof arg === 'string')
      name = arg
    else
      return

    _name = name
  }
  self.setName = setName

  function elementToJSON () {
    var json = {}
    json.id = _id
    json.name = _name
    return json
  }
  self.elementToJSON = elementToJSON
  self.toJSON        = elementToJSON

  function init () {
    arg = arguments[0] || {}

    setName(arg.name)
  }
  init(arg)
}

util.inherits(Element, EventEmitter)

module.exports = Element


},{"events":2,"util":3,"./Global.js":5}],5:[function(require,module,exports){

// TODO revisione sezione arguments nei test

var pkg = require('../package.json')
  , elements = []

//TODO info.start
exports.info = {
  version: pkg.version
}


function deleteElement (element) {
  for (var i in elements)
    if (elements[i] === element)
      delete elements[i]
}
exports.deleteElement = deleteElement

function pushElement (element) {
  var id = elements.length
  elements.push(element)
  return id
}
exports.pushElement = pushElement

// TODO deleteElement

// TODO listener che quando cancello o creo un nodo lo aggiunge alla lista globale.
// on pushElement deleteElement -> scattano le funzioni

function getElementById(id) {
  for (var i in elements)
    if (elements[i].getId() === id)
      return elements[id]

  return
}
exports.getElementById = getElementById


},{"../package.json":6}],7:[function(require,module,exports){

var Element = require('./Element.js')
  , Input   = require('./Input.js')
  , Output  = require('./Output.js')
  , util    = require('util')

function Node () {
  var self = this
    , arg = arguments[0] || {}
    , _hasRunTask = false
    , _inputs     = []
    , _outputs    = []
    , _task       = function emptyTask () {}

  Element.call(self, arg)

  function setTask () {
    var arg = arguments[0]

    if (typeof arg === 'function')
      _task = arg
    // TODO emit changeTask
  }
  self.setTask = setTask

  function hasRunTask () { return _hasRunTask }
  self.hasRunTask = hasRunTask

  function getInputById (id) {
    for (var i in _inputs)
      if (_inputs[i].getId() === id)
        return _inputs[i]

    return
  }
  self.getInputById = getInputById

  function getInputs () { return _inputs }
  self.getInputs = getInputs

  function getOutputById (id) {
    for (var i in _outputs)
      if (_outputs[i].getId() === id)
        return _outputs[i]

    return
  }
  self.getOutputById = getOutputById

  function getOutputs () { return _outputs }
  self.getOutputs = getOutputs

  function deleteInput () {
    var arg = arguments[0]
      , output

    if (typeof arg === 'number')
      output = getInputById(arg)

    if (arg instanceof Input)
      output = arg

    for (var i in _outputs)
      if (_outputs[i] === output)
        delete _outputs[i]
  }
  self.deleteInput = deleteInput

  function pushInput () {
    var arg = arguments[0]
      , input

    if (typeof arg === 'undefined')
      input = new Input()

    if (typeof arg === 'object')
      input = new Input(arg)

    if (arg instanceof Input)
      input = arg

    _inputs.push(input)

    return input
  }
  self.pushInput = pushInput

  function deleteOutput () {
    var arg = arguments[0]
      , output

    if (typeof arg === 'number')
      output = getOutputById(arg)

    if (arg instanceof Output)
      output = arg

    for (var i in _outputs)
      if (_outputs[i] === output)
        delete _outputs[i]
  }
  self.deleteOutput = deleteOutput

  function pushOutput () {
    var arg = arguments[0]
      , output

    if (typeof arg === 'undefined')
      output = new Output()

    if (typeof arg === 'object')
      output = new Output(arg)

    if (arg instanceof Output)
      output = arg

    _outputs.push(output)

    return output
  }
  self.pushOutput = pushOutput

  function onTask () {
    _task(self)
    _hasRunTask = true
  }
  self.on('task', onTask)

  function nodeToJSON () {
    var json = self.elementToJSON()
    json.inputs = []
    for (var i in _inputs) json.inputs.push(_inputs[i].toJSON())
    json.outputs = []
    for (var i in _outputs) json.inputs.push(_outputs[i].toJSON())
    return json
  }
  self.nodeToJSON = nodeToJSON
  self.toJSON     = nodeToJSON

  function init () {
    arg = arguments[0] || {}

    for (var i in arg.inputs)
      pushInput(arg.inputs[i])
   
    for (var i in arg.outputs)
      pushOutput(arg.outputs[i])
   
    setTask(arg.task)
  }
  init(arg)
}

util.inherits(Node, Element)

module.exports = Node


},{"util":3,"./Input.js":8,"./Element.js":4,"./Output.js":9}],8:[function(require,module,exports){

var Output = require('./Output.js')
  , Slot   = require('./Slot.js')
  , util   = require('util')

function Input () {
  var self = this
    , arg = arguments[0] || {}
    , _source

  Slot.call(self, arg)

  function getSource () { return _source }
  self.getSource = getSource

  function setSource (newSource) {
// TODO questo mutator non è conforme agli altri
// inoltre sarebbe forse da chiamare connectTo ?
    if (newSource instanceof Output) {
      _source = newSource
      self.getData = _source.getData
      self.emit('source')
    }
    else {
      // TODO aggiustare eccezioni
      new TypeError()
    }
    //TODO se newSource c'era gia', notifica la oldSource che ti sei staccato
    //si ma fai tutto ad eventi.
  }
  self.setSource = setSource

  function isConnected () {
    return _source instanceof Output
  }
  self.isConnected = isConnected

  function inputToJSON () {
    var json = self.slotToJSON()

    json.sourceId = _source.getId() // TODO solo se è collegato

    return json
  }
  self.inputToJSON = inputToJSON
  self.toJSON      = inputToJSON

  function init () {
    arg = arguments[0] || {}

    setSource(arg.source)
  }
  init(arg)
}

util.inherits(Input, Slot)

module.exports = Input


},{"util":3,"./Output.js":9,"./Slot.js":10}],10:[function(require,module,exports){

var Element = require('./Element.js')
  , util    = require('util')

function Slot () {
  var self = this
    , arg = arguments[0] || {}
    , _data

  Element.call(self, arg)

  function getData () { return _data }
  self.getData = getData

  function getType () { return typeof _data }
  self.getType = getType

  function setData (data) {
    var data = arguments[0]
      , canSetData = false

    if (typeof data === 'undefined')
      return

    canSetData = (getType() === 'undefined' || getType() === typeof data)

    if (canSetData) {
      _data = data
      self.emit('data')
    }
  }
  self.setData = setData

  function slotToJSON () {
    var json = self.elementToJSON()
    json.data = _data
    return json
  }
  self.slotToJSON = slotToJSON
  self.toJSON     = slotToJSON

  function init () {
    arg = arguments[0] || {}

    setData(arg.data)
  }
  init(arg)
}

util.inherits(Slot, Element)

module.exports = Slot


},{"util":3,"./Element.js":4}],11:[function(require,module,exports){

var dflow = require('./Global.js')
  , Node  = require('./Node.js')
  , util  = require('util')

function Graph () {
  var self = this
    , arg = arguments[0] || {}
    , _nodes = []
    , _graphs = []

  function groupTask () {
    // TODO non è proprio così semplice :)
    // TODO considera se il task del graph è definito qua
    // oppure se non viene impostato dal Global e quindi potrebbe essere diverso
    // di default sarebbe quindi il task vuoto
    // infatti potrei settarlo dopo con il setTask
    for (var i in _nodes) _nodes[i].emit('task')
  }
  arg.task = groupTask

  Node.call(self, arg)

  function getGraphs () { return _graphs }
  self.getGraphs = getGraphs

  function getGraphById (id) {
    for (var i in _graphs)
      if (_graphs[i].getId() === id)
        return _graphs[i]

    return
  }
  self.getGraphById = getGraphById

  function getNodes () { return _nodes }
  self.getNodes = getNodes

  function getNodeById (id) {
    for (var i in _nodes)
      if (_nodes[i].getId() === id)
        return _nodes[i]

    return
  }
  self.getNodeById = getNodeById

  function pushGraph () {
    var arg = arguments[0]
      , graph

    if (typeof arg === 'undefined')
      graph = new Graph()

    if (typeof arg === 'object')
      graph = new Graph(arg)

    if (arg instanceof Graph)
      graph = arg

    _graphs.push(graph)

    return graph
  }
  self.pushGraph = pushGraph

  function pushNode () {
    var arg = arguments[0]
      , node

    if (typeof arg === 'undefined')
      node = new Node()

    if (typeof arg === 'object')
      node = new Node(arg)

    if (arg instanceof Node)
      node = arg

    _nodes.push(node)
    // TODO self.emit('pushNode', node) così viene messo in globale, da un listener
    // deve essere fatto però da tutti i push e delete, vedi anche Node
    return node
  }
  self.pushNode = pushNode

  function deleteGraph () {
    var arg = arguments[0]
      , graph

    if (typeof arg === 'number')
      graph = getGraphById(arg)

    if (arg instanceof Graph)
      graph = arg

    for (var i in _graphs)
      if (_graphs[i] === graph)
        delete _graphs[i]
  }
  self.deleteGraph = deleteGraph

  function deleteNode () {
    var arg = arguments[0]
      , node

    if (typeof arg === 'number')
      node = getNodeById(arg)

    if (arg instanceof Node)
      node = arg

    // TODO if (! node instanceof Node) errore e non fa niente

    for (var i in _nodes) {
      if (_nodes[i] === node) delete _nodes[i]
        // TODO emit delete node
    }
  }
  self.deleteNode = deleteNode

  function graphToJSON () {
    var json = self.nodeToJSON()
    json.nodes = []

    for (var i in _nodes)
      json.nodes.push(_nodes[i].toJSON())

    return json
  }
  self.graphToJSON = graphToJSON
  self.toJSON      = graphToJSON

  function init () {
    arg = arguments[0] || {}

    for (var i in arg.graphs)
      pushGraph(arg.graphs[i])
   
    for (var i in arg.nodes)
      pushNode(arg.nodes[i])
  }
  init(arg)
}

util.inherits(Graph, Node)

module.exports = Graph


},{"util":3,"./Global.js":5,"./Node.js":7}],9:[function(require,module,exports){

var Slot = require('./Slot.js')
  , util = require('util')

function Output () {
  var self = this
    , arg = arguments[0] || {}
    , _targets = []

  Slot.call(self, arg)

  function getTargets () { return _targets }
  self.getTargets = getTargets

  function connectTo (target) {
    // TODO controllo sul tipo, vedi se funziona
    //try {
      _targets.push(target)
    //}

    target.setSource(self)
    // TODO self.emit('connectTo')
  }
  self.connectTo = connectTo

  function setTargets () {
    var arg = arguments[0]

    if (typeof arg === 'array')
      for (var i in arg)
        connectTo(arg[i])
  }
  self.setTargets = setTargets

  function outputToJSON () {
    var json = self.slotToJSON()
    json.targetIds = []

    for (var i in _targerts)
      json.targetIds.push(_targets[i].getId())

    return json
  }
  self.outputToJSON = outputToJSON
  self.toJSON       = outputToJSON

  function init () {
    arg = arguments[0] || {}

    setTargets(arg.targets)
  }
  init(arg)
}

util.inherits(Output, Slot)

module.exports = Output


},{"util":3,"./Slot.js":10}],6:[function(require,module,exports){
module.exports={
  "name": "dflow",
  "version": "0.1.0",
  "description": "dataflow programming for node.js",
  "main": "index.js",
  "scripts": {
    "start": "node app",
    "test": "mocha --reporter nyan"
  },
  "dependencies": {
    "express": "~3.3.0"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/fibo/dflow.git"
  },
  "keywords": [
    "dataflow",
    "visual"
  ],
  "author": "fibo",
  "license": "BSD",
  "devDependencies": {
    "mocha": "1.4.2",
    "grunt": "~0.4.1",
    "grunt-browserify": "~1.1.1"
  }
}

},{}]},{},[4,5,8,11,7,9,10])
;