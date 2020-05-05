import * as actionTypes from '../actions/actionTypes'

export const initialState = {}

const mapDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_MAP_DATA: {
      return action.payload
    }

    default:
      return state
  }
}
export default mapDataReducer
