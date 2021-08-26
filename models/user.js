const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(item) {
        return item >= 1;
      },
      message: "Вы не заполнили это поле",
    },
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(item) {
        return item >= 1;
      },
      message: "Вы не заполнили это поле",
    },
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(item) {
        return item >= 1;
      },
      message: "Вы не заполнили это поле",
    },
  },
});
module.exports = mongoose.model("user", userSchema);
