import mongoose from 'mongoose';
import Task from './models/Task.js'
import connectToDatabase from './database/database.js'

connectToDatabase();

(async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

let task1 = new Task({ task: 'Train new hire', taskMonth: currentMonth, taskDay: currentDay, recurring: true });

let task2 = new Task({task: 'Check Zuhl WEPAs' , taskMonth: currentMonth, taskDay: currentDay, recurring: true})

let task3 = new Task({task: 'Update hourly student count', taskMonth: currentMonth, taskDay: currentDay, recurring: true,})

let task4 = new Task({
  task: 'Take cart and do a route',
  taskMonth: currentMonth,
  taskDay: currentDay,
  recurring: true,
})

let task5 = new Task({
  task: 'Clean WEPA card readers',
  taskMonth: currentMonth,
  taskDay: currentDay,
  recurring: true,
})

let task6 = new Task({
  task: 'Vacuum upstairs lounge',
  taskMonth: currentMonth,
  taskDay: currentDay,
  recurring: true,
})

let task7 = new Task({
  task: 'Refill scantrons if needed',
  taskMonth: currentMonth,
  taskDay: currentDay,
  recurring: true,
})


const tasks = [task1, task2, task3, task4, task5, task6, task7];

await Task.deleteMany({})

for(const task of tasks) {
    await task.save();
}

// Fetch all from database
const allTasks = await Task.find({})

console.log('All Tasks:');
allTasks.forEach((task) => {
    console.log(`${task.task} - ${task.taskMonth}/${task.taskDay}`);
});

mongoose.connection.close()

})();
