(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

},{"./debug":2}],2:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":3}],3:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = '' + str;
  if (str.length > 10000) return;
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],4:[function(require,module,exports){
module.exports={
  "name": "dflow",
  "description": "is a minimal Dataflow programming engine",
  "version": "0.15.0",
  "homepage": "http://g14n.info/dflow",
  "author": {
    "name": "Gianluca Casati",
    "url": "http://g14n.info"
  },
  "license": "MIT",
  "bin": "src/bin/dflow",
  "main": "index.js",
  "engines": {
    "node": ">=4"
  },
  "browser": "./src/engine/context/client-window.js",
  "scripts": {
    "start": "node src/bin/dflow",
    "_build": "npm test && npm run browserify && npm run minify && npm run jekyll; git status",
    "_push": "git push origin master && npm run gh-pages_push",
    "_pull": "git pull origin master && npm run gh-pages_pull",
    "bower": "npm run bower_install; npm run git_add-f",
    "bower_install": "cd src/editor; bower --silent --config.analytics=false install; cd -",
    "browserify": "for x in client dist examples test; do npm run browserify_$x; done",
    "browserify_client": "browserify src/editor/client/main.js --exclude flow-view -o src/editor/client/public/bundle.js",
    "browserify_dist": "browserify -r ./src/engine/context/client-window.js:${npm_package_name} -o dist/${npm_package_name}.js",
    "browserify_examples": "browserify -r ./src/examples/renderer.js:examples-renderer -o gh-pages/js/examples-renderer.js",
    "browserify_test": "browserify test/*.js -o gh-pages/test/bundle.js",
    "check-deps": "npm outdated",
    "coverage": "npm run istanbul && npm run coveralls",
    "coveralls": "cat ./coverage/lcov.info | coveralls --verbose",
    "cp": "npm run cp_dist; npm run cp_package.json",
    "cp_dist": "cp -r dist/ gh-pages/",
    "cp_package.json": "cp package.json gh-pages/_data/",
    "data_repo": "wget https://api.github.com/repos/fibo/${npm_package_name} -O gh-pages/_data/repo.json",
    "decrypt_.coveralls.yml": "keybase decrypt -o .coveralls.yml .coveralls.yml.asc",
    "gh-pages_push": "git subtree --prefix gh-pages push origin gh-pages",
    "gh-pages_pull": "git subtree --prefix gh-pages pull origin gh-pages",
    "git_add-f": "for x in public flow-view riot; do npm run git_add-f_$x; done",
    "git_add-f_public": "git add -f src/editor/client/public/*",
    "git_add-f_flow-view": "git add -f src/editor/bower_components/flow-view/dist/flow-view.min.js",
    "git_add-f_riot": "git add -f src/editor/bower_components/riot/riot.min.js",
    "heroku": "git remote add heroku https://git.heroku.com/dflow.git; git push heroku master; git remote remove heroku",
    "homepage": "echo \"---\ntitle: $npm_package_name\n---\" > gh-pages/index.md; cat README.md >> gh-pages/index.md",
    "istanbul": "istanbul cover _mocha -- --recursive",
    "jekyll": "npm run homepage; npm run cp; npm run data_repo; cd gh-pages; jekyll build; cd ..",
    "lint": "for x in bin editor engine examples test; do npm run lint_$x; done",
    "lint_bin": "standard bin/dflow",
    "lint_editor": "npm run lint_editor_client; npm run lint_editor_server",
    "lint_editor_client": "standard --global $ src/editor/client/*js",
    "lint_editor_server": "standard src/editor/server.js",
    "lint_engine": "cd src/engine/; standard; cd -",
    "lint_examples": "cd src/examples/; standard; cd -",
    "lint_test": "cd test; standard --global describe --global it; cd -",
    "minify": "cd dist; uglifyjs ${npm_package_name}.js --source-map ${npm_package_name}.map --output ${npm_package_name}.min.js --compress --mangle --preamble \"// ${npm_package_name}.js ${npm_package_homepage} \n// license ${npm_package_license}\"; cd -",
    "postversion": "git push origin v${npm_package_version}; npm publish; npm run _push; npm run heroku",
    "riot": "riot src/editor/client/tags src/editor/client/public/dflow-tags.js",
    "test": "mocha"
  },
  "pre-commit": [
    "lint",
    "test",
    "check-deps"
  ],
  "dependencies": {
    "body-parser": "^1.14.1",
    "debug": "^2.2.0",
    "express": "^4.13.4",
    "nopt": "^3.0.4",
    "not-defined": "^1.0.0",
    "write-file-utf8": "^1.0.0"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/fibo/dflow.git"
  },
  "keywords": [
    "dataflow",
    "visual"
  ],
  "devDependencies": {
    "mocha": "^2.4.5",
    "should": "^8.2.2"
  }
}

},{}],5:[function(require,module,exports){
var pkg = require('../../../package.json')

// var socket = window.io()

var graph = require('../../examples/graph/hello-world.json')

// Debug setup.
window.dflowDebug = require('debug')
var debug = dflowDebug('dflow')

window.onload = initPage

function initPage () {
  // Initialize canvas and other elements.
  var Canvas = require('flow-view').Canvas

  var canvas = new Canvas('flow-view-canvas', {
    nodeSelector: {
      dataList: {
        URL: '/tasklist'
      }
    }
  })

  debug('dflow', pkg.version)

  canvas.deleteView()
  canvas.render(graph.view)

  /*
  var canvasMethods = ['addLink', 'addNode',
                       'delLink', 'delNode']

  canvasMethods.forEach(function (methodName) {
    canvas.broker.removeAllListeners(methodName)

    canvas.broker.on(methodName, function (data) {
      debug(methodName, data)
      socket.emit(methodName, data)
    })

    socket.on(methodName, function (data) {
      canvas[methodName](data)
    })
  })

  var nodeMethods = ['addInput', 'addOutput']

  nodeMethods.forEach(function (methodName) {
    canvas.broker.removeAllListeners(methodName)

    canvas.broker.on(methodName, function (data) {
      debug(methodName, data)
      socket.emit(methodName, data)
    })

    socket.on(methodName, function (data) {
      var id = data.nodeid
      var position = data.position

      var node = canvas.node[id]

      node[methodName](position)
    })
  })

  canvas.broker.on('moveNode', function (data) {
    debug('moveNode', data)
    socket.emit('moveNode', data)
  })

  canvas.broker.on('dblclickNode', function (data) {
    debug('dblclickNode', data)

    var nodeid = data.nodeid
    var node = canvas.node[nodeid]

    var taskName = node.text
    var taskId = node.id

    $('#task-name').html(`
      ${taskName}
      <div class="detail">${taskId}</div>
    `)

    $('#inspector').modal('show')
  })

  socket.on('moveNode', function (data) {
    debug('moveNode', data)

    var x = data.x
    var y = data.y

    var node = canvas.node[data.nodeid]

    node.group.move(x, y)

    node.outs.forEach(function (output) {
      Object.keys(output.link).forEach(function (id) {
        var link = output.link[id]

        if (link) {
          link.linePlot()
        }
      })
    })

    node.ins.forEach(function (input) {
      var link = input.link

      if (link) {
        link.linePlot()
      }
    })
  })

  socket.on('loadGraph', function (data) {
    debug('loadGraph', data)

    graph = data

    canvas.deleteView()
    canvas.render(graph.view)

    var jsonEditorConfig = {
      mode: 'tree',
      history: true
    }

    var jsonEditorElement = document.getElementById('json-editor')

    var jsonEditor = new window.JSONEditor(jsonEditorElement, jsonEditorConfig)

    var $sidebar = $('#data-sidebar')

    $sidebar.sidebar({
      onHide: function () {
        var data = jsonEditor.get()

        graph.data = data

        socket.emit('changeData', data)
      },
      onShow: function () {
        var jsonData = {}

        if (graph !== null) {
          jsonData = graph.data
        }

        jsonEditor.set(jsonData)
      }
    })

    $('#toggle-json-editor').click(() => {
      $sidebar.sidebar('toggle')
    })
  })
    */
}

},{"../../../package.json":4,"../../examples/graph/hello-world.json":6,"debug":1,"flow-view":undefined}],6:[function(require,module,exports){
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

},{}]},{},[5]);
