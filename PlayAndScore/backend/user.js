const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  played: {
    type: [String],
    default: [],
  },
  playing: {
    type: [String],
    default: [],
  },
  wanttoplay: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
