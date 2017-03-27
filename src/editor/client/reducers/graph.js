import emptyGraph from '../../../engine/emptyGraph.json'
import no from 'not-defined'
import noOutputForTask from '../utils/noOutputForTask'
import singleInputTask from '../utils/singleInputTask'
import threeInputsTask from '../utils/threeInputsTask'
import twoInputsTask from '../utils/twoInputsTask'
import typeOfNode from '../utils/typeOfNode'

const initialState = Object.assign({}, emptyGraph)

export default function (state = initialState, action) {
  const graph = Object.assign({}, state)
  var { pipe, task, view } = graph

  const error = action.error
  const link = action.link
  const linkId = action.linkId
  const node = action.node
  const nodeId = action.nodeId

  switch (action.type) {
    case 'CREATE_INPUT_PIN':
      return Object.assign({}, graph, { view })

    case 'CREATE_LINK':
      // Create dflow pipe.
      pipe[linkId] = [ link.from[0], link.to[0] ]

      // Add target pin position only if it is not zero.
      const targetPinPosition = link.to[1]

      if (targetPinPosition) pipe[linkId][2] = targetPinPosition

      return Object.assign({}, graph, { pipe })

    case 'CREATE_NODE':
      const taskName = node.text

      // Create dflow task, only if it is not a custom node.
      // Custom nodes are responsible to create their own task.
      if (typeOfNode(node) === 'DefaultNode') {
        task[nodeId] = taskName
      }

      const hasOutput = !noOutputForTask(taskName)

      if (hasOutput) {
        view.node[nodeId].outs = ['out']
      }

      const hasOneInput = singleInputTask(taskName)

      if (hasOneInput) {
        if (no(view.node[nodeId].ins)) {
          view.node[nodeId].ins = ['in']
        }
      }

      const hasTwoInputs = twoInputsTask(taskName)

      if (hasTwoInputs) {
        if (no(view.node[nodeId].ins)) {
          view.node[nodeId].ins = ['in1', 'in2']
        }
      }

      const hasThreeInputs = threeInputsTask(taskName)

      if (hasThreeInputs) {
        if (no(view.node[nodeId].ins)) {
          view.node[nodeId].ins = ['in1', 'in2', 'in3']
        }
      }

      return Object.assign({}, graph, { task })

    case 'DELETE_LINK':
      delete pipe[linkId]

      return Object.assign({}, graph, { pipe })

    case 'DELETE_NODE':
      delete task[nodeId]

      Object.keys(pipe).map((pipeId) => {
        const isSource = (pipe[pipeId][0] === nodeId)
        const isTarget = (pipe[pipeId][1] === nodeId)

        if (isSource || isTarget) {
          delete view.link[linkId]
        }
      })

      return Object.assign({}, graph, { task, pipe })

    case 'INVALID_NODE':
      view.node[nodeId].error = error

      return Object.assign({}, graph, { view })

    case 'OPEN_EXAMPLE':
      return action.graph

    case 'READ_GRAPH_FAILURE':
      return graph

    case 'READ_GRAPH_REQUEST':
      return graph

    case 'READ_GRAPH_SUCCESS':
      return Object.assign({}, action.data)

    case 'UPDATE_GRAPH_FAILURE':
      return graph

    case 'UPDATE_GRAPH_REQUEST':
      return graph

    case 'UPDATE_GRAPH_SUCCESS':
      return graph

    default:
      return graph
  }
}
