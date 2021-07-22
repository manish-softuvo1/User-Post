require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path"); 


const db = require("../models");
const User = db.user;
const cloudinary = require("../config/cloudinary");
const upload = require("../config/multer");




      exports.signup = async (req, res) => {
        try {
          // Upload image to cloudinary
          const result = await cloudinary.uploader.upload(req.file.path); 
           // Create new user
          let user = new User({
            username: req.body.username,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            zipCode: req.body.zipCode,
            country: req.body.country,
            avatar: result.secure_url,
            cloudinary_id: result.public_id,
            password: bcrypt.hashSync(req.body.password, 8)
          });
          // Save user
          await user.save();
          res.json(user);
        } catch (err) {
          console.log(err);
        }
      }

exports.signin = async (req, res) => {
    var email =  req.body.email,
        phone = req.body.phone
    var conditions = !!email ? {email: email}: {phone: phone};
    //console.log(req.body)
    User.findOne(conditions)
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        console.log("weruiop[",req.body.password,
          user.password)
  
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
  
        var token = jwt.sign({ id: user.id }, process.env.secret , {
          expiresIn: 86400 // 24 hours
        });
  
        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          accessToken: token
        });
      });
  };

  exports.updateUser = async (req, res, next) => {
    
    const { username, email, password, phone, address, zipCode, country, image } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        return res.status(400)
            .json({
                success: false,
                message: "please send userId"
            });
    }
    user.username = username || username === '' ? username : user.username;
    user.email = email || email === '' ? email : user.email;
    user.password = password || password === '' ? password : user.password;
    user.phone = phone || phone === '' ? phone : user.phone;
    user.address = address || address === '' ? address : user.address;
    user.zipCode = zipCode || zipCode === '' ? zipCode : user.zipCode
    user.country = country || country === '' ? country : user.country;
    user.image = image || image === '' ? image : user.image;

    await user.save()

    res.status(200).json({
        success: true,
        message: "success", 
        data: user
    })
}

exports.deleteUser = async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return res.status(200)
            .json({
                status: false,
                message: 'Please send the  user id!'
            });
    }
    let deleteUser = await User.findOneAndDelete({ _id: id })
    if (!deleteUser) {
        return res.status(200)
            .json({
                status: false,
                message: 'No data found',
            });
    }
    return res.status(200)
        .json({
            status: true,
            message: 'User delete successfully',
        });
}

exports.getAllUser = async(req, res, next) => {
        const username = req.query.username;
        var condition = username ? { username: { $regex: new RegExp(username), $options: "i" } } : {};
      
        User.find(condition)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving tutorials."
            });
          });
      };




      // exports.signup = async (req, res) => {
      //   try {
      //     // Upload image to cloudinary
      //     const result = await cloudinary.uploader.upload(req.file.path);
      //      // Create new user
      //     let user = new User({
      //       username: req.body.username,
      //       phone: req.body.phone,
      //       email: req.body.email,
      //       address: req.body.address,
      //       zipCode: req.body.zipCode,
      //       country: req.body.country,
      //       avatar: result.secure_url,
      //       cloudinary_id: result.public_id,
      //     });
      //     // Save user
      //     await user.save();
      //     res.json(user);
      //   } catch (err) {
      //     console.log(err);
      //   }
      // }