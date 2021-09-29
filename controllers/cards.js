const Card = require("../models/card");

const ErrorCodes = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  DEFAULT: 500,
};

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(ErrorCodes.DEFAULT).send({ message: "Ошибка на сервере!" });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: `Некорректные данные при создании карточки: ${err}!` });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "Ошибка на сервере!" });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error("CastError"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: "Некорректный запрос" });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "Ошибка на сервере!" });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(new Error("NotValidId"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: "Некорректные данные для постановки лайка!" });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "Ошибка на сервере!" });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error("NotValidId"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ErrorCodes.BAD_REQUEST).send({ message: "Некорректные данные для постановки лайка!" });
        return;
      }
      if (err.message === "NotFound") {
        res.status(ErrorCodes.NOT_FOUND).send({ message: "Запрашиваемый пользователь не найден!" });
        return;
      }
      res.status(ErrorCodes.DEFAULT).send({ message: "Ошибка на сервере!" });
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
