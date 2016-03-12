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

riot.tag2('dflow-navbar', '<p>navbar</p>', '', '', function(opts) {
});
