import React, { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Progress,
  Badge,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Button,
} from '@chakra-ui/core'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import * as actionTypes from '../redux/actions/actionTypes'

const DesktopVisualizerLeft = (prop) => {
  // const active = prop.active
  const timelineData = useSelector((state) => state.stats.timeline)
  const countryData = useSelector((state) => state.stats.countries)
  const [currentCountry, setCurrentCountry] = useState('')
  const dispatch = useDispatch()
  const [dataStateGlobal, setdataStateGlobal] = useState(false)
  const getData = async () => {
    const api = 'https://corona-api.com/timeline'
    try {
      let response = await axios.get(api).then((data) => data.data.data)
      await dispatch({
        type: actionTypes.SET_STATS_TIMELINE,
        payload: response,
      })
      await setdataStateGlobal(true)
    } catch (e) {
      console.log(`Failed to fetch countries: ${e.message}`, e)
      return
    }
  }
  useEffect(() => {
    if (Object.keys(timelineData)) getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const FetchingData = () => (
    <Box
      d='flex'
      height='20%'
      width='full'
      justifyContent='center'
      alignItems='center'
      backgroundColor='gray.500'
    >
      Fetching Data
    </Box>
  )
  const Global = () => {
    const latestGlobalData = timelineData[0]
    const boxARDStyle = {
      d: 'flex',
      flexDir: 'row',
      justifyContent: 'space-between',
      mt: '1%',
      alignItems: 'center',
    }
    const confirmed = latestGlobalData.confirmed
    const active = latestGlobalData.active
    const recovered = latestGlobalData.recovered
    const deaths = latestGlobalData.deaths

    const percentage = {
      active: (active / confirmed) * 100,
      recovered: (recovered / confirmed) * 100,
      deaths: (deaths / confirmed) * 100,
    }
    const commaSepNo = (num) =>
      num.toLocaleString('en', {
        useGrouping: true,
      })
    console.log(latestGlobalData, percentage)
    return (
      <Box borderWidth='1px' rounded='md' p='2%'>
        <Box d='flex' alignItems='flex-start' flexDir='column'>
          <Text color='gray.600' fontSize='xl' mb='1%' fontWeight='bold'>
            Worldwide
          </Text>
          <Text color='gray.500' fontSize='md'>
            Total Confirmed Cases
          </Text>
          <Text color='black' fontSize='2xl' mb='1%' fontWeight='semibold'>
            {commaSepNo(confirmed)}
          </Text>
        </Box>
        <Box d='flex' paddingX='2px'>
          <Progress
            color='blue'
            size='sm'
            value={100}
            width={percentage.active + '%'}
            roundedLeft='md'
          />
          <Progress
            color='green'
            size='sm'
            value={100}
            width={percentage.recovered + '%'}
          />
          <Progress
            color='red'
            size='sm'
            value={100}
            width={percentage.deaths + '%'}
            roundedRight='md'
          />
        </Box>
        <Box d='flex' flexDir='column' justifyContent='space-evenly'>
          <Box {...boxARDStyle}>
            <Badge variant='solid' variantColor='blue' fontSize='0.8em'>
              Active Cases
            </Badge>
            <Box d='flex' alignItems='center'>
              <Icon name='triangle-up' color='blue.500' />
              <Text color='gray.500' fontSize='md'>
                {commaSepNo(latestGlobalData.new_confirmed)}
              </Text>
            </Box>
            <Text color='black' fontSize='md'>
              {commaSepNo(active)}
            </Text>
          </Box>
          <Box {...boxARDStyle}>
            <Badge variant='solid' variantColor='green' fontSize='0.8em'>
              Recovered
            </Badge>
            <Box d='flex' alignItems='center'>
              <Icon name='triangle-up' color='green.500' />
              <Text color='gray.500' fontSize='md'>
                {commaSepNo(latestGlobalData.new_recovered)}
              </Text>
            </Box>
            <Text color='black' fontSize='md'>
              {commaSepNo(recovered)}
            </Text>
          </Box>
          <Box {...boxARDStyle}>
            <Badge variant='solid' variantColor='red' fontSize='0.8em'>
              Deaths
            </Badge>
            <Box d='flex' alignItems='center'>
              <Icon name='triangle-up' color='red.500' />
              <Text color='gray.500' fontSize='md'>
                {commaSepNo(latestGlobalData.new_deaths)}
              </Text>
            </Box>
            <Text color='black' fontSize='md'>
              {commaSepNo(deaths)}
            </Text>
          </Box>
        </Box>
        <Box d='flex' fontSize='sm' mt='2px'>
          Ratio of Recovery &nbsp;
          <Text color='blue.500'>
            {percentage.recovered.toFixed(2) + '%'}&nbsp;
          </Text>
          & Deaths &nbsp;
          <Text color='blue.500'>{percentage.deaths.toFixed(2) + '%'}</Text>
        </Box>
      </Box>
    )
  }
  const CountryWise = () => {
    const CountryList = () => (
      <Box d='flex' flexDir='column' w='100%'>
        <Menu closeOnSelect={true}>
          <MenuButton mt={1} mb={1} as={Button} variantColor='blue' size='md'>
            {currentCountry || 'Select country'}
          </MenuButton>
          <MenuList
            minWidth='240px'
            maxHeight='50vh'
            overflowY='scroll'
            placement='top'
          >
            <MenuOptionGroup
              title='Country'
              type='radio'
              onChange={(value) => setCurrentCountry(value)}
              defaultValue={currentCountry}
            >
              {Object.keys(countryData).map((el) => {
                return (
                  <MenuItemOption key={el} value={el}>
                    {el}
                  </MenuItemOption>
                )
              })}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </Box>
    )
    const SingleCountry = (prop) => {
      if (!currentCountry) return ''
      const singleCountryData =
        countryData[currentCountry ? currentCountry : 'Afghanistan']
      const boxARDStyle = {
        d: 'flex',
        flexDir: 'row',
        justifyContent: 'space-between',
        mt: '1%',
        alignItems: 'center',
      }
      const confirmed = singleCountryData.cases
      const todayCases = singleCountryData.todayCases
      const active = singleCountryData.active
      const recovered = singleCountryData.recovered
      const deaths = singleCountryData.deaths
      const tests = singleCountryData.tests
      const testsPerOneMillion = singleCountryData.testsPerOneMillion
      const casesPerOneMillion = singleCountryData.casesPerOneMillion

      const percentage = {
        active: (active / confirmed) * 100,
        recovered: (recovered / confirmed) * 100,
        deaths: (deaths / confirmed) * 100,
      }
      const commaSepNo = (num) =>
        num.toLocaleString('en', {
          useGrouping: true,
        })
      return (
        <Box borderWidth='1px' rounded='md' p='2%'>
          <Box d='flex' alignItems='flex-start' flexDir='column'>
            <Text color='gray.600' fontSize='xl' mb='1%' fontWeight='bold'>
              {currentCountry}
            </Text>
            <Text color='gray.500' fontSize='md'>
              Total Confirmed Cases
            </Text>
            <Text color='black' fontSize='2xl' mb='1%' fontWeight='semibold'>
              {commaSepNo(confirmed)}
            </Text>
          </Box>
          <Box d='flex' paddingX='2px'>
            <Progress
              color='blue'
              size='sm'
              value={100}
              width={percentage.active + '%'}
              roundedLeft='md'
            />
            <Progress
              color='green'
              size='sm'
              value={100}
              width={percentage.recovered + '%'}
            />
            <Progress
              color='red'
              size='sm'
              value={100}
              width={percentage.deaths + '%'}
              roundedRight='md'
            />
          </Box>
          <Box d='flex' flexDir='column' justifyContent='space-evenly'>
            <Box {...boxARDStyle}>
              <Badge variant='solid' variantColor='blue' fontSize='0.8em'>
                Active Cases
              </Badge>
              <Box d='flex' alignItems='center'>
                <Icon name='triangle-up' color='blue.500' />
                <Text color='gray.500' fontSize='md'>
                  {commaSepNo(todayCases)}
                </Text>
              </Box>
              <Text color='black' fontSize='md'>
                {commaSepNo(active)}
              </Text>
            </Box>
            <Box {...boxARDStyle}>
              <Badge variant='solid' variantColor='green' fontSize='0.8em'>
                Recovered
              </Badge>
              <Text color='black' fontSize='md'>
                {commaSepNo(recovered)}
              </Text>
            </Box>
            <Box {...boxARDStyle}>
              <Badge variant='solid' variantColor='red' fontSize='0.8em'>
                Deaths
              </Badge>

              <Text color='black' fontSize='md'>
                {commaSepNo(deaths)}
              </Text>
            </Box>
          </Box>
          <Box d='flex' fontSize='sm' mt='2px'>
            Ratio of Recovery &nbsp;
            <Text color='blue.500'>
              {percentage.recovered.toFixed(2) + '%'}&nbsp;
            </Text>
            & Deaths &nbsp;
            <Text color='blue.500'>{percentage.deaths.toFixed(2) + '%'}</Text>
          </Box>
          <Box d='flex' flexDir='column' fontSize='sm' mt='2px'>
            <Box d='flex'>
              <Box d='flex'>
                Tests: &nbsp;
                <Text color='blue.500'>{commaSepNo(tests)}&nbsp;</Text>
              </Box>
              <Box d='flex'>
                Tests per Million: &nbsp;
                <Text color='blue.500'>
                  {commaSepNo(testsPerOneMillion)}&nbsp;
                </Text>
              </Box>
            </Box>
            <Box d='flex'>
              Cases per Million: &nbsp;
              <Text color='blue.500'>
                {commaSepNo(casesPerOneMillion)}&nbsp;
              </Text>
            </Box>
          </Box>
        </Box>
      )
    }
    return (
      <Box d='flex' flexDir='column' w='100%'>
        <Box d='flex' alignItems='center' justifyContent='center'>
          <CountryList />
        </Box>
        <SingleCountry currentCountry={currentCountry} />
      </Box>
    )
  }
  const MapLeftDiv = (
    <Box d='flex' flexDir='column' h='100%'>
      {dataStateGlobal ? (
        <Box width='100%' bg='#fff' paddingX='3%' pt='3%'>
          <Global />
          <Box d={['None', 'flex']}>
            <CountryWise />
          </Box>
        </Box>
      ) : (
        FetchingData()
      )}
    </Box>
  )
  return MapLeftDiv
}

export default DesktopVisualizerLeft
