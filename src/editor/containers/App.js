import Root from '../components/Root'
import { connect } from 'react-redux'
import {
  addTask,
  addPipe
} from '../actions'

const mapStateToProps = (state, ownProps) => {
  return state
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAddTask: () => {
      dispatch(addTask())
    },
    onAddPipe: () => {
      dispatch(addPipe())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root)
