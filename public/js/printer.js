import { audio, notif, isSnoozed } from './sound.js'

export const locationDescriptions = {
  'NMSU Corbett Center, Lobby, 1st floor': 'Corbett, Regular Kiosk',
  'NMSU Corbett Center, Lobby, 1st floor (2of 2)': 'Corbett, Mini Kiosk',
  'NMSU Corbett Center, Petes Place- 2nd Floor 2 of 2': 'Petes, Left Kiosk',
  'NMSU Business Complex, 309': 'BC 309',
  'NMSU, Hardman and Jacobs': 'Aggie, Left Kiosk',
  'NMSU, Hardman and Jacobs (2)': 'Aggie, Right Kiosk',
  'NMSU, Corbett Center Student Union': 'Petes, Right Kiosk',
}

export const orderArray = ['00840', '03332']

export const kioskPositions = {
  KIOSK_PROD_00846: 'Zuhl, Left Kiosk',
  KIOSK_PROD_00912: 'Zuhl, Right Kiosk',
}

let alarms = {}

export async function fetchPrinters() {
  const response = await fetch(`/printers`)
  if (!response.ok) {
    console.log(`HTTP error! status: ${response.status}`)
  } else {
    const printers = await response.json()

    printers.sort((a, b) => {
      const orderA = orderArray.indexOf(a.name.replace('KIOSK_PROD_', ''))
      const orderB = orderArray.indexOf(b.name.replace('KIOSK_PROD_', ''))
      if (orderA !== -1 || orderB !== -1) {
        // If a printer is in the order array, sort by array order
        return orderA - orderB
      }
      // Otherwise, sort by location
      return a.location.locationDescription.localeCompare(
        b.location.locationDescription
      )
    })


    printers.forEach((printer) => {
      const { name, location, status } = printer

      const printerData = {
        name: name.replace('KIOSK_PROD_', ''),
        location:
          locationDescriptions[
            `${location.locationDescription}, ${location.buildingDescription}`
          ] || kioskPositions[name],
        status: status.printerStatus,
      }

      const alarmState = localStorage.getItem(printerData.name)
      alarms[printerData.name] =
        alarmState !== null ? alarmState === 'true' : true
      addPrinterToTable(printerData)
    })
  }
}

export function addPrinterToTable(printerData) {
  const table = document.getElementById('wepaTable')

  const row = table.insertRow(-1)
  const nameCell = row.insertCell(0)
  const locationCell = row.insertCell(1)
  const statusCell = row.insertCell(2)
  const alarmCell = row.insertCell(3)
  alarmCell.className = 'alarm-cell';

  nameCell.innerHTML = printerData.name
  locationCell.innerHTML = printerData.location
  statusCell.innerHTML = printerData.status

const toggleSwitch = document.createElement('div')
toggleSwitch.className = 'toggle'
toggleSwitch.id = 'switch'
toggleSwitch.innerHTML = `
    <div class='toggle-text-off'>OFF</div>
    <div class='glow-comp'></div>
    <div class='toggle-button'></div>
    <div class='toggle-text-on'>ON</div>
  `

if (alarms[printerData.name]) {
  toggleSwitch.classList.add('toggle-on')
}

toggleSwitch.addEventListener('click', (event) => {
  alarms[printerData.name] = !alarms[printerData.name]
  localStorage.setItem(printerData.name, alarms[printerData.name].toString())
  event.currentTarget.classList.toggle('toggle-on')
})

alarmCell.appendChild(toggleSwitch)
  setTimeout(() => {
    if (
      (printerData.status === 'YELLOW' || printerData.status === 'RED') &&
      !isSnoozed &&
      alarms[printerData.name] // Only play the alarm if it is active for this printer
    ) {
      notif.classList.remove('hide')
      const volume = parseFloat(document.querySelector('#volume-slider').value)
      audio.volume = volume
      audio.play().catch((error) => {
        console.log('audio play failed due to', error)
      })
    }
  }, 10000) // 10000 milliseconds = 10 seconds
}

export function refreshTable() {
  console.log('Refreshed Table:', new Date().toLocaleString())
  const table = document.getElementById('wepaTable')
  while (table.rows.length > 1) {
    table.deleteRow(1)
  }
  fetchPrinters()
}
