import { Inspector } from 'flow-view/components'
import noInputTask from '../utils/noInputTask'
import singleInputTask from '../utils/singleInputTask'
import twoInputsTask from '../utils/twoInputsTask'

class DflowInspector extends Inspector {
  renderInsControls (nodeId, node) {
    const taskName = node.text

    const noInput = noInputTask(taskName)
    const oneInput = singleInputTask(taskName)
    const twoInputs = twoInputsTask(taskName)

    if (noInput || oneInput || twoInputs) return null

    return super.renderInsControls(nodeId, node)
  }

  renderOutsControls () {
    return null
  }
}

export default DflowInspector
