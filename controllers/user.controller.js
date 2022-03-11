const UserModel = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;

exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

exports.userInfo = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }
  UserModel.findById(req.params.id, (err, data) => {
    if (!err) res.send(data);
    else console.log("ID unknow : " + err);
  }).select("-password");
};

exports.updateUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }
  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((data) => {
        return res.send(data);
      })
      .catch((err) => {
        return res.status(500).send({ message: err });
      });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

exports.deleteUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }
  try {
    await UserModel.findByIdAndRemove({ _id: req.params.id }, (err, data) => {
      if (!err)
        return res
          .status(200)
          .json({ message: "Removed User : " + req.params.id });
      if (err) return res.status(500).json({ message: err });
    }).exec();
  } catch (err) {
    return new Error(err);
  }
};

exports.follow = async (req, res) => {
  if (
    !ObjectId.isValid(req.params.id) ||
    !ObjectId.isValid(req.body.idToFollow)
  ) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }
  try {
    //add to followers list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true },
      (err, data) => {
        UserModel.findByIdAndUpdate(
          req.body.idToFollow,
          { $addToSet: { followers: req.params.id } },
          { new: true, upsert: true },
          (err, data) => {
            if (err) return res.status(400).json(err);
          }
        );
        if (!err) res.status(201).json(data);
        else return res.status(400).json(err);
      }
    );
    if (!err) res.status(201).json(data);
    else return res.status(400).json(err);
  } catch (err) {
    return new Error(err);
  }
};

exports.unfollow = async (req, res) => {
  if (
    !ObjectId.isValid(req.params.id) ||
    !ObjectId.isValid(req.body.idToUnfollow)
  ) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }
  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true },
      (err, data) => {
        UserModel.findByIdAndUpdate(
          req.body.idToUnfollow,
          { $pull: { followers: req.params.id } },
          { new: true, upsert: true },
          (err, data) => {
            if (err) return res.status(400).json(err);
          }
        );
        if (!err) res.status(201).json(data);
        else return res.status(400).json(err);
      }
    );
  } catch (err) {
    return new Error(err);
  }
};
