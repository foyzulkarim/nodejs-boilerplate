const { routes } = require('./api');

const defineRoutes = (expressRouter) => {
  expressRouter.use('/student', routes());
};

module.exports = defineRoutes;
