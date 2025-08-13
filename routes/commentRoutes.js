const express = require("express");
const {
  addComment,
  listCommentsForPost,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");
const { commentCreateValidator, idParamValidator } = require("../middleware/validators");

const router = express.Router();

router.post("/", protect, commentCreateValidator, addComment);
router.get("/post/:postId", listCommentsForPost);
router.delete("/:id", protect, idParamValidator, deleteComment);

module.exports = router;