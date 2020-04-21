import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './styles.css'
import Graph from './components/visualize'
import Maps from './components/Maps'
import { ThemeProvider, theme, CSSReset } from '@chakra-ui/core'
import { useToast, Box, Button } from '@chakra-ui/core'

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
    },
  },
}
export default function App() {
  function Main() {
    const toast = useToast()

    useEffect(() => {
      toast({
        position: 'bottom',
        duration: null,
        isClosable: true,
        render: () => (
          <Box m={3} color='white' p={3} bg='blue.500'>
            <a href={window.location.pathname === '/' ? '/graph' : '/'}>
              {window.location.pathname === '/' ? 'Visualize' : 'Map'}
            </a>
          </Box>
        ),
      })
    }, [])

    return <></>
  }
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CSSReset />
        <div className='App'>
          <Main />
          <Switch>
            <Route exact path='/'>
              <Maps />
            </Route>
            <Route path='/graph'>
              <Graph />
            </Route>
          </Switch>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
}
