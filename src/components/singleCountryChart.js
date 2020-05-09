import {
  Alert,
  AlertIcon,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuDivider,
  MenuOptionGroup,
  MenuItemOption,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Box,
} from '@chakra-ui/core'
import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actionTypes from '../redux/actions/actionTypes'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const CountryChart = () => {
  const dispatch = useDispatch()
  const countries = useSelector((state) => state.visualizeData)
  const [countryArr] = useState(Object.keys(countries).sort())
  const singleCountryData = useSelector((state) => state.singleCountryData)

  const [singleCountryPlot, setSingleCountryPlot] = useState({})
  const currentCountry = singleCountryData.country
  const currentType = singleCountryData.type
  const dateDiff = singleCountryData.xaxisDateDiff
  const CRD = singleCountryData.CRD
  const scatterType = singleCountryData.scatterType
  const [apply, setApply] = useState(false)
  const modifySingleCountry = (term) => {
    if (term === 'CRD') {
      if (CRD.length) {
        let update = false
        const plot = {
          data: [],
          layout: {
            title: currentCountry + ' ' + currentType + ' chart',
            xaxis: {},
          },
          frames: [],
          config: {},
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

        if (['scatter', 'bar'].includes(currentType)) {
          CRD.forEach((el) => {
            const xaxisDate = countries[currentCountry]['timeline']['date']
            const yAxisData = countries[currentCountry]['timeline'][getKey[el]]
            const data = {
              type: currentType,
              x: xaxisDate,
              y: yAxisData,
              name: el,
              marker: {
                color: colors[el],
              },
            }

            if (currentType === 'scatter') {
              data['mode'] = scatterType[el] ? scatterType[el] : 'lines'
            }
            plot.data.push(data)
            update = true
          })
          plot.layout.xaxis = {
            dtick: singleCountryData.xaxisDateDiff * 86400000,
            automargin: true,
            title: {
              text: 'Timeline',
              standoff: 5,
            },
            autorange: true,
            rangeselector: {
              buttons: [
                {
                  count: 1,
                  label: '1m',
                  step: 'month',
                  stepmode: 'backward',
                },
                {
                  count: 3,
                  label: '3m',
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
            rangeslider: { range: [] },
            type: 'date',
          }
        }
        if (currentType === 'pie') {
          const pieDateSingle = singleCountryData.pieDateSingle
          if (CRD.length && pieDateSingle) {
            const dateArr = countries[currentCountry]['timeline']['date']
            const values = []
            const labels = []
            const markers = []
            CRD.forEach((el) => {
              const arr = countries[currentCountry]['timeline'][getKey[el]]
              const dateIndex = dateArr.indexOf(pieDateSingle)
              const val = pieDateSingle ? arr[dateIndex] : arr.pop()
              values.push(val)
              labels.push(el)
              markers.push(colors[el])
            })
            const data = {
              type: currentType,
              values: values,
              labels: labels,
              marker: {
                colors: markers,
              },
              texttemplate: '%{label}: %{value} (%{percent})',
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
      }
    }
  }

  useEffect(() => {
    if (singleCountryData.country && apply) {
      dispatch({ type: actionTypes.SET_PLOT, payload: singleCountryPlot })
      setApply(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleCountryPlot])
  useEffect(() => {
    modifySingleCountry('CRD')
    setApply(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleCountryData])
  const setScatter = (arg) => {
    const arr = arg.split('-')
    dispatch({
      type: actionTypes.SET_singleCountry_scatterType,
      payload: { ...scatterType, [arr[0]]: arr[1] },
    })
  }
  const optionsArray = ['Cases', 'Deaths', 'Recovered', 'Active']
  return (
    <>
      <Menu closeOnSelect={true}>
        <MenuButton mt={2} as={Button} variantColor='blue' size='md'>
          Select country
        </MenuButton>
        <MenuList
          minWidth='240px'
          maxHeight='70vh'
          overflowY='scroll'
          zIndex={2}
        >
          <MenuOptionGroup
            title='Country'
            type='radio'
            onChange={(value) => {
              dispatch({ type: actionTypes.SET_singleCountry, payload: value })
              dispatch({
                type: actionTypes.SET_singleCountry_dateRange,
                payload: Object.keys(
                  countries[value]['timeline']['dataByDate']
                ).reverse(),
              })
            }}
            defaultValue={currentCountry}
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
      {currentCountry ? (
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
                defaultValue={currentType}
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
          {currentType ? (
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
              {currentType === 'scatter' && CRD.length ? (
                <Menu closeOnSelect={false}>
                  <MenuButton mt={2} as={Button} variantColor='blue' size='md'>
                    Modes
                  </MenuButton>
                  <MenuList minWidth='240px' position='relative'>
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
              {['bar', 'scatter'].includes(currentType) && CRD.length ? (
                <>
                  <Text color='gray.500' mt={2}>
                    Select spacing between date on xaxis
                  </Text>
                  <NumberInput
                    mt={2}
                    defaultValue={dateDiff}
                    onChange={(value) =>
                      dispatch({
                        type: actionTypes.SET_singleCountry_xaxisDateDiff,
                        payload: value,
                      })
                    }
                  >
                    <NumberInputField type='number' placeholder='Default' />{' '}
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </>
              ) : null}
              {currentType === 'pie' && CRD.length ? (
                <>
                  <Box mt={2}>
                    {!singleCountryData.pieDateSingle ? (
                      <Alert status='info'>
                        <AlertIcon />
                        Select a date below
                      </Alert>
                    ) : null}

                    <Box border='2px'>
                      <DatePicker
                        {...(singleCountryData.pieDateSingle
                          ? {
                              selected: moment(
                                singleCountryData.pieDateSingle,
                                moment.defaultFormat
                              ).toDate(),
                            }
                          : undefined)}
                        dateFormat='dd/MM/yyyy'
                        onChange={(date) =>
                          dispatch({
                            type: actionTypes.SET_singleCountry_pieDateSingle,
                            payload: moment(date).format('YYYY-MM-DD'),
                          })
                        }
                        minDate={moment(
                          singleCountryData.dateRange[0],
                          moment.defaultFormat
                        ).toDate()}
                        maxDate={moment(
                          singleCountryData.dateRange[
                            singleCountryData.dateRange.length - 1
                          ],
                          moment.defaultFormat
                        ).toDate()}
                        includeDates={singleCountryData.dateRange.map((el) =>
                          moment(el, moment.defaultFormat).toDate()
                        )}
                        placeholderText='Select a date'
                      />
                    </Box>
                  </Box>
                </>
              ) : null}
            </>
          ) : null}
        </>
      ) : null}
    </>
  )
}

export default CountryChart
