const i = require('../index');
module.exports = function movie_app(app) {

    // GET handler for specific movie
    app.get(i.store.movie_single_suffix, (req, res) => i.sendJson(req, res, i.getMovieObj(req.params.movieId)));

    // GET handler for all movies
    app.get(i.store.movies_suffix, (req, res) => i.sendJson(req, res, i.store.movies));

    // DELETE handler for specific movie
    app.delete(i.store.movie_single_suffix, (req, res) => {
        for (let i = 0; i < i.store.movies.length; i++) {
            if (i.store.movies[i].id == req.params.movieId) { // Intentional possibility of type coercion (number <> string)
                i.logger.warn('Removing : ', i.store.movies[i]);
                i.store.movies.splice(i, 1);
                i.sendJson(req, res, '{result: true}');
                return;
            }
        }
        i.sendJson(req, res, '{result: false};');
    });
};