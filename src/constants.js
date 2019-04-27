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
    if (title == null || title.length === 0) throw 'Invalid title';
    if (descr == null || descr.length === 0) throw 'Invalid title';
    if (!(/^[0-9]{4}$/.test(release))) throw 'Invalid release year';
    if (!(/^[a-zA-Z ]+$/.test(director))) throw 'Invalid director name';

    this.title = title;
    this.description = descr;
    this.release = release;
    this.director = director;
    this.id = movies.length + 1;
};

// User object constructor, exported
module.exports.User = function User(name, street, city, postcode, birthdate, phone, email, password, id) {
    if (!(/^[a-zA-Z ]+$/.test(name))) throw 'Invalid name';
    if (!(/^[-a-zA-Z0-9 ]+$/.test(street))) throw 'Invalid street';
    if (!(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email))) throw 'Invalid email';
    if (password == null || password.length === 0) throw 'Invalid password';

    this.name = name;
    this.street = street;
    this.city = city;
    this.postcode = postcode;
    this.birthdate = birthdate;
    this.phone = phone.replace('\+', '00');
    this.email = email;
    this.password = password;
    this.id = id;
};

// Movie Array
const movies = [];
// Export movie array
module.exports.movies = movies;