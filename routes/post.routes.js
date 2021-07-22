const controller = require("../controllers/post.controller");
const verify = require("../middlewares/authUser");
const cloudinary = require("../config/cloudinary");
const upload = require("../config/multer");

//const uploadFile = require("../middlewares/upload");

module.exports = function(app){
    app.use(function(req, res, next){
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/post/createpost",
        verify.Token,
        upload.single("image"),
        controller.create
    )

    app.get(
        "/api/post/getallpost",
        verify.Token,
        controller.getAllPost
    )
    
    app.put(
        "/api/post/update/:id",
        verify.Token,
        upload.single("image"),
        controller.updatePost
    )

    app.delete(
        "/api/post/delete/:id",
        verify.Token,
        controller.deletePost

    )
   
};