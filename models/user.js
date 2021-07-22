const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    phone: String,
    email: String,
    password: String,
    address: String,
    zipCode: String,
    country: String,
    avatar: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
    create_date: {
        type: Date,
        default: Date.now
      }
    
  })
);

module.exports = User;