import * as actionTypes from '../actions/actionTypes'

export const initialState = {
  plotData: {},
}

const plotReducer = (state = initialState, action) => {
  //   console.log(state, action, 'plotReducer')

  switch (action.type) {
    case actionTypes.SET_PLOT: {
      return {
        plotData: { ...action.payload },
      }
    }

    default:
      return state
  }
}
export default plotReducer
