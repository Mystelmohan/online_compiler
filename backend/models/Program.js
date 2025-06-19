// models/Program.js
const mongoose = require('mongoose');
const programSchema = new mongoose.Schema({
  id: Number,
  program_name: String,
  input1: String,
  output1: String,
  input2: String,
  output2: String,
  input3: String,
  output3: String,
});
module.exports = mongoose.model('Program', programSchema);
