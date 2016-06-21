import Root from '../components/Root'
import { connect } from 'react-redux'
import {
  addTask,
  addPipe,
  fetchGraphIfNeeded
} from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onMountRoot() { dispatch(fetchGraphIfNeeded()) },
  onAddTask() { dispatch(addTask()) },
  onAddPipe() { dispatch(addPipe()) }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root)
