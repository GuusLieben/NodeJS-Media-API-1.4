// Instances of required src
const express = require('express');
const app = express();
const store = require('./constants');
module.exports.store = store;
const movie_routes = require('./routes/movie.routes');
const user_routes = require('./routes/user.routes');
const favicon = require('serve-favicon');
const logger = require('tracer').colorConsole({
    transport: function (data) {
        console.log(data.output);
        require('fs').appendFile('./logs/node_api.log', data.rawoutput + '\n', (err) => {
            if (err) throw err;
        });
    }
});
module.exports.logger = logger;

// Settings
const port = 82;

// Start the app
user_routes(app), movie_routes(app), start_app();
app.listen(port, () => logger.log(`App successfully started on ${app.mountpath} on port ${port}!`));

// Default behavior settings of the app
function start_app() {
    app.use(favicon('favicon.ico'));
    app.use(express.static('static'));

    // Handle 404's -> Not found
    app.use((req, res) => {
        logger.debug('User [', req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            '] attempted to connect to ', req.originalUrl, ' and was sent 404 Not Found');
        res.status(404).send('This page is as non-existent as my life.');
    });

    // Handle 500's -> Internal error
    app.use((err, req, res) => {
        logger.error(err.stack);
        res.status(500).send('This is as broken as my will to live.');
    });
}

// Get Movie object from stored movies
module.exports.getMovieObj = (id) => {
    const arr = store.movies;
    logger.debug('Searching for movie ..');
    return getObjectFromArray(id, arr);
};

// Find object from given array, returns blank array if non-existent
function getObjectFromArray(id, arr) {
    logger.debug('Searching for object with id ', id, ' in a list of ', arr.length, ' objects');
    return arr.filter(obj => obj.id == id); // Intentional possibility of type coercion (number <> string)
}

// Respond with a JSON element, log client
module.exports.sendJson = (req, res, msg) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.log('Returning to client at ', ip);
    res.set('Content-Type', 'text/json');
    res.json(msg);
};
