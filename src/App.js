import React, { useState } from 'react'
import './styles.css'
import Graph from './components/visualize'
import Maps from './components/Maps'
import DesktopVisualizerLeft from './components/desktopVisualizerLeft'
import DrawerOption from './components/drawer'
import { ThemeProvider, CSSReset, Box, Button } from '@chakra-ui/core'

const App = () => {
  const [activeComp, setActiveComp] = useState('map')

  return (
    <ThemeProvider>
      <CSSReset />
      <Box height='100vh'>
        <Box d='flex' height='96%'>
          <Box d='flex' width='100%' height='100%' flexDir={['column', 'row']}>
            <Box
              d='flex'
              flexDir='column'
              flexWrap='nowrap'
              width={['100%', '100%', '100%', '25%']}
              bg='#fff'
            >
              <Box d='flex' flexDir='column' h={['50%', '50%', '50%', '100%']}>
                <Box
                  textAlign='center'
                  fontSize='2em'
                  bg='blue.500'
                  height='auto'
                  color='white'
                >
                  Covid-19 Visualizer
                </Box>
                <Box>
                  <DesktopVisualizerLeft active={activeComp} />
                </Box>
                <Box
                  d='flex'
                  mt='auto'
                  height='auto'
                  width='full'
                  justifyContent='center'
                >
                  {activeComp === 'map' ? (
                    <Box alignSelf='flex-end'>
                      <Button
                        data-tname='VisualizeButton'
                        variantColor='pink'
                        variant='solid'
                        onClick={() => setActiveComp('graph')}
                      >
                        Visualize
                      </Button>
                    </Box>
                  ) : (
                    <Box
                      w='100%'
                      d='flex'
                      alignItems='center'
                      justifyContent='space-evenly'
                    >
                      <Box d={['None', 'initial']}>
                        <DrawerOption key='drawer-option' />
                      </Box>
                      <Button
                        data-tname='MapButton'
                        variantColor='teal'
                        variant='solid'
                        onClick={() => setActiveComp('map')}
                      >
                        Map
                      </Button>
                      <Box d={['None', 'initial']}>
                        <Button
                          data-tname='DownloadButton'
                          variantColor='teal'
                          variant='solid'
                          onClick={() =>
                            document
                              .querySelector('a[data-title="Download plot"]')
                              .click()
                          }
                        >
                          Download
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            <Box width={['100%', '75%']} height='100%' bg='#fff'>
              {activeComp === 'map' ? <Maps /> : <Graph />}
            </Box>
          </Box>
        </Box>
        <Box className='info-box'>
          <Box width={{ md: 100 / 3 + '%' }}></Box>
          <Box
            width={{ md: 100 / 3 + '%' }}
            display={{ md: 'flex' }}
            justifyContent={{ md: 'center' }}
          >
            <a
              data-tname='BuiltByCJ'
              className='footnote'
              href='https://devcj.in'
              target='_blank'
              rel='noopener noreferrer'
            >
              Built By <span className='highlight'>CJ</span>
            </a>
          </Box>
          <Box
            width={{ md: 100 / 3 + '%' }}
            display={{ md: 'flex' }}
            justifyContent={{ md: 'flex-end' }}
            style={{ color: '#fff' }}
          >
            <a
              data-tname='ForkThisRepo'
              href='https://github.com/dev-cj/visualize-corona'
              target='_blank'
              rel='noopener noreferrer'
            >
              Fork this repo &nbsp;
              <span className='highlight'>here &nbsp;</span>
            </a>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
