import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuDivider,
  MenuOptionGroup,
  MenuItemOption,
} from '@chakra-ui/core'
import React, { useState, useEffect } from 'react'

const CountryChart = ({ props }) => {
  const { countryData, plotFunc } = props
  const [countries] = useState(countryData)
  const [countryArr] = useState(Object.keys(countries).sort())
  const [samplePlot] = useState({
    empty: {
      data: [],
      layout: { width: '100%', height: '100%', title: '' },
      frames: [],
      config: { responsive: true },
    },
  })
  const [singleCountryData, setSingleCountryData] = useState({
    country: '',
    type: '',
  })

  const [singleCountryPlot, setSingleCountryPlot] = useState({})
  const [CRD, setCRD] = useState([])

  const [scatterType, setScatterType] = useState({})

  const modifySingleCountry = (term, obj) => {
    if (term === 'CRD') {
      // console.log(CRD.length, 'length', CRD)
      if (CRD.length > 0) {
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
            xaxis: {
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
            },
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
        CRD.forEach((el) => {
          const getKey = {
            cases: 'confirmed',
            deaths: 'deaths',
            recovered: 'recovered',
            date: 'date',
            active: 'active',
            new_confirmed: 'new_confirmed',
            new_deaths: 'new_deaths',
            new_recovered: 'new_recovered',
          }
          const xaxisDate =
            countries[singleCountryData.country]['timeline']['date']
          const yAxisData =
            countries[singleCountryData.country]['timeline'][getKey[el]]

          const data = {
            type: singleCountryData.type,
            x: xaxisDate,
            y: yAxisData,
            name: el,
          }
          if (singleCountryData.type === 'scatter') {
            data['mode'] = scatterType[el] ? scatterType[el] : 'lines'
          }
          plot.data.push(data)
        })
        setSingleCountryPlot(plot)
        console.log(plot, 'plott', singleCountryData)
      }
    }
  }
  const addToPlot = () => {
    plotFunc.addPlotCountry(singleCountryPlot)
  }
  useEffect(() => {
    modifySingleCountry('CRD')
  }, [CRD.length, scatterType])

  useEffect(() => {
    if (singleCountryData.country) {
      plotFunc.addPlotCountry(singleCountryPlot)
    }
  }, [singleCountryPlot])

  const setScatter = (arg) => {
    const arr = arg.split('-')
    setScatterType({ ...scatterType, [arr[0]]: arr[1] })
  }
  console.log('countryData :', countryData)
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
            onChange={(value) => setSingleCountryData({ country: value })}
            defaultValue={singleCountryData.country}
          >
            {' '}
            {console.log(singleCountryData)}
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
      {singleCountryData.country}
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
                  setSingleCountryData({
                    ...singleCountryData,
                    type: value,
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
                    onChange={(value) => {
                      setCRD(value)
                      return
                    }}
                    defaultValue={CRD}
                  >
                    {['Cases', 'Deaths', 'Recovered'].map((el) => {
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
                    {['Cases', 'Deaths', 'Recovered'].map((el) => {
                      const el_lowercase = el.toLowerCase()
                      return CRD.includes(el_lowercase) ? (
                        <>
                          <MenuOptionGroup
                            key={el}
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
                          <MenuDivider />
                        </>
                      ) : null
                    })}
                  </MenuList>
                </Menu>
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
