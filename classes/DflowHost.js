
function DflowHost () {

  Object.defineProperty(this, 'loadedPackages', {value: {}})

  Object.defineProperty(this, 'availableTasks', {value: {}})

}

function loadPackage(dflowPackage) {

}
DflowHost.prototype.loadPackage = loadPackage

module.exports = DflowHost

