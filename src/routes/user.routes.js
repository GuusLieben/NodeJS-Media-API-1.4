const i = require('../..');
const controller = require('../controllers/user.controller');

module.exports = function user_app(app) {

    app.get(i.store.user_single_suffix, controller.getUserById);
    app.get(i.store.user_suffix, controller.getAllUsers);
    app.post(i.store.user_suffix, controller.postUser);
};