import Root from '../components/Root'
import { connect } from 'react-redux'
import {
  addTask,
  addPipe,
  fetchGraphIfNeeded
} from '../actions'

import {
  mapDispatchToProps as flowViewMapDispatchToProps,
  mapStateToProps as flowViewMapStateToProps
} from 'flow-view/containers/App'

const mapStateToProps = (state, ownProps) => {
  return {
    view: flowViewMapStateToProps(state.view, ownProps.view)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onView: flowViewMapDispatchToProps(dispatch, ownProps.view),
    onMountRoot: () => { dispatch(fetchGraphIfNeeded()) },
    onAddTask: () => { dispatch(addTask()) },
    onAddPipe: () => { dispatch(addPipe()) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root)
