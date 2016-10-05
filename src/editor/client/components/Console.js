import React, { Component } from 'react'

const id = 'dflow-console'

class Console extends Component {
  componentDidMount () {
    (function () {
      var logger = document.getElementById(id)
      console.log = function () {
        logger.innerHTML = ''

        for (var i = 0; i < arguments.length; i++) {
          if (typeof arguments[i] === 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + ' '
          } else {
            logger.innerHTML += arguments[i] + ' '
          }
        }
      }
    })()
  }
  render () {
    return (<div id={id} />)
  }
}

export default Console
