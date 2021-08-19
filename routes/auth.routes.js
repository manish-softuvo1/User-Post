require("dotenv").config();
const controller = require("../controllers/auth.controller");
const verify = require("../middlewares/authUser");
const cloudinary = require("../config/cloudinary");
const upload = require("../config/multer");


module.exports = function(app){
    app.use(function(req, res, next){
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept",
        );
        next();
    });

    app.post(
        "/api/auth/signup",
        verify.checkDuplicateUserEmailOrPhone,
        upload.single("image"),
        controller.signup
    );

    app.post("/api/auth/signin", controller.signin);

    app.put(
        "/api/auth/update/:id",
        verify.Token,
        upload.single("image"),
        controller.updateUser,
         
     )

    app.delete(
        "/api/auth/delete/:id",
        verify.Token,
        controller.deleteUser

    )
    app.get(
        "/api/auth/getAllUser",
        //verify.Token,
        controller.getAllUser
    )
    // app.post(
    //     "/api/auth/uploadprofileimage",
    //     verify.Token,
    //     controller.uploadProfile
    // )
};