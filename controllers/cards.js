const Card = require("../models/card");

const Error400 = require("../errors/Error400");
const Error404 = require("../errors/Error404");
const Error403 = require("../errors/Error403");
const Error500 = require("../errors/Error500");

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      next(new Error500("Ошибка на сервере!"));
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new Error400(`Некорректные данные при создании карточки: ${err}!`));
      }
      next(new Error500("Ошибка на сервере!"));
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error404("Карточка с указанным идентификатором не найдена!");
    })
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        next(new Error403("Нельзя удалить чужую карточку"));
      } else {
        card.remove();
        res.status(200).send({ message: `Карточка с id ${card.id} успешно удалена!` });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new Error400("Некорректный запрос"));
      }
      if (err.statusCode === 404) {
        next(new Error404("Карточка с указанным идентификаторо не найдена!"));
      }
      next(new Error500("Ошибка на сервере!"));
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(() => {
      throw new Error404("Карточка с указанным идентификатором не найдена!");
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new Error400("Некорректные данные для постановки лайка!"));
      }
      if (err.statusCode === 404) {
        next(new Error404("Карточка с указанным идентификатором не найдена!"));
      }
      next(new Error500("Ошибка на сервере!"));
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error404("Карточка с указанным идентификатором не найдена!");
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new Error400("Некорректные данные!"));
      }
      if (err.statusCode === 404) {
        next(new Error404("Карточка с указанным идентификаторо не найдена!"));
      }
      next(new Error500("Ошибка на сервере!"));
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
