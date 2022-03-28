const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB)
  .then(() => console.log("connected to MongoDb"))
  .catch((err) => console.log("failed to connect to MongoDb ", err));
