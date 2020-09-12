const axios = require('axios');
const Comments = require('../models/Comment');

const { successResponse__, ErrorResponse } = require('../utils/apiResponse');

/**
 * GET /charc
 * Movie Characters
 */

exports.getMovieCharacters = async (req, res) => {
  const movie = (req.params.id);
  try {
    const response = await axios.get(`https://swapi.dev/api/films/${movie}/`);
    if (response.detail === 'Not found') {
      return ErrorResponse(res, 'Movie Not Found');
    }
    return successResponse__(res, response.data.characters, 200);
  } catch (error) {
    console.log(error);
    return ErrorResponse(res, 'Failed to fetch Movie');
  }
};

exports.getMovie = async (req, res) => {
  const movie = (req.params.id);
  try {
    const response = await axios.get(`https://swapi.dev/api/films/${movie}/`);
    if (response.detail === 'Not found') {
      return ErrorResponse(res, 'Movie Not Found');
    }
    const commentsForMovie = await Comments.find({ movie });
    return successResponse__(res, { opening_crawl: response.data.opening_crawl, comments: commentsForMovie && commentsForMovie.length }, 200);
  } catch (error) {
    console.log(error);
    return ErrorResponse(res, 'Failed to fetch Movie');
  }
};
