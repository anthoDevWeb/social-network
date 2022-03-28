const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_MONGO, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => console.log("connected to MongoDb"))
  .catch((err) => console.log("failed to connect to MongoDb ", err));
