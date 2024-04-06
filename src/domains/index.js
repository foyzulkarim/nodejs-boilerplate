const productRoutes = require('./product');

const defineRoutes = async (expressRouter) => {
  productRoutes(expressRouter);
};

module.exports = defineRoutes;
