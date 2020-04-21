import * as actionTypes from './actions/actionTypes'

export const initialState = {
  data: {},
  singleCountryChart_data: {},
}

const reducer = (state = initialState, action) => {
  // console.log(state, action)
  switch (action.type) {
    case actionTypes.GET_DATA: {
      return {
        ...state,
        data: { ...action.payload.data },
      }
    }

    default:
      return state
  }
}
export default reducer
