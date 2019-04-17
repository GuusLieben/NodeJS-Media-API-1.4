// Instances of required sources
const express = require('express');
const store = require('./store');
const app = express();

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
    app.get(store.movies_suffix, (req, res) => sendJson(req, res, store.movies, null, 2));

    // DELETE handler for specific movie
    app.delete(store.movie_single_suffix, (req, res) => {
        for (let i = 0; i < store.movies.length; i++) {
            if (store.movies[i].id == req.params.movieId) {
                console.log('Removing : ', store.movies[i]);
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

    // Handle 404's
    app.use((req, res) => {
        console.log('User [', req.headers['x-forwarded-for'] || req.connection.remoteAddress, '] attempted to connect to ', req.originalUrl, ' and was sent 404 Not Found');
        res.status(404).send('This page is as non-existent as my life.');
    });

    // Handle 500's
    app.use((err, req, res) => {
        console.log(err.stack);
        res.status(500).send('This is as broken as my will to live.');
    });
}

// Find User object from user storage, return blank JSON if non-existent
function getUserObj(id) {
    const list = store.users;
    for (let i = 0; i < list.length; i++)
        if (list[i].id == id)
            return list[i];
    return '{}';
}

// Find Movie object from movie storage, return blank JSON if non-existent
function getMovieObj(id) {
    const list = store.movies;
    for (let i = 0; i < list.length; i++)
        if (list[i].id == id)
            return list[i];
    return '{}';
}

// Respond with a JSON element, log client
function sendJson(req, res, msg) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Returning to client at ', ip);
    res.set('Content-Type', 'text/json');
    res.json(msg);
}

// Start the app
user_app(), movie_app(), start_app();
app.listen(port, () => console.log(`App successfully started on ${app.mountpath} on port ${port}!`));