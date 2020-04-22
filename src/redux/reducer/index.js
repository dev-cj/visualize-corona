import { combineReducers } from 'redux'
import visualizeReducer from './visualizeReducer'
import plotReducer from './plotReducer'
import singleCountryReducer from './singleCountryReducer'

export default combineReducers({
  visualizeData: visualizeReducer,
  plotReducer,
  singleCountryData: singleCountryReducer,
})
