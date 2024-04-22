const config = require('./configs');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');

const defineRoutes = require('./app');
const { errorHandler } = require('./libraries/error-handling');
const logger = require('./libraries/log/logger');
const { addRequestIdMiddleware } = require('./middlewares/request-context');
const { connectWithMongoDb } = require('./libraries/db');

let connection;

const createExpressApp = () => {
  const expressApp = express();
  expressApp.use(addRequestIdMiddleware);
  expressApp.use(helmet());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());

  passport.use(
    new GitHubStrategy(
      {
        clientID: 'client-id-123',
        clientSecret: 'secret-123',
        callbackURL: 'http://localhost:4000/auth/github/callback',
      },
      function (accessToken, refreshToken, profile, cb) {
        logger.info('accessToken', { accessToken, refreshToken, profile });
        // Find or create a user in your database here
        // For now, we'll just return the profile
        return cb(null, profile);
      }
    )
  );

  expressApp.use(
    session({
      secret: 'session-secret-123',
      resave: false,
      saveUninitialized: true,
    })
  );

  expressApp.use(passport.initialize());
  expressApp.use(passport.session());

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  expressApp.use((req, res, next) => {
    // Log an info message for each incoming request
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
  });

  logger.info('Express middlewares are set up');
  expressApp.get('/auth/github', passport.authenticate('github'));
  expressApp.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
      logger.info('Successful authentication');
      // Successful authentication, redirect home.
      res.redirect('http://localhost:3030/');
    }
  );
  expressApp.get('/api/github-data', (req, res) => {
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }

    const accessToken = req.user.accessToken; // Hypothetical - depends on how you store it

    axios
      .get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      })
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        console.error('Error fetching GitHub data:', error);
        res.status(500).json({ error: 'Error fetching data' });
      });
  });
  defineRoutes(expressApp);

  defineErrorHandlingMiddleware(expressApp);
  return expressApp;
};

async function startWebServer() {
  logger.info('Starting web server...');
  const expressApp = createExpressApp();
  const APIAddress = await openConnection(expressApp);
  logger.info(`Server is running on ${APIAddress.address}:${APIAddress.port}`);
  await connectWithMongoDb();
  return expressApp;
}

async function stopWebServer() {
  return new Promise((resolve) => {
    if (connection !== undefined) {
      connection.close(() => {
        resolve();
      });
    }
  });
}

async function openConnection(expressApp) {
  return new Promise((resolve) => {
    const webServerPort = config.PORT;
    logger.info(`Server is about to listen to port ${webServerPort}`);

    connection = expressApp.listen(webServerPort, () => {
      errorHandler.listenToErrorEvents(connection);
      resolve(connection.address());
    });
  });
}

function defineErrorHandlingMiddleware(expressApp) {
  expressApp.use(async (error, req, res, next) => {
    // Note: next is required for Express error handlers
    if (error && typeof error === 'object') {
      if (error.isTrusted === undefined || error.isTrusted === null) {
        error.isTrusted = true;
      }
    }

    errorHandler.handleError(error);
    res.status(error?.HTTPStatus || 500).end();
  });
}

module.exports = { createExpressApp, startWebServer, stopWebServer };
