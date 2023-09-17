export const notif = document.getElementById('notification')
export const close_notif = document.getElementById('closenotif')
export const enableSoundPopup = document.getElementById('enable-sound-popup')

// Use the same event listener for the 'No' button and the close button
const closeButtons = document.querySelectorAll('#enable-sound-no, .close-btn')

export let snoozeTimeout = null
export let isSnoozed = false
export let selectedSound = 'sounds/notification.mp3'
export let audio = new Audio(selectedSound);
export let soundEnabled = false;



document.getElementById('sound-select').addEventListener('change', (event) => {
  selectedSound = event.target.value
  audio = new Audio(selectedSound);
  localStorage.setItem('selectedSound', selectedSound);
})

document.getElementById('sound-test').addEventListener('click', () => {
  audio.play()
})

document.getElementById('volume-slider').addEventListener('input', (event) => {
  audio.volume = parseFloat(event.target.value)
})

close_notif.onclick = function () {
  notif.classList.add('hide')
}

document.querySelector('#closenotif').addEventListener('click', () => {
  if (snoozeTimeout) clearTimeout(snoozeTimeout)
  audio.pause()

  // Set timeout to resume play in 10 minutes
  snoozeTimeout = setTimeout(() => {
    audio.play()
    notif.classList.remove('hide')
  }, 600000)

  isSnoozed = true
})

export function showEnableSoundPopup() {
  enableSoundPopup.style.display = 'block'

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      soundEnabled = false
      enableSoundPopup.style.display = 'none'
    })
  })

  document.getElementById('enable-sound-yes').addEventListener('click', () => {
    soundEnabled = true
    enableSoundPopup.style.display = 'none'
  })
}

// Call showEnableSoundPopup initially on page load
showEnableSoundPopup()

const savedSound = localStorage.getItem('selectedSound')
if(savedSound) {
  selectedSound = savedSound;
  audio = new Audio(selectedSound);
  document.getElementById('sound-select').value = selectedSound
}
