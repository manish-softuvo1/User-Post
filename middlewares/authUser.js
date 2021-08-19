require("dotenv").config();
const db = require("../models");
const jwt = require("jsonwebtoken");
const User = db.user;

checkDuplicateUserEmailOrPhone = (req, res, next) => {
    // Email
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if(err){
            res.status(500).send({
                message: err
            });
            return
        }
        if(user){
            res.status(400).send({
                message: "Failed! email is in already Use "
            })
            return
        }
        // Phone
        User.findOne({
            phone: req.body.phone || ""
        }).exec((err, user) => {
            if(err){
                res.status(500).send({ 
                    message: err
                });
                return
            }
            if(user){
                res.status(400).send({
                    message: "Failed! phone is already in use"
                });
                return
            }
            next()
        });
    });
};

Token = (req, res, next) => {
    let token = req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
  
    jwt.verify(token, process.env.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      next();
    });
  };

const verify = { 
    checkDuplicateUserEmailOrPhone,
    Token
}

module.exports = verify;