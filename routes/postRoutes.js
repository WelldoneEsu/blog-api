const express = require("express");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");
const {
  createPostValidator,
  updatePostValidator,
  idParamValidator,
  paginationQueryValidator,
} = require("../middleware/validators");

const router = express.Router();

router.route("/")
  .get(paginationQueryValidator, getPosts)
  .post(protect, createPostValidator, createPost);

router.route("/:id")
  .get(idParamValidator, getPostById)
  .put(protect, idParamValidator, updatePostValidator, updatePost)
  .delete(protect, idParamValidator, deletePost);

module.exports = router;