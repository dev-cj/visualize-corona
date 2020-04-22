import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer/'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const middleWare = [thunk]

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleWare))
)

export default store
