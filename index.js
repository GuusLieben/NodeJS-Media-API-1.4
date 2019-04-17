const express = require('express');
const store = require('./store');

const app = express();
const port = 82;

function user_app() {
    app.get(store.user_single_suffix, (req, res) => {
        const random = Math.floor(Math.random() * (store.users.length)) + 1;
        let id = req.params.userId === 'random' ? random.toString() : req.params.userId;
        sendJson(req, res, getUserObj(id));
    });

    app.get(store.user_suffix, (req, res) =>
        sendJson(req, res, store.users, null, 2));

    app.post(store.user_suffix, (req, res) => {
        const b = req.query;
        let user = new store.User(b.name, b.street, b.postcode, b.birthdate, b.phone, b.email, b.password);
        store.users.push(user);
        sendJson(req, res, JSON.stringify(user));
    });
}

function movie_app() {
    app.get(store.movies_suffix, (req, res) => sendJson(req, res, store.movies, null, 2));

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

    app.get(store.movie_single_suffix, (req, res) => sendJson(req, res, getMovieObj(req.params.movieId)));
}

function app_handling() {
    app.use(express.static('static'));

    app.use((req, res) => {
        console.log('User attempted to connect to ', req.originalUrl, ' and was sent 404 Not Found');
        res.status(404).send('This page is as non-existent as my life.');
    });

    app.use((err, req, res) => {
        console.log(err.stack);
        res.status(500).send('This is as broken as my will to live.');
    });
}

function getUserObj(id) {
    const list = store.users;
    for (let i = 0; i < list.length; i++)
        if (list[i].id == id)
            return list[i];
    return '{}';
}

function getMovieObj(id) {
    const list = store.movies;
    for (let i = 0; i < list.length; i++)
        if (list[i].id == id)
            return list[i];
    return '{}';
}

function sendJson(req, res, msg) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Returning to user at ', ip);
    res.set('Content-Type', 'text/json');
    res.json(msg);
}

// Start
user_app(), movie_app(), app_handling();
app.listen(port, () => console.log(`App successfully started on ${app.mountpath} on port ${port}!`));