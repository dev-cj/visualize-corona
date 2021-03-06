import * as actionTypes from '../actions/actionTypes'

export const initialState = {
  plotData: {
    data: [
      {
        type: 'bar',
        x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
        y: [2, 5, 6, 15, 4, 2],
      },
      {
        type: 'bar',
        x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
        y: [2, 5, 3, 2, 20, 7],
      },
    ],
    layout: {
      autosize: true,
      title: '<b style="font-size:1.2em;">A Sample Plot</b>',
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
                source:
                  'https://raw.githubusercontent.com/dev-cj/visualize-corona/master/src/watermark.png',
                xref: 'paper',
                yref: 'paper',
                sizex: 0.3,
                sizey: 0.3,
                opacity: 0.3,
                layer: 'below',
                ...action.payload.layout.images[0],
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
