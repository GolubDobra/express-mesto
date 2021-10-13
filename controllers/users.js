const User = require("../models/user");

const ErrorCodes = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  DEFAULT: 500,
};

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ErrorCodes.DEFAULT).send({ message: "Ошибка на сервере!" }));
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error("NotFound"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ErrorCodes.BAD_REQUEST).send({ message: "Ошибка в запросе!" });
      }
      if (err.message === "NotFound") {
        return res.status(ErrorCodes.NOT_FOUND).send({ message: "Запрашиваемый по данному идентификатору пользователь не найден!" });
      }
      return res.status(ErrorCodes.DEFAULT).send({ message: "Ошибка на сервере!" });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: `Некорректные данные при создании пользователя: ${err}!` });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "Ошибка на сервере!" });
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
    .orFail(new Error("Error"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: `Некорректные данные при обновлении аватара: ${err}!` });
        return;
      }
      if (err.message === "Error") {
        res.status(ErrorCodes.NOT_FOUND).send({ message: "Запрашиваемый по данному идентификатору пользователь не найден!" });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "Ошибка на сервере!" });
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
    .orFail(new Error("Error"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: `Некорректные данные при обновлении профиля: ${err}!` });
        return;
      }
      if (err.message === "Error") {
        res.status(ErrorCodes.NOT_FOUND).send({ message: "Запрашиваемый по данному идентификатору пользователь не найден!" });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "Ошибка на сервере!" });
    });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
};
