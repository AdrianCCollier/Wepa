import mongoose from 'mongoose'
import Birthday from './models/Birthday.js'
import connectToDatabase from './database/database.js'

connectToDatabase();

(async () => {
  let marysBirthday = new Birthday({
    name: 'Mary',
    birthMonth: 6,
    birthDay: 1,
  });

  let miguelsBirthday = new Birthday({
    name: 'Miguel',
    birthMonth: 5,
    birthDay: 15,
  });

  let jacobsBirthday = new Birthday({
    name: 'Jacob',
    birthMonth: 8,
    birthDay: 20,
  });

  let luisBirthday = new Birthday({
    name: 'Luis',
    birthMonth: 3,
    birthDay: 9,
  });

  let aidanBirthday = new Birthday({
    name: 'Aidan',
    birthMonth: 7,
    birthDay: 19,
  });

  let ulissesBirthday = new Birthday({
    name: 'Ulisses',
    birthMonth: 1,
    birthDay: 30,
  });

  let jamesBirthday = new Birthday({
    name: 'James',
    birthMonth: 10,
    birthDay: 7,
  });


  let matthewBirthday = new Birthday({
    name: 'Matthew',
    birthMonth: 6,
    birthDay: 4,
  });

  let frankieBirthday = new Birthday({
    name: 'Frankie',
    birthMonth: 6,
    birthDay: 3,
  });

  let chrisBirthday = new Birthday({
    name: 'Chris',
    birthMonth: 9,
    birthDay: 18,
  });

  let micaelaBirthday = new Birthday({
    name: 'Micaela',
    birthMonth: 1,
    birthDay: 1,
  });

  let christianBirthday = new Birthday({
    name: 'Christian',
    birthMonth: 1,
    birthDay: 11,
  });

  let miaBirthday = new Birthday({
    name: 'Mia',
    birthMonth: 6,
    birthDay: 3,
  });

  let felixBirthday = new Birthday({
    name: 'Felix',
    birthMonth: 4,
    birthDay: 15,
  });

  let ivanBirthday = new Birthday({
    name: 'Ivan',
    birthMonth: 3,
    birthDay: 19,
  });
  
  let rafaelBirthday = new Birthday({
    name: 'Rafael',
    birthMonth: 3,
    birthDay: 24,
  });

  let keaneBirthday = new Birthday({
    name: 'Keane',
    birthMonth: 1,
    birthDay: 8,
  });

  let jonathanBirthday = new Birthday({
    name: 'Jonathan',
    birthMonth: 1,
    birthDay: 14,
  });

  let adrianBirthday = new Birthday({
    name: 'Adrian',
    birthMonth: 5,
    birthDay: 16,
  });

  let jayceBirthday = new Birthday({
    name: 'Jayce',
    birthMonth: 7,
    birthDay: 31,
  });

  let catherineBirthday = new Birthday({
    name: 'Catherine',
    birthMonth: 10,
    birthDay: 16,
  });

  let casseyBirthday = new Birthday({
    name: 'Cassey',
    birthMonth: 1,
    birthDay: 10,
  });

  let jefferyBirthday = new Birthday({
    name: 'Jeffery',
    birthMonth: 5,
    birthDay: 28,
  });

  let aryannaBirthday = new Birthday({
    name: 'Aryanna',
    birthMonth: 7,
    birthDay: 22,
  });

  let emmaBirthday = new Birthday({
    name: 'Emma',
    birthMonth: 4,
    birthDay: 11,
  });

  const birthdays = [
    marysBirthday,
    miguelsBirthday,
    jacobsBirthday,
    luisBirthday,
    aidanBirthday,
    ulissesBirthday,
    jamesBirthday,
    matthewBirthday,
    frankieBirthday,
    chrisBirthday,
    micaelaBirthday,
    christianBirthday,
    miaBirthday,
    felixBirthday,
    ivanBirthday,
    rafaelBirthday,
    keaneBirthday,
    jonathanBirthday,
    adrianBirthday,
    jayceBirthday,
    catherineBirthday,
    casseyBirthday,
    jefferyBirthday,
    aryannaBirthday,
    emmaBirthday,
  ];

  await Birthday.deleteMany({});

    for(const birthday of birthdays) {
      await birthday.save();
    }

    const allBirthdays = await Birthday.find({});

  console.log('All Birthdays:');
  allBirthdays.forEach((birthday) => {
    console.log(`${birthday.name} - ${birthday.birthMonth}/${birthday.birthDay}`);
  });
    mongoose.connection.close()
})();
