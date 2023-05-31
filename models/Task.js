import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    task: String,
    role: String,
})



const Task = mongoose.model('Task', taskSchema)


export default Task;
