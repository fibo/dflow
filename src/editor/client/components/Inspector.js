import React from 'react'
import { Inspector } from 'flow-view/components'

class DflowInspector extends Inspector {
  renderNode (nodeId, node) {
    const {
      createInputPin,
      deleteNode,
      deleteInputPin,
      view
    } = this.props

    const ins = node.ins || []
    const lastInputPosition = ins.length - 1

    var lastInputIsConnected = false

    Object.keys(view.link).forEach((linkId) => {
      const link = view.link[linkId]

      if (link.to && (link.to[0] === nodeId) && (link.to[1] === lastInputPosition)) {
        lastInputIsConnected = true
      }
    })

    return (
      <div>
        <label
          htmlFor='name'
        >
          node
        </label>
        <input
          type='text'
          id='name'
          disabled
          style={{ outline: 'none' }}
          value={node.text}
        />
        <div>
          ins
          <button
            disabled={(ins.length === 0) || lastInputIsConnected}
            onClick={() => { deleteInputPin(nodeId) }}
          >-</button>
          <button
            onClick={() => { createInputPin(nodeId) }}
          >+</button>
        </div>
        <button
          onClick={() => {
            deleteNode(nodeId)
          }}
        >
          delete node
        </button>
      </div>
    )
  }
}

export default DflowInspector
