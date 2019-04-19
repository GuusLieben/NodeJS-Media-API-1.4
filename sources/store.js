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
    this.title = title;

    if (descr == null || descr.length === 0) throw 'Invalid title';
    this.description = descr;

    if (!(/^[0-9]{4}$/.test(release))) throw 'Invalid release year';
    this.release = release;

    if (!(/^[a-zA-Z ]+$/.test(director))) throw 'Invalid director name';
    this.director = director;

    this.id = movies.length + 1;
};

// User object constructor, exported
module.exports.User = function User(name, street, city, postcode, birthdate, phone, email, password, id) {
    if (!(/^[a-zA-Z ]+$/.test(name))) throw 'Invalid name';
    this.name = name;

    if (!(/^[-a-zA-Z0-9 ]+$/.test(street))) throw 'Invalid street';
    this.street = street;

    // if (!(/^[a-zA-Z ]+$/.test(city))) throw 'Invalid city';
    this.city = city;

    // 1111AB || 1111 AB
    // if (!(/^\d{4}?[A-Z]{2}$/i.test(postcode))) throw 'Invalid postal code';
    this.postcode = postcode;

    // dd/mm/yyyy
    // if (!(/^([0-2]{0,1}[0-9]|(3)[0-1])(\/)(([0-9])|((0)[0-9])|((1)[0-2]))(\/)\d{3,4}$/.test(birthdate))) throw 'Invalid birth date';
    this.birthdate = birthdate;

    // if (!(/^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9])((\s|\s?-\s?)?[0-9])((\s|\s?-\s?)?[0-9])\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]$/.test(phone))) throw 'Invalid phone';
    this.phone = phone.replace('\+', '00');

    if (!(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email))) throw 'Invalid email';
    this.email = email;

    if (password == null || password.length === 0) throw 'Invalid password';
    this.password = password;

    this.id = id;
};

// Movie Array
const movies = [];
// Export movie array
module.exports.movies = movies;