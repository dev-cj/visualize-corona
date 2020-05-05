import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Spinner, Box } from '@chakra-ui/core'
import DrawerOption from './drawer'
import Plot from 'react-plotly.js'
import { useDispatch, useSelector } from 'react-redux'
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
  const plotData = useSelector((state) => state.plotReducer.plotData)
  const [countryData, addData] = useState(
    useSelector((state) => state.visualizeData)
  )
  const getData = async () => {
    const data = await fetchData('new').then((data) => data)
    // await console.log(data)
    let obj = {}
    // const old_api_func = () => {
    //   data.forEach((el) => {
    //     let country = el.country
    //     let province = el.province
    //     let timeline = el.timeline
    //     if (province) {
    //       // console.log('province :', country, province, obj)
    //       obj[country] = { ...obj[country] }
    //       obj[country]['province'] = { ...obj[country]['province'] }

    //       obj[country]['province'][province] = { province, timeline }
    //     } else obj[country] = timeline
    //   })
    // }
    const new_api_func = () => {
      data.data.forEach((el) => {
        let country = el.name
        let keys_arr = Object.keys(el)
        let countryObj = {}
        keys_arr.forEach((key) => {
          if (key === 'timeline') {
            let timelineArr = el[key]
            let timelineObj = {}
            const dataByDate = {}
            let keys = timelineArr[1] ? Object.keys(timelineArr[1]) : null
            if (keys)
              keys.forEach((key) => {
                timelineObj[key] = timelineArr
                  .map((obj) => {
                    if (key === 'date') {
                      dataByDate[obj.date] = obj
                    }
                    return obj[key]
                  })
                  .reverse()
              })
            timelineObj['dataByDate'] = dataByDate
            countryObj[key] = timelineObj
          } else countryObj[key] = el[key]
        })
        obj[country] = { ...countryObj }
      })
    }
    await new_api_func()
    await addData(obj)
    dispatch({ type: actionTypes.SET_DATA, payload: obj })
  }

  useEffect(() => {
    if (!Object.keys(countryData).length) getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {Object.keys(countryData).length ? (
        <DrawerOption key='drawer-option' />
      ) : (
        <Box
          d='flex'
          alignItems='center'
          justifyContent='center'
          width='100%'
          bg='#9AE6B4'
        >
          'Fetching Data'
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Box>
      )}
      <Plot
        data={plotData.data}
        layout={{
          ...plotData.layout,
          type: 'date',
          barmode: 'group',
          autosize: true,
          width: window.innerWidth * 0.75,
          height: window.innerHeight * 0.96,
          // margin: {
          //   l: 50,
          //   r: 50,
          //   b: 100,
          //   t: 100,
          //   pad: 4,
          // },
        }}
        // frames={this.state.frames}
        config={{
          ...plotData.config,
          displayModeBar: true,
          displaylogo: false,
          scrollZoom: true,
          responsive: true,
          useResizeHandler: true,
          style: { width: '100%', height: '100%' },
          toImageButtonOptions: {
            format: 'jpeg',
            scale: 3,
          },
        }}
        // onInitialized={figure => this.setState(figure)}
        // onUpdate={figure => this.setState(figure)}
      />
    </>
  )
}
