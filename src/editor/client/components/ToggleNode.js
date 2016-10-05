import React from 'react'
import { Node } from 'flow-view/components'
import ignoreEvent from '../utils/ignoreEvent'

class ToggleNode extends Node {
  constructor (props) {
    super(props)

    this.state = { toggle: true }
  }

  getBody () {
    const {
      bodyHeight,
      model,
      id,
      pinSize
    } = this.props

    const toggle = this.state.toggle

    const setState = this.setState.bind(this)

    const onMouseDown = (e) => {
      e.preventDefault()
      e.stopPropagation()

      // TODO probably the clean way to do this is
      // pass actions as a prop instead of the model itself.
      // Here it could be action.renameTask(id, 'true')
      if (toggle) {
        setState({ toggle: false })

        model.task[id] = 'false'
      } else {
        setState({ toggle: true })

        model.task[id] = 'true'
      }
    }

    return (
      <rect
        fill={toggle ? 'limegreen' : 'tomato'}
        height={bodyHeight}
        onClick={ignoreEvent}
        onMouseDown={onMouseDown}
        onMouseUp={ignoreEvent}
        x={pinSize}
        y={pinSize}
        width={bodyHeight}
      />
    )
  }
}

export default ToggleNode
