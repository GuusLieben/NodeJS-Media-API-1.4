const i = require('../index');
const tedious = require('../sources/tedious');

module.exports = function movie_app(app) {

    // GET handler for specific movie
    app.get(i.store.movie_single_suffix, (req, res) => {
        let movieObj;
        tedious.executeStatement('select * from Movies where id=' + req.params.movieId, (columns) => {
            movieObj = new i.store.Movie(
                columns[0].value, // Title
                columns[1].value, // Description
                columns[2].value, // Release
                columns[3].value, // Director
                columns[4].value // Id
            );
        }, () => {
            i.sendJson(req, res, movieObj);
        });
    });

    // GET handler for all movies
    app.get(i.store.movies_suffix, (req, res) => {
        let collectedMovies = [];
        tedious.executeStatement('select * from Movies', (columns) => {
            collectedMovies.push(new i.store.Movie(
                columns[0].value, // Title
                columns[1].value, // Description
                columns[2].value, // Release
                columns[3].value, // Director
                columns[4].value // Id
            ));
        }, () => {
            i.sendJson(req, res, collectedMovies);
        });
    });

    // DELETE handler for specific movie
    app.delete(i.store.movie_single_suffix, (req, res) => {
        tedious.executeStatement('delete from Movies where id=' + req.params.movieId,
            (columns) => {
            }, () => {
                i.sendJson(req, res, '{status: success}')
            });
    });
};