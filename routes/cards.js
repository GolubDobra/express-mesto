const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require("../controllers/cards");

router.get("/cards", getAllCards);
router.post("/cards", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string()
      .required()
      .pattern(
        /^(https?:\/\/)?([a-zA-z0-9%$&=?/.-]+)\.([a-zA-z0-9%$&=?/.-]+)([a-zA-z0-9%$&=?/.-]+)?(#)?$/,
      ),
  }),
}), createCard);
router.delete("/cards/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteCard);
router.put("/cards/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), likeCard);
router.delete("/cards/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), dislikeCard);

module.exports = router;
