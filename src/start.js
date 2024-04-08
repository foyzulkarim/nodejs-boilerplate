const { startWebServer } = require('./server');

const start = async () => {
  console.log(`Last Run: ${new Date().toLocaleString()}`);
  await startWebServer();
};

start()
  .then(() => {
    console.log('✓ Server started successfully!');
  })
  .catch((error) => {
    console.error(error);
  });
