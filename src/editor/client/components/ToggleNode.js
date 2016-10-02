import React from 'react'
import { Node } from 'flow-view/components'

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

    const onClick = (e) => {
      e.preventDefault()
      e.stopPropagation()

      // TODO probably the clean way to do this is
      // pass actions as a prop instead of the model itself.
      // Here it could be action.renameTask(id, 'true')
      if (!toggle) {
        model.task[id] = 'true'
      } else {
        model.task[id] = 'false'
      }

      this.setState({ toggle: !toggle })
    }

    return (
      <rect
        fill={toggle ? 'limegreen' : 'tomato'}
        height={bodyHeight}
        onClick={onClick}
        x={pinSize}
        y={pinSize}
        width={bodyHeight}
      />
    )
  }
}

export default ToggleNode
