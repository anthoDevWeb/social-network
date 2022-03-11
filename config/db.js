const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_PASS +
      "@cluster0.gasof.mongodb.net/mern-project"
  )
  .then(() => console.log("connected to MongoDb"))
  .catch((err) => console.log("failed to connect to MongoDb ", err));
