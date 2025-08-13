const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Create comment (auth required)
exports.addComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id,
    });

    res.status(201).json(comment);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// List comments by post (public)
exports.listCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate("author", "name email role")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Delete comment (owner or admin)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isOwner = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};