import emptyGraph from '../../../engine/emptyGraph.json'
import no from 'not-defined'
import noOutputForTask from '../utils/noOutputForTask'
import singleInputTask from '../utils/singleInputTask'
import typeOfNode from '../utils/typeOfNode'

const initialState = Object.assign({}, emptyGraph)

export default function (state = initialState, action) {
  var pipe = Object.assign({}, state.pipe)
  var task = Object.assign({}, state.task)
  var view = Object.assign({}, state.view)

  const link = action.link
  const linkId = action.linkId
  const node = action.node
  const nodeId = action.nodeId

  switch (action.type) {
    case 'CREATE_INPUT_PIN':
      return Object.assign({}, state, { view })

    case 'CREATE_LINK':
      // Create dflow pipe.
      pipe[linkId] = [ link.from, link.to ]

      return Object.assign({}, state, { pipe })

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

      return Object.assign({}, state, { task })

    case 'DELETE_LINK':
      delete pipe[linkId]

      return Object.assign({}, state, { pipe })

    case 'DELETE_NODE':
      delete task[nodeId]

      Object.keys(pipe).map((pipeId) => {
        const isSource = (pipe[pipeId][0] === nodeId)
        const isTarget = (pipe[pipeId][1] === nodeId)

        if (isSource || isTarget) {
          delete view.link[linkId]
        }
      })

      return Object.assign({}, state, { task, pipe })

    case 'FETCH_GRAPH_FAILURE':
      return state

    case 'FETCH_GRAPH_REQUEST':
      return state

    case 'FETCH_GRAPH_SUCCESS':
      return Object.assign({}, state, action.graph)

    default:
      return state
  }
}
