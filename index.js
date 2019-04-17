// Instances of required sources
const express = require('express');
const app = express();
const store = require('./sources/store');
const logger = require('tracer').console({
    transport: function (data) {
        console.log(data.output);
        require('fs').appendFile('./logs/node_api.log', data.rawoutput + '\n', (err) => {
                if (err) throw err;
            }
        )
        ;
    }
});

// Settings
const port = 82;

// GET, POST handlers for Users
function user_app() {

    // GET handler for specific User
    app.get(store.user_single_suffix, (req, res) => {
        const random = Math.floor(Math.random() * (store.users.length)) + 1;
        let id = req.params.userId === 'random' ? random.toString() : req.params.userId;
        sendJson(req, res, getUserObj(id));
    });

    // GET handler for all users
    app.get(store.user_suffix, (req, res) =>
        sendJson(req, res, store.users));

    // POST handler for new user
    app.post(store.user_suffix, (req, res) => {
        const b = req.query;
        let user = new store.User(b.name, b.street, b.postcode, b.birthdate, b.phone, b.email, b.password);
        store.users.push(user);
        sendJson(req, res, user);
    });
}

// GET, DELETE handlers for Movies
function movie_app() {

    // GET handler for specific movie
    app.get(store.movie_single_suffix, (req, res) => sendJson(req, res, getMovieObj(req.params.movieId)));

    // GET handler for all movies
    app.get(store.movies_suffix, (req, res) => sendJson(req, res, store.movies));

    // DELETE handler for specific movie
    app.delete(store.movie_single_suffix, (req, res) => {
        for (let i = 0; i < store.movies.length; i++) {
            if (store.movies[i].id == req.params.movieId) { // Intentional possibility of type coercion (number <> string)
                logger.warn('Removing : ', store.movies[i]);
                store.movies.splice(i, 1);
                sendJson(req, res, '{result: true}');
                return;
            }
        }
        sendJson(req, res, '{result: false};');
    });
}

// Default behavior settings of the app
function start_app() {
    // Serve the static page defined in /static, served on /
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

// Get User object from stored users
function getUserObj(id) {
    const arr = store.users;
    logger.debug('Searching for user ..');
    return getObjectFromArray(id, arr);
}

// Get Movie object from stored movies
function getMovieObj(id) {
    const arr = store.movies;
    logger.debug('Searching for movie ..');
    return getObjectFromArray(id, arr);
}

// Find object from given array, returns blank array if non-existent
function getObjectFromArray(id, arr) {
    logger.debug('Searching for object with id ', id, ' in a list of ', arr.length, ' objects');
    return arr.filter(obj => obj.id == id); // Intentional possibility of type coercion (number <> string)
}

// Respond with a JSON element, log client
function sendJson(req, res, msg) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.log('Returning to client at ', ip);
    res.set('Content-Type', 'text/json');
    res.json(msg);
}

// Start the app
user_app(), movie_app(), start_app();
app.listen(port, () => logger.log(`App successfully started on ${app.mountpath} on port ${port}!`));