import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Select,
  useDisclosure,
  Box,
} from '@chakra-ui/core'

import React, { useState } from 'react'
import CountryChart from './singleCountryChart'

const DrawerOption = ({ countryData, plotFunc }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  const [option, setoption] = useState('')

  const apply = (obj) => {
    plotFunc.addPlotCountry(obj)
  }
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
        autosize: true,
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

  const switchOption = (value) => {
    switch (value) {
      case 'country-chart':
        return (
          <>
            <CountryChart
              key='country-chart'
              props={{ countryData, plotFunc }}
            />
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
        key='menu-button'
      >
        Menu
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        // finalFocusRef={btnRef}
        isFullHeight={true}
        key='drawer-content'
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
                defaultValue={option}
              >
                <option value='country-chart'>Country Chart</option>
                <option value='compare-countries'>Compare Countries</option>
                <option value='something-new'>Something new</option>
              </Select>
              {switchOption(option)}
            </Box>
          </DrawerBody>

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
