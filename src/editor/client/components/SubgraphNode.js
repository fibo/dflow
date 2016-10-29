import React from 'react'
import ignoreEvent from '../utils/ignoreEvent'
import { Node } from 'flow-view/components'

class SubgraphNode extends Node {
  getBody () {
    const {
      bodyHeight,
      fontSize,
      pinSize,
      text
    } = this.props

    // Heuristic value, based on Courier font.
    // (comment copyed from flow-view Node)
    const margin = fontSize * 0.2

    return (
      <g>
        <text
          x={0}
          y={0 - margin}
          onClick={() => { console.log('click') }}
          onMouseMove={ignoreEvent}
        >
          <tspan>&#9999;</tspan>
        </text>
        <text
          x={pinSize}
          y={bodyHeight + pinSize - margin}
        >
          <tspan>{text}</tspan>
        </text>
      </g>
    )
  }
}

export default SubgraphNode
