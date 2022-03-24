const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, data) => {
      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        next()
      } else {
        let user = await UserModel.findById(data.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
     res.locals.user = null;
    next();
  }
};

exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data.id);
        next();
      }
    });
  } else {
    console.log("No token");
  }
};
