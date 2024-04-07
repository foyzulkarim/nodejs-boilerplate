const mongoose = require('mongoose');
const { baseSchema } = require('../../libraries/db/base-schema');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
});
productSchema.add(baseSchema);

module.exports = mongoose.model('Product', productSchema);

