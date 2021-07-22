require("dotenv").config();

const db = require("../models");
const path = require("path"); 
const Post = db.post;
const cloudinary = require("../config/cloudinary");
const upload = require("../config/multer");


exports.create = async(req, res, next) => {
    try {
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
         // Create new user
        let post = new Post({
          title: req.body.title,
          userId: req.body.userId,
          description: req.body.description,
          postImage: result.secure_url,
          cloudinary_id: result.public_id,
        });
        // Save post
        await post.save();
        res.json(post);
      } catch (err) {
        console.log(err);
      }
    }

// exports.getAllPost = async(req, res, next) => {
//     const { page, limit, query } = req.query;
//     let postsData = [], userCount = 0, keyword = '';
//     if (!page || !limit) {
//         return res.status(400)
//             .json({
//                 status: false,
//                 message: 'Invalid request'
//             });
//     }

//     try {
//         if (query) keyword = query
//         const result = await Post.aggregate([
//             {
//                 $project: {
//                     title: 1,
//                     description: 1,
//                     userId: 1
//                 }
//             },
//             { $match: { title: { $regex: keyword, $options: 'i' } } },
//             {
//                 $facet: {
//                     docs: [
//                         { $sort: { createdAt: -1 } },
    

//                     ],
//                     count: [{ $count: "count" }]
//                 }
//             }
//         ]);

//         if (result && result[0] && result[0].docs && result[0].docs[0]) {
//             postsData = result[0].docs
//             postCount = result[0].count[0].count
//         }
//         return res.status(200)
//             .json({
//                 status: true,
//                 message: 'Post data',
//                 posts: postsData,
//                 postsCount: postCount,
//             });
//     } catch (err) {
//         return res.status(500).json({
//             error: err,
//             status: false,
//             message: 'Something went wrong',
//         });
//     }
// };

exports.getAllPost = (req, res) => {
    Post.find({ }).sort({create_date: -1})
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

exports.updatePost = async (req, res, next) => {
    console.log("asdddd",req)

    // const result = await cloudinary.uploader.upload(req.file.path);
    // req.body.postImage = result.secure_url
    // const updateValue = await Post.findByIdAndUpdate({_id : req.params.id},{$set : req.body},{new : true})
    const { title, description, image } = req.body;
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
        return res.status(400)
            .json({
                success: false,
                message: "please send userId"
            });
    }
    post.description = description || description === '' ? description : post.description;
    post.title = title ? title : post.title;
    post.image = image ? image : post.image;
    await post.save()

    res.status(200).json({
        success: true,
        message: "success",
        data: post
    })
}


exports.deletePost = async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return res.status(200)
            .json({
                status: false,
                message: 'Please send the  post id!'
            });
    }
    let deletePost = await Post.findOneAndDelete({ _id: id })
    if (!deletePost) {
        return res.status(200)
            .json({
                status: false,
                message: 'No data found',
            });
    }
    return res.status(200)
        .json({
            status: true,
            message: 'Post delete successfully',
        });
}

