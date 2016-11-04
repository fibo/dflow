import React from 'react'
import { Node } from 'flow-view/components'
import { ignoreEvent } from 'flow-view/utils/ignoreEvent'

class CanvasNode extends Node {
  constructor (props) {
    super(props)

    this.state = {
      message: 'hello world'
    }
  }

  componentDidMount () {
    const {
      id,
      model
    } = this.props

    const element = document.getElementById(id)

    if (model.task[id]) return
    else model.task[id] = () => element
  }

  getBody () {
    const {
      bodyHeight,
      fontSize,
      id,
      pinSize,
      text,
      width
    } = this.props

    // Heuristic value, based on Courier font.
    // (comment copyed from flow-view Node)
    const margin = fontSize * 0.2

    return (
      <g
        onClick={ignoreEvent}
        onDoubleClick={ignoreEvent}
        onMouseDown={ignoreEvent}
        onMouseUp={ignoreEvent}
      >
        <text
          x={pinSize}
          y={0 - margin}
        >
          <tspan>{text}</tspan>
        </text>
        <foreignObject
          x={0}
          y={pinSize}
          height={bodyHeight}
          width={width}
        >
          <canvas
            height={bodyHeight}
            id={id}
            width={width}
          />
        </foreignObject>
      </g>
    )
  }
}

CanvasNode.defaultProps = Object.assign({},
  Node.defaultProps,
  {
    bodyHeight: 200,
    width: 300
  }
)

export default CanvasNode
