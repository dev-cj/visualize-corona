import React, { useEffect } from 'react'
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom'
import './styles.css'
import Graph from './components/visualize'
import Maps from './components/Maps'
import { ThemeProvider, CSSReset, useToast, Box } from '@chakra-ui/core'

const App = () => {
  const Main = () => {
    const toast = useToast()

    useEffect(() => {
      toast({
        position: 'bottom-right',
        duration: null,
        isClosable: true,
        render: () => {
          const pathname = window.location.href.split('/').pop()
          return (
            <Box m={3} color='white' p={3} bg='blue.500'>
              <a href={pathname === 'graph' ? '#/' : '#/graph'}>
                {pathname === 'graph' ? 'Map' : 'Visualize'}
              </a>
            </Box>
          )
        },
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <></>
  }
  return (
    <Router>
      <ThemeProvider>
        <CSSReset />
        <Main />
        <div className='App'>
          <div className='app-90'>
            <Switch>
              <Route exact path='/'>
                <Maps />
              </Route>
              <Route path='/graph'>
                <Graph />
              </Route>
            </Switch>
          </div>
          <div className='info-box'>
            <div className='footnote'>
              <a href='http://devcj.in'>
                Built By <span className='highlight'>CJ</span>
              </a>
              <Link to='/graph'> visualize</Link>
              <Link to='/'>Map</Link>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </Router>
  )
}

export default App
