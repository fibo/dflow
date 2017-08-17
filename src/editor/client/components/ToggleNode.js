import React from 'react'
import { Node } from 'flow-view'

class ToggleNode extends Node {
  constructor (props) {
    super(props)

    this.state = { toggle: true }
  }

  getBody () {
    const {
      model,
      id,
      pinSize
    } = this.props

    const { toggle } = this.state

    const setState = this.setState.bind(this)

    const bodyHeight = this.getBodyHeight()

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
        onMouseDown={onMouseDown}
        x={pinSize}
        y={pinSize}
        width={bodyHeight}
      />
    )
  }
}

export default ToggleNode
