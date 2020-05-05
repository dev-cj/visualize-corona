import * as actionTypes from '../actions/actionTypes'

export const initialState = { timeline: {}, countries: {} }

const statsDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_STATS_TIMELINE: {
      return { ...state, timeline: { ...action.payload } }
    }
    case actionTypes.SET_STATS_COUNTRIES: {
      return { ...state, countries: { ...action.payload } }
    }
    default:
      return state
  }
}
export default statsDataReducer
