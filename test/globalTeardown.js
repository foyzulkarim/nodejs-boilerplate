module.exports = async function globalTeardown() {
  const instance = global.__MONGOINSTANCE;
  await instance.stop();
};
