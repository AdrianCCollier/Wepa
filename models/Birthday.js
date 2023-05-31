import mongoose from "mongoose";

const birthdaySchema = new mongoose.Schema({
  name: String,
  birthMonth: Number,
  birthDay: Number,
})

const Birthday = mongoose.model('Birthday', birthdaySchema)

export default Birthday;
