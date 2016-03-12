<dflow-debug-toggle>
  <input type="checkbox" id="debug-toggle" onchange={ toggle }>
  <label for="debug-toggle">debug</label>

  toggle () {
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
  }
</dflow-debug-toggle>
