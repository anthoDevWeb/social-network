const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const { uploadErrors } = require("../utils/errors.utils");
const ObjectId = require("mongoose").Types.ObjectId;
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

exports.readPost = (req, res) => {
  PostModel.find((err, data) => {
    if (!err) res.send(data);
    else console.log("Error to get data : " + err);
  }).sort({ createdAt: -1 });
};

exports.createPost = async (req, res) => {
  let fileName;

  if (req.file !== null) {
    try {
      if (
        req.file.detectedMimeType !== "image/jpg" &&
        req.file.detectedMimeType !== "image/png" &&
        req.file.detectedMimeType !== "image/jpeg"
      )
        throw Error("invalid file");
      if (req.file.size > 2500000) throw Error("max size");
    } catch (e) {
      const errors = uploadErrors(e);
      return res.status(500).json({ errors });
    }

    fileName = req.body.posterId + Date.now() + ".jpg";
    await pipeline(
      req.file.stream,
      fs.createWriteStream(
        `${__dirname}/../client/public/uploads/posts/${fileName}`
      )
    );
  }
  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: req.file !== null ? "./uploads/posts/" + fileName : "",
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (error) {
    return res.status(400).send(err);
  }
};

exports.updatePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id);

  const updatedRecord = {
    message: req.body.message,
  };

  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, data) => {
      if (!err) return res.send(data);
      else console.log("Update error : " + err);
    }
  );
};

exports.deletePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id);
  PostModel.findByIdAndRemove(req.params.id, (err, data) => {
    if (!err) return res.send(data);
    else console.log("Delete error : " + err);
  });
};

exports.likePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unkonw : " + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true },
      (err, data) => {
        if (err) return res.status(400).send(err);
      },
      UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $addToSet: { likes: req.params.id },
        },
        { new: true },
        (err, data) => {
          if (!err) return res.send(data);
          else return res.status(400).send(err);
        }
      )
    );
  } catch (err) {
    return new Error(err);
  }
};

exports.unlikePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true },
      (err, data) => {
        if (err) return res.status(400).send(err);
      },
      UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $pull: { likes: req.params.id },
        },
        { new: true },
        (err, data) => {
          if (!err) return res.send(data);
          else return res.status(400).send(err);
        }
      )
    );
  } catch (err) {
    return new Error(err);
  }
};

exports.commentPost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id);
  try {
    return await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, data) => {
        if (!err) return res.send(data);
        else throw err;
      }
    );
  } catch (err) {
    return new Error(err);
  }
};

exports.editCommentPost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id);

  try {
    return PostModel.findById(req.params.id, (err, data) => {
      const theComment = data.comments.find((comment) => {
        return comment._id == req.body.commentId;
      });
      if (!theComment) return res.status(404).send("Comment not found");
      theComment.text = req.body.text;

      return data.save((err) => {
        if (!err) return res.status(200).send(data);
        return res.status(500).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.deleteCommentPost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true }
    )
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(400).send(err);
  }
};
