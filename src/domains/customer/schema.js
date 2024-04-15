const mongoose = require('mongoose');
const { baseSchema } = require('../../libraries/db/base-schema');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  // other properties
});
schema.add(baseSchema);

module.exports = mongoose.model('Customer', schema);
