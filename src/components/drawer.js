import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  // DrawerCloseButton,
  Button,
  Select,
  useDisclosure,
  Box,
  Alert,
  AlertIcon,
} from '@chakra-ui/core'

import React, { useState } from 'react'
import CountryChart from './singleCountryChart'

const DrawerOption = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  const [option, setoption] = useState('')

  const switchOption = (value) => {
    switch (value) {
      case 'country-chart':
        return (
          <>
            <CountryChart key='country-chart' />
          </>
        )
      case 'compare-countries':
        return (
          <Alert status='info' mt={2}>
            <AlertIcon />
            Compare Countries feature is coming soon!
          </Alert>
        )
      default:
        return
    }
  }

  return (
    <>
      <Button
        ref={btnRef}
        pos='absolute'
        bottom='4%'
        left='1%'
        variantColor='teal'
        onClick={onOpen}
        zIndex={100}
        key='menu-button'
        leftIcon='edit'
      >
        Create
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        isFullHeight={true}
        key='drawer-content'
      >
        <DrawerOverlay />
        <DrawerContent>
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
              </Select>
              {switchOption(option)}
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default DrawerOption
