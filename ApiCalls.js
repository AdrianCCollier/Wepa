import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const bearerToken = process.env.WEPA_ACCESS_TOKEN
console.log(bearerToken);

async function testApiCall() {
  const response = await fetch(
    'https://api.wepanow.com/resources/groups/146/kiosks',
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  )

  if (!response.ok) {
    console.log(`HTTP error! status: ${response.status}`)
  } else {
    response
      .json()
      .then((json) => {
        json.forEach((printer) => {
          const {
            name,
            location,
            status,
            consumablesRemaining,
            printer: printerDetails,
          } = printer

          const printerData = {
            name: name,
            location: `${location.locationDescription}, ${location.buildingDescription}`,
            status: `${status.printerStatus}, ${status.printerAvailable}`,
            consumablesRemaining: consumablesRemaining,
            totalPageCount: printerDetails.totalPageCount,
          }

          console.log(printerData)
        })
      })
      .catch((error) => console.error(error))
  }
}

testApiCall()
