import * as actionTypes from '../actions/actionTypes'

export const initialState = {
  plotData: {
    data: [
      { type: 'bar', x: ['a', 'b', 'c'], y: [2, 5, 6] },
      { type: 'bar', x: ['a', 'b', 'c'], y: [2, 5, 3] },
    ],
    layout: {
      autosize: true,
      title: 'A sample plot',
      barmode: 'group',
      xaxis: {},
    },
    frames: [],
    config: {},
  },
}

const plotReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PLOT: {
      return {
        plotData: {
          ...action.payload,
          layout: {
            ...action.payload.layout,
            images: [
              {
                name: 'watermark_CJ',
                source: 'https://devcj.in/images/logo.png',
                xref: 'paper',
                yref: 'paper',
                x: 0,
                y: 0.9,
                sizex: 0.1,
                sizey: 0.1,
                opacity: 0.1,
                layer: 'below',
              },
            ],
          },
        },
      }
    }

    default:
      return state
  }
}
export default plotReducer
