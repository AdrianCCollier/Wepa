import { fetchPrinters, refreshTable } from './printer.js'
import { fetchBirthdays } from './birthday.js'

// call on page load
refreshTable()

// call on interval
setInterval(refreshTable, 60000)

// Display upcoming birthdays
fetchBirthdays()
