import React, { useState, useEffect } from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import moment from 'moment'
import { geoData } from './helper'
import { Box, Image, Text, Badge } from '@chakra-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import * as actionTypes from '../redux/actions/actionTypes'

// import { useToast, Box, Button } from '@chakra-ui/core'
const icon = (url) =>
  new L.icon({
    iconUrl: 'https://img.icons8.com/color/96/000000/marker.png',
    iconSize: [25, 25],
  })
const Maps = () => {
  const dispatch = useDispatch()
  const [data, updateData] = useState(useSelector((state) => state.mapData))

  // const [pop, activePop] = useState(null);
  const asyncfun = async () => {
    return await geoData().then((data) => data)
  }
  const position = [51.505, -0.09]
  const dataMap = () => {
    asyncfun().then((data) => {
      updateData(data.geoJson)
      dispatch({
        type: actionTypes.SET_STATS_COUNTRIES,
        payload: data.countriesObj,
      })
      dispatch({ type: actionTypes.SET_MAP_DATA, payload: data.geoJson })
    })
  }
  useEffect(() => {
    if (!Object.keys(data).length) dataMap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const marker = (prop) => {
    const properties = prop.properties
    const date = new Date(properties.updated)
    let lastUpdated = moment(date).fromNow()
    return (
      <Marker
        icon={icon()}
        key={properties.country}
        position={[...prop.geometry.coordinates].reverse()}
      >
        <Popup>
          <Box
            d='flex'
            flexDir='column'
            justifyContent='space-evenly'
            height='auto'
            width={200}
          >
            <Image
              mt='0'
              alignSelf='center'
              src={properties.countryInfo.flag}
              alt='country flag'
              height='auto'
              width='50%'
            />
            <Text mt='4%' fontSize='lg'>
              {properties.country}
            </Text>
            <Box d='flex' alignItems='center' flexDir='column'>
              <Text fontSize='md' marginY='0'>
                Total Cases : {properties.cases}
              </Text>
              <Badge
                variantColor='purple'
                variant='solid'
                fontSize='md'
                marginY='3'
              >
                +{properties.todayCases}
              </Badge>
              <Text fontSize='sm'> Active : {properties.active} </Text>
              <Text fontSize='sm'> Recovered : {properties.recovered} </Text>
              <Text fontSize='sm'> Deaths : {properties.deaths} </Text>
              <Text fontSize='sm'>
                Cases Per Million : {properties.casesPerOneMillion}
              </Text>
              <Text fontSize='sm'> Updated {lastUpdated} </Text>
            </Box>
          </Box>
        </Popup>
      </Marker>
    )
  }

  const map = (
    <>
      <div className='map'>
        <Map center={position} zoom={4} maxZoom={15} minZoom={3}>
          <TileLayer
            // url='https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png'
            // attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {Object.keys(data).length
            ? data.features.map((el) => marker(el))
            : console.log('data not fetched or markers not working')}
        </Map>
      </div>
    </>
  )
  return map
}
export default Maps
