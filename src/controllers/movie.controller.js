const mssql = require('../business/mssql');
const i = require('../..');

module.exports = {
    getMovieById: (req, res) => {
        let movieObj;
        mssql.executeStatement('select * from Movies where id=' + req.params.movieId, (columns) => {
            movieObj = new i.store.Movie(
                columns[0].value, // Title
                columns[1].value, // Description
                columns[2].value, // Release
                columns[3].value, // Director
                columns[4].value // Id
            );
        }, () => {
            i.sendJson(req, res, movieObj);
        }).catch(() => {
            res.status(400).json('{success: false}');
        });
    },

    getAllMovies: (req, res) => {
        let collectedMovies = [];
        mssql.executeStatement('select * from Movies', (columns) => {
            collectedMovies.push(new i.store.Movie(
                columns[0].value, // Title
                columns[1].value, // Description
                columns[2].value, // Release
                columns[3].value, // Director
                columns[4].value // Id
            ));
        }, () => {
            i.sendJson(req, res, collectedMovies);
        }).catch(() => {
            res.status(400).json('{success: false}');
        });
    },

    deleteMovie: (req, res) => {
        mssql.executeStatement('delete from Movies where id=' + req.params.movieId,
            (columns) => {
            }, () => {
                i.sendJson(req, res, '{status: success}')
            }).catch(() => {
            res.status(400).json('{success: false}');
        });
    }
};