const i = require('../..');
const controller = require('../controllers/movie.controller');

module.exports = function movie_app(app) {

    app.get(i.store.movies_suffix, controller.getAllMovies);
    app.get(i.store.movie_single_suffix, controller.getMovieById);
    app.delete(i.store.movie_single_suffix, controller.deleteMovie);
};