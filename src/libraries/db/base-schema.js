// external imports
const mongoose = require('mongoose');

/**
 * Common properties for all of the collections
 * createdAt, updatedAt, isDeleted
 */

const baseSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: new Date(),
    index: true,
  },
  updatedAt: {
    type: Date,
    default: new Date(),
    index: true,
  },
});

module.exports = {
  baseSchema,
};
