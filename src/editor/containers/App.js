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
  console.log(ownProps)
  console.log(state)

  return {
    view: flowViewMapStateToProps(state.view, ownProps.view)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    view: flowViewMapDispatchToProps(dispatch, ownProps.view),
    onMountRoot: () => { dispatch(fetchGraphIfNeeded()) },
    onAddTask: () => { dispatch(addTask()) },
    onAddPipe: () => { dispatch(addPipe()) }
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const stateView = stateProps.view
  const dispatchView = dispatchProps.view

  delete stateProps.view
  delete dispatchProps.view

  return Object.assign({},
    ownProps,
    stateProps,
    dispatchProps,
    { view: Object.assign({}, stateView, dispatchView) }
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Root)
