import windowFunctions from '../../../engine/functions/window'

const logger = document.getElementById('dflow-console')

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

const additionalFunctions = Object.assign({},
  windowFunctions,
  {
    'console.log': consoleLog
  }
)

export default additionalFunctions
