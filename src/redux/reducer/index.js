import { combineReducers } from 'redux'
import visualizeReducer from './visualizeReducer'
import plotReducer from './plotReducer'
import singleCountryReducer from './singleCountryReducer'
import mapDataReducer from './mapDataReducer'
import statsDataReducer from './statsDataReducer'
export default combineReducers({
  visualizeData: visualizeReducer,
  plotReducer,
  singleCountryData: singleCountryReducer,
  mapData: mapDataReducer,
  stats: statsDataReducer,
})
