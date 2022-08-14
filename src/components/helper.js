import axios from 'axios'

async function mapEffect() {
  let response

  try {
    response = await axios.get('https://corona-api.com/countries')
    return response.data
  } catch (e) {
    console.log(`Failed to fetch countries: ${e.message}`, e)
    return
  }
}

export const geoData = async () => {
  const data = await mapEffect().then((data) => {
    return data.data
  })

  const hasData = Array.isArray(data) && data.length > 0

  if (!hasData) return
  const countriesObj = {}

  data.forEach((country) => {
    const { latest_data = {}, today = {}, updated_at } = country
    const { confirmed: todayConfirmed } = today

    const { confirmed, critical, deaths, recovered, calculated } = latest_data
    const { cases_per_million_population } = calculated
    countriesObj[country.name] = {
      ...country,
      cases: confirmed || 0,
      todayCases: todayConfirmed || 0,
      active: critical || 0,
      recovered: recovered || 0,
      deaths: deaths || 0,
      casesPerOneMillion: cases_per_million_population || 0,
      updated: updated_at,
    }
  })
  const geoJson = {
    type: 'FeatureCollection',
    features: data.map((country) => {
      const {
        coordinates = {},
        latest_data = {},
        today = {},
        updated_at,
      } = country
      const { confirmed: todayConfirmed } = today
      const { latitude, longitude } = coordinates
      const { confirmed, critical, deaths, recovered, calculated } = latest_data
      const { cases_per_million_population } = calculated
      return {
        type: 'Feature',
        properties: {
          ...country,
          cases: confirmed || 0,
          todayCases: todayConfirmed || 0,
          active: critical || 0,
          recovered: recovered || 0,
          deaths: deaths || 0,
          casesPerOneMillion: cases_per_million_population || 0,
          updated: updated_at,
        },
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      }
    }),
  }

  return { geoJson, countriesObj }
}
