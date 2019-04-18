const i = require('../index');
module.exports = function user_app(app) {

    // GET handler for specific User
    app.get(i.store.user_single_suffix, (req, res) => {
        const random = Math.floor(Math.random() * (i.store.users.length)) + 1;
        let id = req.params.userId === 'random' ? random.toString() : req.params.userId;
        i.sendJson(req, res, i.getUserObj(id));
    });

    // GET handler for all users
    app.get(i.store.user_suffix, (req, res) =>
        i.sendJson(req, res, i.store.users));

    // POST handler for new user
    app.post(i.store.user_suffix, (req, res) => {
        i.logger.debug('New User POST');
        const b = req.query;
        let user = new i.store.User(b.name, b.street, b.postcode, b.birthdate, b.phone, b.email, b.password);
        i.store.users.push(user);
        i.sendJson(req, res, user);
    });
};