const { routes } = require('./api');

const defineRoutes = (expressRouter) => {
  expressRouter.use('/customer', routes());
};

module.exports = defineRoutes;
