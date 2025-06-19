const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  completedPrograms: {
    type: [Number], // or [String] depending on how `program.id` is defined
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);
