const axios = require('axios');
const Comments = require('../models/Comment');
const { successResponse__, ErrorResponse } = require('../utils/apiResponse');

exports.addCommentForMovie = async (req, res, next) => {
  try {
    const response = await axios.get(`https://swapi.dev/api/films/${req.params.id}`);
    if (response.detail === 'Not found') {
      return ErrorResponse(res, 'Movie Not Found');
    }
  } catch (error) {
    console.log(error);
    return ErrorResponse(res, 'Failed to fetch Movie');
  }

  if (req.body.comment && req.body.comment.length > 500) {
    return ErrorResponse(res, 'Exceeded comment length');
  }
  const comment = new Comments({
    movie: req.params.id,
    comment: req.body.comment,
    ip: req.connection.remoteAddress
  });

  comment.save((err) => {
    if (err) ErrorResponse(res, err);
    return successResponse__(res, 'Comment Added', 201);
  });
};

exports.getCommentsForMovie = (req, res) => {
  Comments.find({ movie: req.params.id }).then((comments) => {
    if (comments) {
      return successResponse__(res, comments, 200);
    }
  }).catch((err) => {
    console.log(err);
    return ErrorResponse(res, 'Failed to fetch comments');
  });
};

exports.getCommentsForMovieByIp = (req, res) => {
  Comments.find({ ip: req.query.ip }).then((comments) => {
    if (comments) {
      return successResponse__(res, comments, 200);
    }
  }).catch((err) => {
    console.log(err);
    return ErrorResponse(res, 'Failed to fetch comments');
  });
};

exports.getCommentsForMovieByDateCreated = (req, res) => {
  Comments.find({ createdAt: req.query.date }).then((comments) => {
    if (comments) {
      return successResponse__(res, comments, 200);
    }
  }).catch((err) => {
    console.log(err);
    return ErrorResponse(res, 'Failed to fetch comments');
  });
};
