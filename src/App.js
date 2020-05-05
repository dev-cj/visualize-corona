import React, { useState } from 'react'
import './styles.css'
import Graph from './components/visualize'
import Maps from './components/Maps'
import DesktopVisualizerLeft from './components/desktopVisualizerLeft'
import { ThemeProvider, CSSReset, Box, Button } from '@chakra-ui/core'

const App = () => {
  const [activeComp, setActiveComp] = useState('map')

  return (
    <ThemeProvider>
      <CSSReset />
      <Box height='100vh'>
        <Box d='flex' height='96%'>
          <Box d='flex' width='100%' height='100%'>
            <Box
              d='flex'
              flexDir='column'
              flexWrap='nowrap'
              width='25%'
              height='100%'
              bg='#fff'
              // justifyContent='flex-start'
              // alignItems='center'
            >
              <Box textAlign='center' fontSize='2em' bg='#ff4'>
                Corona Stats
              </Box>
              <DesktopVisualizerLeft active={activeComp} />
              <Box
                // bg='#ba35f2'
                d='flex'
                mt='auto'
                height='auto'
                // paddingY='2px'
                width='full'
                justifyContent='center'
              >
                {activeComp === 'map' ? (
                  <Button
                    variantColor='pink'
                    variant='solid'
                    onClick={() => setActiveComp('graph')}
                  >
                    Visualize
                  </Button>
                ) : (
                  <Button
                    variantColor='teal'
                    variant='solid'
                    onClick={() => setActiveComp('map')}
                  >
                    Map
                  </Button>
                )}
              </Box>
            </Box>
            <Box width='75%' height='100%' bg='#445894'>
              {activeComp === 'map' ? <Maps /> : <Graph />}
            </Box>
          </Box>
        </Box>
        <div className='info-box'>
          <div className='footnote'>
            <a href='https://devcj.in'>
              Built By <span className='highlight'>CJ</span>
            </a>
          </div>
        </div>
      </Box>
    </ThemeProvider>
  )
}

export default App
