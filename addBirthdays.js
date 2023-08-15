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

  let micaelaBirthday = new Birthday({
    name: 'Micaela',
    birthMonth: 1,
    birthDay: 1,
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

  let adrianCBirthday = new Birthday({
    name: 'Adrian C',
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

  let nathanBirthday = new Birthday({ 
    name: 'Nathan',
    birthMonth: 8,
    birthDay: 15,
  });

  let ethanBirthday = new Birthday({
    name: 'Ethan',
    birthMonth: 7,
    birthDay: 16,
  });

  let adrianHBirthday = new Birthday({
    name: 'Adrian H',
    birthMonth: 8,
    birthDay: 1,
  });

  let jacquelineBirthday = new Birthday({
    name: 'Jacqueline',
    birthMonth: 12,
    birthDay: 26,
  });

  let toriBirthday = new Birthday({
    name: 'Tori',
    birthMonth: 5,
    birthDay: 21,
  });
  const birthdays = [
    marysBirthday,
    luisBirthday,
    aidanBirthday,
    ulissesBirthday,
    jamesBirthday,
    micaelaBirthday,
    felixBirthday,
    ivanBirthday,
    rafaelBirthday,
    keaneBirthday,
    adrianCBirthday,
    jayceBirthday,
    catherineBirthday,
    jefferyBirthday,
    aryannaBirthday,
    emmaBirthday,

    nathanBirthday,
    adrianHBirthday,
    ethanBirthday,
    jacquelineBirthday,
    toriBirthday,
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
