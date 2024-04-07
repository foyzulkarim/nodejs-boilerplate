const Product = require('./schema');
const { AppError } = require('../../libraries/error-handling/AppError');

// Create a new product
const createProduct = async (data) => {
  try {
    const product = new Product(data);
    const savedProduct = await product.save();
    return savedProduct;
  } catch (error) {
    throw new AppError('Failed to create product', error.message);
  }
};

// Get all products
const getAllProducts = async () => {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    throw new AppError('Failed to get products', error.message, 400);
  }
};

// Get a product by ID
const getProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    return product;
  } catch (error) {
    throw new AppError('Failed to get product', error.message);
  }
};

// Update a product by ID
const updateProductById = async (id, data) => {
  try {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    return product;
  } catch (error) {
    throw new AppError('Failed to update product', error.message);
  }
};

// Delete a product by ID
const deleteProductById = async (id) => {
  try {
    await Product.findByIdAndDelete(id);
    return true;
  } catch (error) {
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
