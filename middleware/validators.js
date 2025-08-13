// middleware/validators.js

const { body, param, query, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

const createPostValidator = [
  body("title").isString().trim().isLength({ min: 3 }),
  body("content").isString().isLength({ min: 10 }),
  body("tags").optional().isArray(),
  body("tags.*").optional().isString(),
  handleValidation,
];

const updatePostValidator = [
  body("title").optional().isString().trim().isLength({ min: 3 }),
  body("content").optional().isString().isLength({ min: 10 }),
  body("tags").optional().isArray(),
  body("tags.*").optional().isString(),
  handleValidation,
];

const idParamValidator = [param("id").isMongoId(), handleValidation];

const commentCreateValidator = [
  body("content").isString().isLength({ min: 1 }),
  body("postId").isMongoId(),
  handleValidation,
];

const paginationQueryValidator = [
  query("page").optional().isInt({ min: 1 }).customSanitizer(value => parseInt(value)),
  query("limit").optional().isInt({ min: 1, max: 100 }).customSanitizer(value => parseInt(value)),
  query("author").optional().isMongoId(),
  query("tags").optional().isString(),
  query("from").optional().isISO8601(),
  query("to").optional().isISO8601(),
  handleValidation,
];

module.exports = {
  createPostValidator,
  updatePostValidator,
  idParamValidator,
  commentCreateValidator,
  paginationQueryValidator,
};