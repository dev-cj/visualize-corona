import React, { useState, useEffect } from 'react'
import { Link as Rlink } from 'react-router-dom'
import axios from 'axios'
import { Heading, Text, Link, Icon, Box } from '@chakra-ui/core'
import DrawerOption from './drawer'
import Plot from 'react-plotly.js'
import { useDispatch } from 'react-redux'
import * as actionTypes from '../redux/actions/actionTypes'

async function fetchData(url) {
  const historical = 'https://corona.lmao.ninja/v2/historical?lastdays=all'
  const corona_api = 'https://corona-api.com/countries?include=timeline'
  try {
    const api = url === 'old' ? historical : corona_api
    let response = await axios.get(api)
    // console.log(response.data);
    return response.data
  } catch (e) {
    console.log(`Failed to fetch countries: ${e.message}`, e)
    return
  }
}

export default function Graph() {
  const dispatch = useDispatch()

  const [countryData, addData] = useState(null)
  const [plotData, addPlotCountry] = useState({})
  const [samplePlot] = useState({
    init: {
      data: [
        { type: 'bar', x: ['a', 'b', 'c'], y: [2, 5, 6] },
        { type: 'bar', x: ['a', 'b', 'c'], y: [2, 5, 3] },
      ],
      layout: {
        width: '100%',
        height: '100%',
        title: 'A sample plot',
        barmode: 'group',
      },
      frames: [],
      config: { responsive: true },
    },
  })
  const getData = async () => {
    const data = await fetchData('new').then((data) => data)
    await console.log(data)
    let obj = {}
    const old_api_func = () => {
      data.forEach((el) => {
        let country = el.country
        let province = el.province
        let timeline = el.timeline
        if (province) {
          // console.log('province :', country, province, obj)
          obj[country] = { ...obj[country] }
          obj[country]['province'] = { ...obj[country]['province'] }

          obj[country]['province'][province] = { province, timeline }
        } else obj[country] = timeline
      })
    }
    const new_api_func = () => {
      data.data.forEach((el) => {
        let country = el.name
        let keys_arr = Object.keys(el)
        let countryObj = {}
        keys_arr.forEach((key) => {
          if (key === 'timeline') {
            let timelineArr = el[key]
            let timelineObj = {}
            // timelineObj['date_array'] = timelineArr.map((el) => el.date)
            let keys = timelineArr[1] ? Object.keys(timelineArr[1]) : null
            if (keys)
              keys.forEach((key) => {
                // console.log(
                //   'keysblahhhh :',
                //   key,
                //   timelineArr.map((obj) => obj[key]).reverse()
                // )
                timelineObj[key] = timelineArr.map((obj) => obj[key]).reverse()
              })
            // timelineArr.forEach((el) => (timelineObj[el] = el))
            countryObj[key] = timelineObj
          } else countryObj[key] = el[key]
        })
        obj[country] = { ...countryObj }
      })
    }
    await new_api_func()
    await addData(obj)
    dispatch({ type: actionTypes.SET_DATA, payload: obj })
    // await console.log(obj)
  }

  useEffect(() => {
    console.log('calling get data useffect')
    getData()
  }, [])
  useEffect(() => {
    if (countryData) {
      addPlotCountry(samplePlot.init)
    }
  }, [countryData])
  return (
    <div className='visualize-comp'>
      <>
        <div className='visualise-div'>
          <div className='left-option-div'>
            {countryData ? (
              <DrawerOption
                key='drawer-option'
                countryData={countryData}
                plotFunc={{ addPlotCountry }}
              />
            ) : (
              'Data not fetched'
            )}
          </div>

          <div className='right-plot-div'>
            <Plot
              data={plotData.data}
              layout={{ ...plotData.layout, type: 'date' }}
              // frames={this.state.frames}
              config={{ ...plotData.config, displaylogo: false }}
              // onInitialized={figure => this.setState(figure)}
              // onUpdate={figure => this.setState(figure)}
            />
          </div>
        </div>
      </>
    </div>
  )
}
