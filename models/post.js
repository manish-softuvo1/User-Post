const mongoose = require("mongoose");

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
   title: {
        type: String,
        required: true
   },
   postImage: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
   description: String,
   userId: {
       type: mongoose.Schema.ObjectId,
      //  required: true,
       ref: "User"
   },
   create_date: {
    type: Date,
    default: Date.now
  }
    }
  )
);

module.exports = Post;