import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import moment from 'moment'
import { geoData } from './helper'
import { useToast, Box, Button } from '@chakra-ui/core'
const icon = (url) =>
  new L.icon({
    iconUrl: 'https://img.icons8.com/color/96/000000/marker.png',
    iconSize: [25, 25],
  })
const Maps = () => {
  const [data, updateData] = useState(null)
  const valueRef = useRef(null)

  // const [pop, activePop] = useState(null);
  const asyncfun = async () => {
    return await geoData().then((data) => data)
  }
  const position = [51.505, -0.09]
  const dataMap = () => {
    asyncfun().then((data) => {
      console.log(data)
      updateData(data)
    })
  }
  useEffect(() => {
    dataMap()
  }, [])

  const marker = (prop) => {
    const properties = prop.properties
    const date = new Date(properties.updated)
    let wow = moment(date).fromNow()
    return (
      <Marker
        icon={icon()}
        key={properties.country}
        position={[...prop.geometry.coordinates].reverse()}
      >
        <Popup>
          <div className='markerCustom'>
            <img
              src={properties.countryInfo.flag}
              alt='country flag'
              style={{ height: 'auto', width: '50%' }}
            />
          </div>
          <br />
          <div className='countryPopUp'>
            <li> Total Cases : {properties.cases} </li>
            <div className='todayAdded'> +{properties.todayCases} </div>
            <li> Active : {properties.active} </li>
            <li> Recovered : {properties.recovered} </li>
            <li> Updated {wow} </li>
          </div>
        </Popup>
      </Marker>
    )
  }
  const toast = useToast()
  function ToastExample() {
    const toast = useToast()
    return (
      <div
        onLoad={() =>
          toast({
            title: 'Account created.',
            description: "We've created your account for you.",
            status: 'success',
            duration: null,
            isClosable: true,
          })
        }
      >
        {}
      </div>
    )
  }

  const map = (
    <>
      <div className='map'>
        <Map center={position} zoom={5}>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {data
            ? data.features.map((el) => marker(el))
            : console.log('data not fetched or markers not working')}
        </Map>
      </div>
    </>
  )
  return map
}
export default Maps
