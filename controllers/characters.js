const axios = require('axios');
const _ = require('lodash');
const { successResponse__, ErrorResponse } = require('../utils/apiResponse');

exports.getCharacters = async (req, res) => {
  try {
    const characters = await axios.get('https://swapi.dev/api/people/');
    return successResponse__(res, { data: characters.data.results }, 200);
  } catch (error) {
    return ErrorResponse(res, 'Failed to fetch characters');
  }
};

exports.sortCharacters = async (req, res) => {
  if (!req.query.sortType) {
    return ErrorResponse(res, 'Sort Type is required');
  }
  try {
    const { data } = await axios.get('https://swapi.dev/api/people/');
    const sorted = _.sortBy(data.results, [function (o) { return o[req.query.sortType]; }]);
    const totalHeight = _.reduce(sorted.map((r) => Number(r.height)), (sum, n) => sum + n, 0);

    return successResponse__(res, {
      characters: sorted,
      count: sorted && sorted.length,
      totalHeight,
      totalHeightInFt: totalHeight * 0.0328084,
      totalHeightInInches: totalHeight * 0.393701
    }, 200);
  } catch (error) {
    return ErrorResponse(res, 'Failed to fetch characters');
  }
};

exports.sortCharactersByGender = async (req, res) => {
  if (!req.query.gender) {
    return ErrorResponse(res, 'Gender Type is required');
  }

  const isGender = ['male', 'female'].some((s) => s === req.query.gender);

  if (!isGender) {
    return ErrorResponse(res, 'Only Male and Female Gender type is required');
  }
  try {
    const { data } = await axios.get('https://swapi.dev/api/people/');
    const sorted = _.filter(data.results, { gender: req.query.gender });
    const totalHeight = _.reduce(sorted.map((r) => Number(r.height)), (sum, n) => sum + n, 0);
    return successResponse__(res, {
      characters: sorted,
      count: sorted && sorted.length,
      totalHeight,
      totalHeightInFt: totalHeight * 0.0328084,
      totalHeightInInches: totalHeight * 0.393701
    }, 200);
  } catch (error) {
    return ErrorResponse(res, 'Failed to fetch characters');
  }
};
