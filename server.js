import express from 'express'
import fetch from 'node-fetch'
import path from 'path'
import connectToDatabase from './database/database.js'
import { fileURLToPath } from 'url'

import cors from 'cors'
import Birthday from './models/Birthday.js'
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 3000
const clientId = process.env.WEPA_CLIENT_ID
const clientSecret = process.env.WEPA_CLIENT_SECRET
let bearerToken;

(async () => {
  try {
    bearerToken = await getAccessToken();
  } catch(error) {
    console.error('Error fetching initial access token', error)
  }
})();
const app = express()

// app.use(function (req, res, next) {
//   if (req.headers['x-forwarded-proto'] != 'https') {
//     res.redirect(301, 'https://' + req.headers.host + req.url)
//   } else {
//     next()
//   }
// })

connectToDatabase()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.set('views', 'public')

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

async function getAccessToken() {
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
    throw new Error(
      `Failed to obtain access token. HTTP status: ${response.status}`
    )
  }

  const data = await response.json()
  return data.access_token
}

async function fetchPrinters() {
  if(!bearerToken) {
    bearerToken = await getAccessToken();
  }
  const response = await fetch(
    'https://api.wepanow.com/resources/groups/146/kiosks',
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  )

  if (response.status === 401) {
    // Token is invalid, try to refresh it
    bearerToken = await getAccessToken()
    // Retry the request with the new token
    return fetchPrinters()
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch printers. HTTP status: ${response.status}`)
  }

  return response.json()
}

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/printers', async (req, res) => {
  try {
    const printers = await fetchPrinters()
    res.json(printers)
  } catch(error) {
    res.status(500).send(`Failed to fetch printers ${error}`)
  }
})

app.get('/birthdays', async (req, res) => {
  try {
    const birthdays = await Birthday.find({})
    const today = new Date()
    const thisMonth = today.getMonth() + 1 // getMonth() returns 0-11
    const thisDay = today.getDate()

    birthdays.forEach((birthday) => {
      if (
        birthday.birthMonth > thisMonth ||
        (birthday.birthMonth === thisMonth && birthday.birthDay >= thisDay)
      ) {
        // Birthday is later this year
        birthday.distance =
          (birthday.birthMonth - thisMonth) * 30 + (birthday.birthDay - thisDay)
      } else {
        // Birthday is next year
        birthday.distance =
          (12 - thisMonth + birthday.birthMonth) * 30 +
          (birthday.birthDay - thisDay)
      }
    })

    birthdays.sort((a, b) => a.distance - b.distance)

    res.json(birthdays.slice(0, 5))
  } catch (error) {
    res.status(500).send('Error fetching birthdays')
  }
})

app.listen(port, () => {
  console.log(`Server listening on port:${port}`)
})
