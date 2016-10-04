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

    const onClick = (e) => {
      e.preventDefault()
      e.stopPropagation()

      // TODO probably the clean way to do this is
      // pass actions as a prop instead of the model itself.
      // Here it could be action.renameTask(id, 'true')
      if (this.state.toggle) {
        this.setState({ toggle: false })

        model.task[id] = 'false'
      } else {
        this.setState({ toggle: true })

        model.task[id] = 'true'
      }
    }

    return (
      <rect
        fill={this.state.toggle ? 'limegreen' : 'tomato'}
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
