import axios from 'axios'

async function mapEffect() {
  let response

  try {
    response = await axios.get('https://corona.lmao.ninja/v2/countries')
    return response.data
  } catch (e) {
    console.log(`Failed to fetch countries: ${e.message}`, e)
    return
  }
}

export const geoData = async () => {
  const data = await mapEffect().then((data) => {
    return data
  })
  const hasData = Array.isArray(data) && data.length > 0

  if (!hasData) return

  const geoJson = {
    type: 'FeatureCollection',
    features: data.map((country) => {
      const { countryInfo = {} } = country
      const { lat, long: lng } = countryInfo
      return {
        type: 'Feature',
        properties: {
          ...country,
        },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      }
    }),
  }

  return geoJson
}
