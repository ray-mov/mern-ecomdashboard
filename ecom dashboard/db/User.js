const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
    },
    email: String,
    password: String,
  },
  {
    versionKey: false,
  }
);

const user = (module.exports = mongoose.model("users", UserSchema));

module.exports = user;
