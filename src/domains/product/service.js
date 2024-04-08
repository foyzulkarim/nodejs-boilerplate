const logger = require('../../libraries/log/logger');

const Product = require('./schema');
const { AppError } = require('../../libraries/error-handling/AppError');

// Create a new product
const createProduct = async (data) => {
  try {
    const product = new Product(data);
    const savedProduct = await product.save();
    logger.info('createProduct(): Product created', { id: savedProduct._id });
    return savedProduct;
  } catch (error) {
    logger.error('createProduct(): Failed to create product', error);
    throw new AppError('Failed to create product', error.message);
  }
};

// Get all products
const getAllProducts = async (query) => {
  try {
    const { keyword } = query;
    // search by keyword on name and description fields
    const filter = {};
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }
    const products = await Product.find(filter);
    logger.info('getAllProducts(): Products fetched', {
      filter,
      count: products.length,
    });
    return products;
  } catch (error) {
    logger.error('getAllProducts(): Failed to get products', error);
    throw new AppError('Failed to get products', error.message, 400);
  }
};

// Get a product by ID
const getProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    logger.info('getProductById(): Product fetched', { id });
    return product;
  } catch (error) {
    logger.error('getProductById(): Failed to get product', error);
    throw new AppError('Failed to get product', error.message);
  }
};

// Update a product by ID
const updateProductById = async (id, data) => {
  try {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    logger.info('updateProductById(): Product updated', { id });
    return product;
  } catch (error) {
    logger.error('updateProductById(): Failed to update product', error);
    throw new AppError('Failed to update product', error.message);
  }
};

// Delete a product by ID
const deleteProductById = async (id) => {
  try {
    await Product.findByIdAndDelete(id);
    logger.info('deleteProductById(): Product deleted', { id });
    return true;
  } catch (error) {
    logger.error('deleteProductById(): Failed to delete product', error);
    throw new AppError('Failed to delete product', error.message);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
