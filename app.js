const express = require("express");
const mongoose = require("mongoose");

const app = express();
const usersRoute = require("./routes/users");
const cardsRoute = require("./routes/cards");

const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "612b9b942e46c45be2c96c79",
  };

  next();
});

app.use("/", usersRoute);
app.use("/", cardsRoute);
app.use("*", (req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден!" });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port: ${PORT}`);
});
