const express = require("express");
const mongoose = require("mongoose");
const { errors, celebrate, Joi } = require("celebrate");
const { createUser } = require("./controllers/users");

const app = express();
const errorHandler = require("./middlewares/errorHandler");
const login = require("./controllers/login");
const auth = require("./middlewares/auth");
const Error404 = require("./errors/Error404");
const { requestLogger, errorLogger } = require("./middlewares/loggers");
const usersRoute = require("./routes/users");
const cardsRoute = require("./routes/cards");

const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(express.json());

app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(
      /^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/,
    ),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(35),
  }),
}), createUser);

app.use(auth);
app.use("/", auth, usersRoute);
app.use("/", auth, cardsRoute);

app.all("*", (req, res, next) => next(new Error404("Ресурс не найден!")));
app.use(errorLogger);
app.use(errors());

app.use(errorHandler);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port: ${PORT}`);
});
