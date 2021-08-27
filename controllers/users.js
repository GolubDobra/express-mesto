const User = require("../models/user");

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: `Некорректные данные при создании пользователя: ${err}!` });
      }
      return res.status(500).send({ message: "Ошибка на сервере!" });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error("NotValidId"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Ошибка в запросе!" });
      }
      if (err.message === "NotFound") {
        return res.status(404).send({ message: "Запрашиваемый пользователь не найден!" });
      }
      return res.status(500).send({ message: "Ошибка на сервере!" });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: `Некорректные данные при создании пользователя: ${err}!` });
        return;
      }
      res.status(500).send({ message: "Ошибка на сервере!" });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userID = req.user._id;
  User.findByIdAndUpdate(
    userID,
    { avatar },
    {
      runValidators: true,
      new: true,
    },
  )
    .orFail(new Error("NotValidId"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: `Некорректные данные при обновлении профиля: ${err}!` });
        return;
      }
      if (err.message === "NotFound") {
        res.status(404).send({ message: "Запрашиваемый пользователь не найден!" });
        return;
      }
      res.status(500).send({ message: "Ошибка на сервере!" });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const userID = req.user._id;
  User.findByIdAndUpdate(
    userID,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error("NotValidId"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: `Некорректные данные при обновлении профиля: ${err}!` });
        return;
      }
      if (err.message === "NotFound") {
        res.status(404).send({ message: "Запрашиваемый пользователь не найден!" });
        return;
      }
      res.status(500).send({ message: "Ошибка на сервере!" });
    });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
};
