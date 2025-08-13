const Post = require("../models/Post");

// Create post (auth required)
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags = [] } = req.body;
    const post = await Post.create({ title, content, tags, author: req.user._id });
    res.status(201).json(post);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Get all posts with pagination & filtering
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;


    const query = {};
    if (req.query.author) query.author = req.query.author;
    if (req.query.tags) query.tags = { $in: req.query.tags.split(",").map(t => t.trim().toLowerCase()) };
    if (req.query.from || req.query.to) {
      query.createdAt = {};
      if (req.query.from) query.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) query.createdAt.$lte = new Date(req.query.to);
    }

    const [items, total] = await Promise.all([
      Post.find(query)
        .populate("author", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(query),
    ]);

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      items,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Get single post
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email role");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Update post (owner or admin)
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });

    const { title, content, tags } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (tags !== undefined) post.tags = tags;

    await post.save();
    res.json(post);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Delete post (owner or admin)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};