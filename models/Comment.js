const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  movie: String,
  comment: String,
  ip: String,
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
