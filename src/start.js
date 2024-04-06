const { startWebServer } = require('./server');

const start = async () => {
  console.log('Hello World');
  await startWebServer();
};

start()
  .then(() => {
    console.log('Done');
  })
  .catch((error) => {
    console.error(error);
  });
