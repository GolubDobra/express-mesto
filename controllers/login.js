const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { NODE_ENV, JWT_SECRET } = process.env;
const Error401 = require("../errors/Error401");
const Error500 = require("../errors/Error500");

const checkLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select("+password")
    .orFail(() => {
      const error = new Error401(`Пользователь ${email} не существует!`);
      throw error;
    })
    .then((user) => {
      // Надо проверить пароль
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const error = new Error401("Введён неверный пароль!");
            throw error;
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === "production" ? JWT_SECRET : "strongest-key-ever", { expiresIn: "7d" });
          res.send({ token });
        })
        .catch((err) => {
          if (err.statusCode === 401) {
            next(new Error401("Пользователь не авторизован!"));
          } else {
            next(new Error500("Ошибка на сервере!"));
          }
        });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        next(new Error401("Пользователь не авторизован!"));
      } else {
        next(new Error500("Ошибка на сервере!"));
      }
    });
};

module.exports = checkLogin;
