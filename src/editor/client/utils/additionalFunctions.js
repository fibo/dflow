var logger = document.getElementById('dflow-console')

function consoleLog () {
  logger.innerHTML = ''

  for (var i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] === 'object') {
      logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + ' '
    } else {
      logger.innerHTML += arguments[i] + ' '
    }
  }
}

function dflowPreview () {
  return document.getElementById('dflow-preview')
}

const additionalFunctions = {
  'body': dflowPreview,
  'console.log': consoleLog
}

export default additionalFunctions
