import axios from 'axios'

async function mapEffect() {
  let response

  try {
    response = await axios.get('https://disease.sh/v3/covid-19/countries')
    return response.data
  } catch (e) {
    console.log(`Failed to fetch countries: ${e.message}`, e)
    return
  }
}

export const geoData = async () => {
  const data = await mapEffect().then((data) => {
    return data ? data : null
  })

  const hasData = Array.isArray(data) && data.length > 0

  if (!hasData) return
  const countriesObj = {}

  data.forEach((country) => {
    const {
      updated,
      cases,
      todayCases,
      deaths,
      recovered,
      critical,
      casesPerOneMillion,
    } = country

    countriesObj[country.country] = {
      ...country,
      cases: cases || 0,
      todayCases: todayCases || 0,
      active: critical || 0,
      recovered: recovered || 0,
      deaths: deaths || 0,
      casesPerOneMillion: casesPerOneMillion || 0,
      updated: updated,
    }
  })
  const geoJson = {
    type: 'FeatureCollection',
    features: data.map((country) => {
      const {
        updated,
        countryInfo,
        cases,
        todayCases,
        deaths,
        recovered,
        critical,
        casesPerOneMillion,
      } = country
      const { lat: latitude, long: longitude } = countryInfo

      return {
        type: 'Feature',
        properties: {
          ...country,
          cases: cases || 0,
          todayCases: todayCases || 0,
          active: critical || 0,
          recovered: recovered || 0,
          deaths: deaths || 0,
          casesPerOneMillion: casesPerOneMillion || 0,
          updated: updated,
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
