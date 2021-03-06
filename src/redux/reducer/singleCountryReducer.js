import * as actionTypes from '../actions/actionTypes'

export const initialState = {
  country: '',
  type: '',
  CRD: [],
  scatterType: {},
  pieDateType: 'single',
  pieDateSingle: '',
  xaxisDateDiff: 0,
  dateRange: [],
}

const singleCountryReducer = (state = initialState, action) => {
  //   console.log(state, action)
  switch (action.type) {
    case actionTypes.SET_SingleCountryData: {
      return {
        ...state,
        ...action.payload,
      }
    }
    case actionTypes.SET_singleCountry: {
      return {
        ...state,
        country: action.payload,
      }
    }
    case actionTypes.SET_singleCountry_type: {
      return {
        ...state,
        type: action.payload,
      }
    }
    case actionTypes.SET_singleCountry_CRD: {
      return {
        ...state,
        CRD: action.payload,
      }
    }
    case actionTypes.SET_singleCountry_scatterType: {
      return {
        ...state,
        scatterType: action.payload,
      }
    }
    case actionTypes.SET_singleCountry_pieDateSingle: {
      return {
        ...state,
        pieDateSingle: action.payload,
      }
    }
    case actionTypes.SET_singleCountry_dateRange: {
      return {
        ...state,
        dateRange: action.payload,
      }
    }

    case actionTypes.SET_singleCountry_xaxisDateDiff: {
      return {
        ...state,
        xaxisDateDiff: action.payload,
      }
    }
    default:
      return state
  }
}
export default singleCountryReducer
