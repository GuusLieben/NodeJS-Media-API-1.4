// Instances of required sources
const express = require('express');
const app = express();
const store = require('./sources/store');
module.exports.store = store;
const movie_routes = require('./sources/movie.routes');
const user_routes = require('./sources/user.routes');
const favicon = require('serve-favicon');
const tedious = require('./sources/tedious');
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
module.exports.logger = logger;

// Settings
const port = 82;

// Start the app
user_routes(app), movie_routes(app), start_app();
app.listen(port, () => logger.log(`App successfully started on ${app.mountpath} on port ${port}!`));

// Default behavior settings of the app
function start_app() {
    app.all('*', (req, res, next) => {
    });
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

    collectSQLServerData();
}

async function collectSQLServerData() {
    await tedious.executeStatement('select null, null, null, null, * from Users union select [title], [description], [release_year], [director], null, null, null, null, null, null, null, null from Movies;', (columns) => {
        if (columns[4].value !== null) {
            logger.debug('Constructing User object');
            let name = columns[4].value;
            let street = columns[5].value;
            let postal = columns[6].value;
            let city = columns[7].value;
            let bv = columns[8].value;
            let birthdate = bv.getDate() + '/' + bv.getUTCMonth() + '/' + bv.getFullYear();
            let phone = columns[9].value;
            let email = columns[10].value;
            let password = columns[11].value;
            store.users.push(new store.User(name, street, city, postal, birthdate, phone, email, password));

        } else {
            logger.debug('Constructing Movie object');
            let title = columns[0].value;
            let description = columns[1].value;
            let release_year = columns[2].value;
            let director = columns[3].value;
            store.movies.push(new store.Movie(title, description, release_year, director));
        }
    });
}

// Get User object from stored users
module.exports.getUserObj = (id) => {
    const arr = store.users;
    logger.debug('Searching for user ..');
    return getObjectFromArray(id, arr);
};

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
