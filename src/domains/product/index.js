const { routes } = require('./api');

const defineRoutes = (expressRouter) => {
  expressRouter.use('/products', routes());
};

module.exports = defineRoutes;
