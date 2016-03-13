riot.tag2('dflow-app', '<h1>{title}</h1> <dflow-navbar></dflow-navbar> <dflow-debug-toggle></dflow-debug-toggle> <div id="flow-view-canvas"></div>', '', '', function(opts) {

  var title = 'hello riot'
});

riot.tag2('dflow-debug-toggle', '<input type="checkbox" id="debug-toggle" onchange="{toggle}"> <label for="debug-toggle">debug</label>', '', '', function(opts) {

  this.toggle = function () {
    var checked = this['debug-toggle'].checked

    if (typeof dflowDebug === 'function') {
      if (checked) {
        dflowDebug.enable('dflow')
        dflowDebug('dflow')('debug enabled')
      }
      else {
        dflowDebug('dflow')('debug disabled')
        dflowDebug.disable('dflow')
      }
    }
  }.bind(this)
});

riot.tag2('dflow-navbar', '<ul> <li><a href="http://g14n.info/dflow" target="_blank">Docs</a></li> </ul>', 'dflow-navbar ul { list-style-type: none; margin: 0; padding: 0; overflow: hidden; background-color: #333; } dflow-navbar li { float: left; } dflow-navbar li a { display: inline-block; color: white; text-align: center; padding: 14px 16px; text-decoration: none; } dflow-navbar li a:hover { background-color: #111; }', '', function(opts) {
});
