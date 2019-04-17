// Default URL Suffixes
module.exports.base_suffix = '/api';

// URL Suffixes for movies
module.exports.movies_suffix = module.exports.base_suffix + '/movies';
module.exports.movie_single_suffix = module.exports.movies_suffix + '/:movieId';

// URL Suffixes for users
module.exports.user_suffix = module.exports.base_suffix + '/register';
module.exports.user_single_suffix = module.exports.user_suffix + '/:userId';

// Movie object constructor, exported
module.exports.Movie = function Movie(title, descr, release, director) {
    this.title = title;
    this.description = descr;
    this.release = release;
    this.director = director;
    this.id = movies.length + 1;
};

// User object constructor, exported
module.exports.User = function User(name, street, postcode, birthdate, phone, email, password) {
    this.name = name;
    this.street = street;
    this.postcode = postcode;
    this.birthdate = birthdate;
    this.phone = phone;
    this.email = email;
    this.password = password;
    this.id = users.length + 1;
};

// Movie Array
const movies = [];
// Populate array with two sample movies
movies.push(new module.exports.Movie('Batman', 'You know what this is', 2015, 'Bob Bobberson'));
movies.push(new module.exports.Movie('Niet Batman', 'Don\'t watch this at school', 2019, 'Guus Lieben'));
// Export movie array
module.exports.movies = movies;

// User Array
const users = [];
// Populate array with two sample users
users.push(
    new module.exports.User(
        'Guus Lieben',
        'Arjan-straat 420',
        '1234 AB',
        '23/07/2000',
        '+31 6 2047 3802',
        'guus@xendox.com',
        'hahahaNee123'));
users.push(
    new module.exports.User(
        'Bob Bobberson',
        'Bob-Willem Straat 12',
        '6969 OI',
        '01/02/0304',
        '+12 3456 7890',
        'bob@bob.com',
        'wieIsBobEigenlijk_'));
// Export user array
module.exports.users = users;