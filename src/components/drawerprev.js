import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Flex,
  DrawerCloseButton,
  Button,
  Select,
  useDisclosure,
  Box,
  Input,
  RadioGroup,
  Radio,
  Text,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/core'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  MenuOptionGroup,
  MenuItemOption,
} from '@chakra-ui/core'
import React, { useState, useEffect, useCallback } from 'react'
const DrawerOption = ({ countryData, plotFunc }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  const [countries] = useState(countryData)
  const [option, setoption] = useState('')
  const [samplePlot] = useState({
    init: {
      data: [
        { type: 'bar', x: ['a', 'b', 'c'], y: [2, 5, 6] },
        { type: 'line', x: ['a', 'b', 'c'], y: [2, 5, 3] },
      ],
      layout: {
        width: '100%',
        height: '100%',
        title: 'A sample plot',
        barmode: 'relative',
      },
      frames: [],
      config: { responsive: true },
    },
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

  const modifySingleCountry = (term, obj, arr) => {
    if (term === 'CRD') {
      // console.log(CRD.length, 'length', CRD)
      if (CRD.length > 0) {
        const plot = {
          data: [],
          layout: {
            width: '100%',
            height: '100%',
            title:
              singleCountryData.country +
              ' ' +
              singleCountryData.type +
              ' ' +
              'chart',
            barmode: 'relative',
          },
          frames: [],
          config: {
            responsive: false,
            scrollZoom: true,
            toImageButtonOptions: {
              format: 'jpeg', // one of png, svg, jpeg, webp

              scale: 3, // Multiply title/legend/axis/canvas sizes by this factor
            },
          },
        }
        CRD.forEach((el) => {
          const data = {
            type: singleCountryData.type,
            x: Object.keys(countries[singleCountryData.country][el]),
            y: Object.values(countries[singleCountryData.country][el]),
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
    if (term === 'date') {
      const el = ''
      console.log(obj, 'aaaaaaaaaa')
      const arr = []
      const plotData = []
      console.log(arr)

      console.log(el, countries.el)
      const data = {
        type: 'bar',
        x: Object.keys(countries[el].cases),
        y: Object.values(countries[el].cases),
        name: el,
      }
      plotData.push(data)

      console.log(plotData, 'aaaaaaa')
      // plotFunc.addPlotCountry({ ...plotFunc.plotData, data: plotData })
    }
  }
  const addToPlot = () => {
    // console.log(prop, 'aaaaaaaaaa')
    // const arr = [prop]
    // const plotData = []
    // console.log(arr)
    // arr.forEach((el) => {
    //   console.log(el, countries.el)
    //   const data = {
    //     type: 'bar',
    //     x: Object.keys(countries[el].cases),
    //     y: Object.values(countries[el].cases),
    //     name: el,
    //   }
    //   plotData.push(data)
    // })
    // console.log(plotData, 'aaaaaaa')
    plotFunc.addPlotCountry(singleCountryPlot)
  }
  useEffect(() => {
    modifySingleCountry('CRD')
  }, [CRD.length, scatterType])

  useEffect(() => {
    if (!singleCountryData.country) {
      plotFunc.addPlotCountry(samplePlot.init)
    } else plotFunc.addPlotCountry(singleCountryPlot)
  }, [singleCountryPlot])

  const setScatter = (arg) => {
    const arr = arg.split('-')
    console.log(arr)
    const type = {}
    type[arr[0]] = arr[1]
    // const scatterName = arr[1]
    setScatterType({ ...scatterType, ...type })
  }
  // const add = useCallback(addToPlot, [singleCountryPlot])

  // const modifyCRD = useCallback(modifySingleCountry('CRD'), [CRD])
  const switchOption = (value) => {
    switch (value) {
      case 'country-chart':
        return (
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
                  {Object.keys(countries).map((el) => {
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
                      <MenuButton
                        mt={2}
                        as={Button}
                        variantColor='blue'
                        size='md'
                      >
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
                        <MenuButton
                          mt={2}
                          as={Button}
                          variantColor='blue'
                          size='md'
                        >
                          Modes
                        </MenuButton>
                        <MenuList minWidth='240px'>
                          {['Cases', 'Deaths', 'Recovered'].map((el) => {
                            const el_lowercase = el.toLowerCase()
                            return CRD.includes(el_lowercase) ? (
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
      case 'compare-countries':
        return '🥺🥺🥺'
      case 'something-new':
        return 'something-new'
      default:
        return
    }
  }

  return (
    <>
      <Button
        ref={btnRef}
        pos='absolute'
        top='30%'
        left='0'
        variantColor='teal'
        onClick={onOpen}
        zIndex={100}
      >
        Menu
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        // finalFocusRef={btnRef}
        isFullHeight={true}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your chart</DrawerHeader>
          <DrawerBody>
            <Box
              flexDirection='column'
              display='flex'
              alignItems='baseline'
              justifyContent='space-between'
            >
              <Select
                placeholder='Select option'
                onChange={(e) => setoption(e.target.value)}
              >
                <option value='country-chart'>Country Chart</option>
                <option value='compare-countries'>Compare Countries</option>
                <option value='something-new'>Something new</option>
              </Select>
              {switchOption(option)}
            </Box>
          </DrawerBody>
          {CRD}
          <br />
          {Object.keys(scatterType)} <br />
          {Object.values(scatterType)}
          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button color='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default DrawerOption
