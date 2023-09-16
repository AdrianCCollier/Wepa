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

document.getElementById('wepaTable').classList.add('minimized-table');

const arrowIcon = document.querySelector('#collapse-arrow i');

document.getElementById('collapse-arrow').addEventListener('click', function () {
    toggleTable();
  })

function toggleTable() {
  console.log('toggle button pressed')

  // Step 1: Fetch the table element
  const table = document.getElementById('wepaTable')

  // Fetch current default main state
  const siteLayout = document.querySelector('.main');

  const rightPanel = document.querySelector('.right-panel');

  // State 1: If minimized, maximize it
  if (table.classList.contains('minimized-table')) {
    // Step 3: Toggle the class
    table.classList.remove('minimized-table')
    table.classList.add('maximized-table')
    siteLayout.style.flexDirection = 'column';
    rightPanel.style.maxWidth = '300px';
    rightPanel.style.marginTop = '15px';

    arrowIcon.classList.remove('fa-arrow-right')
    arrowIcon.classList.add('fa-arrow-left')
  // State 2: If maximized, minimize it
  } else if (table.classList.contains('maximized-table')) {
    table.classList.remove('maximized-table')
    table.classList.add('minimized-table')
    siteLayout.style.flexDirection = 'row';

    arrowIcon.classList.remove('fa-arrow-left');
    arrowIcon.classList.add('fa-arrow-right');
  // State 3: If somehow neither, minimize it
  } else {
    table.classList.add('minimized-table')
  }
  // Console state output
  console.log('Updated class list:', table.classList)
}



// Helper function to truncate toner/drum/fuser/belt percentages being returned as floats
function roundPercentage(value) {
  return Math.round(parseFloat(value));
}

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
      const { name, location, status, consumablesRemaining } = printer

      const printerData = {
        name: name.replace('KIOSK_PROD_', ''),
        location:
          locationDescriptions[
            `${location.locationDescription}, ${location.buildingDescription}`
          ] || kioskPositions[name],
        status: status.printerStatus,

        // New data added to table, populates latest messages correctly
        statusMessage: status.kioskStatus,
        printerText: status.snmpAlertsText,

        tonerBlack: consumablesRemaining.toner.black,
        tonerCyan: consumablesRemaining.toner.cyan,
        tonerMagenta: consumablesRemaining.toner.magenta,
        tonerYellow: consumablesRemaining.toner.yellow,
        
        drumBlack: consumablesRemaining.drum.black,
        drumCyan: consumablesRemaining.drum.cyan,
        drumMagenta: consumablesRemaining.drum.magenta,
        drumYellow: consumablesRemaining.drum.yellow,

        belt: consumablesRemaining.belt,
        fuser: consumablesRemaining.fuser,
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
  alarmCell.className = 'alarm-cell'
  const statusMessageCell = row.insertCell(4)
  const printerTextCell = row.insertCell(5)

  const tonerCell = row.insertCell(6)
  const tonerTable = document.createElement('table')
  const tonerRow = tonerTable.insertRow(0)

  const tonerBlackCell = tonerRow.insertCell(0)
  const tonerCyanCell = tonerRow.insertCell(1)
  const tonerMagentaCell = tonerRow.insertCell(2)
  const tonerYellowCell = tonerRow.insertCell(3)

  tonerBlackCell.innerHTML = 'B ' + roundPercentage(printerData.tonerBlack)
  tonerCyanCell.innerHTML = 'C ' + roundPercentage(printerData.tonerCyan)
  tonerMagentaCell.innerHTML = 'M ' + roundPercentage(printerData.tonerMagenta)
  tonerYellowCell.innerHTML = 'Y ' + roundPercentage(printerData.tonerYellow)
  tonerCell.appendChild(tonerTable)

  const drumCell = row.insertCell(7)
  const drumTable = document.createElement('table')
  const drumRow = drumTable.insertRow(0)

  const drumBlackCell = drumRow.insertCell(0)
  const drumCyanCell = drumRow.insertCell(1)
  const drumMagentaCell = drumRow.insertCell(2)
  const drumYellowCell = drumRow.insertCell(3)

  let drumBlackPercentage = roundPercentage(printerData.drumBlack);
  let drumCyanPercentage = roundPercentage(printerData.drumCyan);
  let drumMagentaPercentage = roundPercentage(printerData.drumMagenta)
  let drumYellowPercentage = roundPercentage(printerData.drumYellow)
  
  drumBlackCell.innerHTML = 'B ' + drumBlackPercentage;
  drumCyanCell.innerHTML = 'C ' + drumCyanPercentage;
  drumMagentaCell.innerHTML = 'M ' + drumMagentaPercentage;
  drumYellowCell.innerHTML = 'Y ' + drumYellowPercentage;
  drumCell.appendChild(drumTable)

  const beltCell = row.insertCell(8)
  const fuserCell = row.insertCell(9)

  nameCell.innerHTML = printerData.name;
  locationCell.innerHTML = printerData.location;
  statusCell.innerHTML = printerData.status;


  // Format the status message
  const formattedStatusMessage = formatAlertMessage(printerData.statusMessage);
  statusMessageCell.innerHTML = formattedStatusMessage;


  printerTextCell.innerHTML = formatAlertMessage(printerData.printerText);


  let beltCellPercentage = roundPercentage(printerData.belt);
  let fuserCellPercentage = roundPercentage(printerData.fuser);
  beltCell.innerHTML = roundPercentage(printerData.belt)
  fuserCell.innerHTML = roundPercentage(printerData.fuser)





// Helper function to format the String data from the WEPA API
function formatAlertMessage(message) {

  const errormessagesMap = {
    '||ALERT_TRAY_MISSING||ALERT_PAPER_INCORRECT_TRAY_SIZE':
      'Incorrect Tray Size',
    '||ALERT_TRAY_MISSING||ALERT_PAPER_OUT_ERROR': 'Out Of Paper',
    '||ALERT_PRINTER_LOW_TONER_BLACK': 'Low Toner Black',
    '||ALERT_PRINTER_LOW_TONER_YELLOW': 'Low Toner Yellow',
    '||ALERT_PRINTER_LOW_TONER_MAGENTA': 'Low Toner Magenta',
    '||ALERT_PRINTER_LOW_TONER_CYAN': 'Low Toner Cyan',
    'Tray1 missingTray2 missing': 'Tray 1 or 2 Missing',
  }

  if(errormessagesMap[message]) {
    return errormessagesMap[message];
  }

  let formattedMessage = message.replace(
    '||ALERT_TRAY_MISSING||ALERT_PAPER_INCORRECT_TRAY_SIZE',
    'Incorrect Paper Tray'
  ) 

  // Split the message by underscores and capitalize the first letter of each word
  const words = formattedMessage
    .split('_')
    .map(
      (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
    )

  // Join the words back together into a single string
  return words.join(' ');
} // end formatAlertMessage

  // Ignore the code below this part, this toggleSwitch is referring to a different feature, which allows users to toggle alarms for each WEPA, not related to the toggling of the WEPA table states.
  const toggleSwitch = document.createElement('div');
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
    alarms[printerData.name] = !alarms[printerData.name];
    localStorage.setItem(printerData.name, alarms[printerData.name].toString());
    event.currentTarget.classList.toggle('toggle-on');
  })

  alarmCell.appendChild(toggleSwitch)
  setTimeout(() => {

    const anyBeltLow = beltCellPercentage < 3;
    const anyFuserLow = fuserCellPercentage < 3;

    console.log(anyBeltLow, anyFuserLow)
    if (
      (printerData.status === 'YELLOW' || printerData.status === 'RED' || anyBeltLow ||anyFuserLow) &&
      !isSnoozed &&
      alarms[printerData.name] // Only play the alarm if it is active for this printer
    ) {
      notif.classList.remove('hide')
      const volume = parseFloat(document.querySelector('#volume-slider').value)
      audio.volume = volume;

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
