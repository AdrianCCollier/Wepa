// const BACKEND_URL = 'https://wepa-backend-env.eba-stm5yeqv.us-east-2.elasticbeanstalk.com'

// const BACKEND_URL = 'https://labcrabs.com'

export async function fetchBirthdays() {
  console.log('ay im walking here');
  console.log('fetch birthdays function called')
  const response = await fetch('/birthdays')
  const birthdays = await response.json()

  //   http: birthdays.forEach(addBirthdayToList)
  birthdays.forEach(addBirthdayToList)
}

export function addBirthdayToList(birthday) {
  const list = document.getElementById('birthday-list')

  const listItem = document.createElement('li')

  const img = document.createElement('img')
  img.src = '/images/cake.png'
  img.alt = 'Birthday cake icon'

  const textNode = document.createTextNode(
    `${birthday.name} - ${birthday.birthMonth}/${birthday.birthDay}`
  )

  listItem.appendChild(img)
  listItem.appendChild(textNode)

  list.appendChild(listItem)
}
