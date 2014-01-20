
function DflowPackage (name) {

  Object.defineProperty(this, 'name', {
    configurable: false,
    enumerable: true,
    value: name
  })

}

function loadTask(dflowTask) {

}
DflowPackage.prototype.loadTask = loadTask

module.exports = DflowPackage

