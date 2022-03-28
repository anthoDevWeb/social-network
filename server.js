const express = require("express");
const path = require("path")
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");

const app = express();

const corsOption = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

const cors = require("cors");

//app.use(cors({ corsOption }));
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//jwt
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

//routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

app.use(express.static(path.join(__dirname, "/client")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/public/', 'index.html'));
});

// server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
