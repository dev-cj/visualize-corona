import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuDivider,
  MenuOptionGroup,
  MenuItemOption,
  RadioButtonGroup,
} from '@chakra-ui/core'
import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actionTypes from '../redux/actions/actionTypes'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'
import moment from 'moment'

const CountryChart = ({ props }) => {
  const dispatch = useDispatch()
  const { countryData, plotFunc } = props
  const countries = useSelector((state) => state.visualizeData)
  const [countryArr] = useState(Object.keys(countries).sort())
  const [samplePlot] = useState({
    empty: {
      data: [],
      layout: { width: '100%', height: '100%', title: '' },
      frames: [],
      config: { responsive: true },
    },
  })

  const singleCountryData = useSelector((state) => state.singleCountryData)

  const [singleCountryPlot, setSingleCountryPlot] = useState({})
  // const [CRD, setCRD] = useState([])
  const CRD = singleCountryData.CRD
  // const [scatterType, setScatterType] = useState({})
  const scatterType = singleCountryData.scatterType
  const modifySingleCountry = (term, obj) => {
    if (term === 'CRD') {
      // console.log(CRD.length, 'length', CRD)
      if (CRD.length > 0) {
        let update = false
        const plot = {
          data: [],
          layout: {
            width: '',
            height: 'auto',
            title:
              singleCountryData.country +
              ' ' +
              singleCountryData.type +
              ' ' +
              'chart',
            barmode: 'group',
          },
          frames: [],
          config: {
            responsive: true,
            scrollZoom: true,
            toImageButtonOptions: {
              format: 'jpeg',
              scale: 3,
            },
          },
        }
        const getKey = {
          cases: 'confirmed',
          deaths: 'deaths',
          recovered: 'recovered',
          active: 'active',
          new_confirmed: 'new_confirmed',
          new_deaths: 'new_deaths',
          new_recovered: 'new_recovered',
          date: 'date',
        }
        const colors = {
          cases: '#E33427',
          deaths: '#5A0924',
          recovered: '#09D32C',
          active: '#10AAC0',
          new_confirmed: '#3E08E0',
          new_deaths: '#78BBD9',
          new_recovered: '#98AAC0',
        }
        console.log(countries[singleCountryData.country]['timeline'])
        const type = singleCountryData.type
        if (type === 'scatter' || type === 'bar') {
          CRD.forEach((el) => {
            const xaxisDate =
              countries[singleCountryData.country]['timeline']['date']
            const yAxisData =
              countries[singleCountryData.country]['timeline'][getKey[el]]
            const data = {
              type: type,
              x: xaxisDate,
              y: yAxisData,
              name: el,
              marker: {
                color: colors[el],
              },
            }

            if (type === 'scatter') {
              data['mode'] = scatterType[el] ? scatterType[el] : 'lines'
            }
            plot.data.push(data)
            update = true
          })
          plot.layout['xaxis'] = {
            autorange: true,
            range: ['2020-01-22', '2020-09-20'],
            rangeselector: {
              buttons: [
                {
                  count: 1,
                  label: '1m',
                  step: 'month',
                  stepmode: 'backward',
                },
                {
                  count: 6,
                  label: '6m',
                  step: 'month',
                  stepmode: 'backward',
                },
                { step: 'all' },
              ],
            },
            rangeslider: { range: ['2020-01-01', '2020-04-17'] },
            type: 'date',
          }
        }
        if (type === 'pie') {
          const pieDateSingle = singleCountryData.pieDateSingle
          if (CRD.length && pieDateSingle) {
            console.log('blahhhhh :>> ', pieDateSingle)
            const dateArr =
              countries[singleCountryData.country]['timeline']['date']
            const values = []
            const labels = []
            const markers = []
            CRD.forEach((el) => {
              const arr =
                countries[singleCountryData.country]['timeline'][getKey[el]]
              const dateIndex = dateArr.indexOf(pieDateSingle)
              const val = pieDateSingle ? arr[dateIndex] : arr.pop()
              values.push(val)
              labels.push(el)
              markers.push(colors[el])
            })
            const data = {
              type: type,
              values: values,
              labels: labels,
              marker: {
                colors: markers,
              },
              textinfo: 'label+percent',
              textposition: 'outside',
              automargin: true,
            }
            plot.data.push(data)
            plot.layout.title =
              plot.layout.title +
              ' as on ' +
              (pieDateSingle ? pieDateSingle : dateArr.pop())
            update = true
          }
        }
        if (update) setSingleCountryPlot(plot)
        console.log(plot, 'plott', singleCountryData)
      }
    }
  }
  const addToPlot = () => {
    plotFunc.addPlotCountry(singleCountryPlot)
  }
  useEffect(() => {
    modifySingleCountry('CRD')
  }, [singleCountryData])

  useEffect(() => {
    console.log('singlecountrydata useeffect changed?')
  }, [singleCountryData])

  useEffect(() => {
    if (singleCountryData.country) {
      plotFunc.addPlotCountry(singleCountryPlot)
    }
  }, [singleCountryPlot])

  const setScatter = (arg) => {
    const arr = arg.split('-')
    dispatch({
      type: actionTypes.SET_singleCountry_scatterType,
      payload: { ...scatterType, [arr[0]]: arr[1] },
    })
  }
  const optionsArray = ['Cases', 'Deaths', 'Recovered', 'Active']
  const SwitchOption = (
    <>
      <Menu
        closeOnSelect={true}
        onOpen={
          singleCountryData.country
            ? () => plotFunc.addPlotCountry(samplePlot.empty)
            : null
        }
      >
        <MenuButton mt={2} as={Button} variantColor='blue' size='md'>
          Select country
        </MenuButton>
        <MenuList minWidth='240px' maxHeight='50vh' overflowY='scroll'>
          <MenuOptionGroup
            title='Country'
            type='radio'
            onChange={(value) =>
              dispatch({ type: actionTypes.SET_singleCountry, payload: value })
            }
            defaultValue={singleCountryData.country}
          >
            {countryArr.map((el) => {
              return (
                <MenuItemOption key={el} value={el}>
                  {el}
                </MenuItemOption>
              )
            })}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
      {singleCountryData.country ? (
        <>
          <Menu closeOnSelect={true}>
            <MenuButton mt={2} as={Button} variantColor='blue' size='md'>
              Select type
            </MenuButton>
            <MenuList minWidth='240px'>
              <MenuOptionGroup
                title='type'
                type='radio'
                onChange={(value) =>
                  dispatch({
                    type: actionTypes.SET_singleCountry_type,
                    payload: value,
                  })
                }
                defaultValue={singleCountryData.type}
              >
                {['Bar', 'Scatter', 'Pie'].map((el) => {
                  return (
                    <MenuItemOption
                      key={el.toLowerCase()}
                      value={el.toLowerCase()}
                    >
                      {el}
                    </MenuItemOption>
                  )
                })}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          {singleCountryData.type ? (
            <>
              <Menu closeOnSelect={false}>
                <MenuButton mt={2} as={Button} variantColor='blue' size='md'>
                  Add to graph
                </MenuButton>
                <MenuList minWidth='240px'>
                  <MenuOptionGroup
                    title='Select one or more'
                    type='checkbox'
                    onChange={(value) =>
                      dispatch({
                        type: actionTypes.SET_singleCountry_CRD,
                        payload: value,
                      })
                    }
                    defaultValue={CRD}
                  >
                    {optionsArray.map((el) => {
                      return (
                        <MenuItemOption
                          key={el.toLowerCase()}
                          value={el.toLowerCase()}
                        >
                          {el}
                        </MenuItemOption>
                      )
                    })}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
              {singleCountryData.type === 'scatter' && CRD.length ? (
                <Menu closeOnSelect={false}>
                  <MenuButton mt={2} as={Button} variantColor='blue' size='md'>
                    Modes
                  </MenuButton>
                  <MenuList minWidth='240px'>
                    {optionsArray.map((el) => {
                      const el_lowercase = el.toLowerCase()
                      return CRD.includes(el_lowercase) ? (
                        <Fragment key={el + 'modeFragment'}>
                          <MenuOptionGroup
                            key={el + 'modes'}
                            title={el}
                            type='radio'
                            defaultValue={
                              el_lowercase + '-' + scatterType[el_lowercase]
                            }
                            onChange={(value) => setScatter(value)}
                          >
                            <MenuItemOption
                              key={el_lowercase + '-markers'}
                              value={el_lowercase + '-markers'}
                            >
                              Markers
                            </MenuItemOption>
                            <MenuItemOption
                              key={el_lowercase + '-lines'}
                              value={el_lowercase + '-lines'}
                            >
                              Lines
                            </MenuItemOption>
                            <MenuItemOption
                              key={el_lowercase + '-lines+markers'}
                              value={el_lowercase + '-lines+markers'}
                            >
                              Lines + Markers
                            </MenuItemOption>
                          </MenuOptionGroup>
                          <MenuDivider key={el + 'divider'} />
                        </Fragment>
                      ) : null
                    })}
                  </MenuList>
                </Menu>
              ) : null}
              {singleCountryData.type === 'pie' && CRD.length ? (
                <DayPickerInput
                  value={singleCountryData.pieDateSingle}
                  onDayChange={(date) =>
                    dispatch({
                      type: actionTypes.SET_singleCountry_pieDateSingle,
                      payload: moment(date).format('YYYY-MM-DD'),
                    })
                  }
                  dayPickerProps={{
                    // month: new Date(2018, 8),
                    fromMonth: new Date(2020, 0),
                    toMonth: new Date(2020, 11),
                  }}
                />
              ) : null}
            </>
          ) : null}
        </>
      ) : null}
    </>
  )

  return SwitchOption
}

export default CountryChart
