import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const clientId = process.env.WEPA_CLIENT_ID
const clientSecret = process.env.WEPA_CLIENT_SECRET

async function getAccessToken() {
  try {
    const response = await fetch('https://api.wepanow.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString('base64')}`,
      },
      body: `grant_type=client_credentials`,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to obtain access token: ${errorText}`)
    }

    const data = await response.json()
    console.log('Entire JSON Response:', data) // Log the entire JSON response
    return data.access_token
  } catch (error) {
    console.error('Error fetching access token: ', error)
    throw error 
  }
}


;(async () => {
  try {
    const accessToken = await getAccessToken()
    console.log('Access Token:', accessToken)
  } catch (error) {
    console.error('Error fetching access token:', error)
  }
})()
