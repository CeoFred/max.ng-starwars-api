/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const expressStatusMonitor = require('express-status-monitor');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const charactersController = require('./controllers/characters');
const commentController = require('./controllers/comments');
const movieController = require('./controllers/movie');
/**
 * API keys and Passport configuration.
 */
/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use(expressStatusMonitor());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
/**
 * Primary app routes.
 */
app.post('/api/v1/movie/:id/comment', commentController.addCommentForMovie);
app.get('/api/v1/movie/:id/comments', commentController.getCommentsForMovie);
app.get('/api/v1/movie/comments/ip', commentController.getCommentsForMovieByIp);
app.get('/api/v1/movie/comments/date_created', commentController.getCommentsForMovieByDateCreated);

app.get('/api/v1/movie/:id/characters', movieController.getMovieCharacters);
app.get('/api/v1/movie/:id/', movieController.getMovie);

app.get('/api/v1/characters/', charactersController.getCharacters);
app.get('/api/v1/characters/sort/', charactersController.sortCharacters);
app.get('/api/v1/characters/sort/gender', charactersController.sortCharactersByGender);
/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  });
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
