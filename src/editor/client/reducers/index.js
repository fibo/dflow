import { combineReducers } from 'redux'

import editor from './editor'
import graph from './graph'

export default combineReducers({ editor, graph })
